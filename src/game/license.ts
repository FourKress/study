import { verifyAsync } from '@noble/ed25519';

export const FEATURES = ['timed', 'free', 'map', 'table'] as const;
export type Feature = (typeof FEATURES)[number];

export type LicenseState =
  | 'loading'
  | 'ready'
  | 'missing'
  | 'expired'
  | 'invalid'
  | 'offline'
  | 'unconfigured'
  | 'clock';

export interface LicenseStatus {
  state: LicenseState;
  deviceId: string;
  message: string;
  features: Feature[];
}

const SEEN_KEY = 'suan-suan-license-seen';
const DB_NAME = 'suan-suan-license';
const STORE = 'device';
const CLOCK_SKEW_MS = 120_000;

interface StoredDevice {
  alg: 'Ed25519' | 'P-256';
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

interface SignedDevice {
  exp: number;
  feat: string[];
}

class DeviceStoreError extends Error {}

export async function checkLicense(): Promise<LicenseStatus> {
  const publicKey = import.meta.env.VITE_LICENSE_PUBLIC_KEY || '';
  if (import.meta.env.DEV && !publicKey) {
    return status('ready', '', '', [...FEATURES]);
  }

  let deviceId = '';
  try {
    deviceId = await loadDeviceId();
  } catch (error) {
    const message = error instanceof DeviceStoreError ? error.message : '这个浏览器记不住这台设备。换一个浏览器打开。';
    return status('invalid', '', message);
  }

  if (!publicKey) return status('unconfigured', deviceId, '授权还没准备好。加作者微信处理。');

  let response: Response;
  try {
    const url = new URL(`licenses.json?t=${Date.now()}`, new URL(import.meta.env.BASE_URL, window.location.href));
    response = await fetch(url, { cache: 'no-store' });
  } catch {
    return status('offline', deviceId, '暂时连不上。有网时再点重新检查。');
  }
  if (!response.ok) return status('invalid', deviceId, '授权没有通过。加作者微信处理。');

  let body: { payload?: unknown; sig?: unknown };
  try {
    body = await response.json();
  } catch {
    return status('invalid', deviceId, '授权没有通过。加作者微信处理。');
  }
  if (typeof body.payload !== 'string' || typeof body.sig !== 'string') {
    return status('invalid', deviceId, '授权没有通过。加作者微信处理。');
  }

  let signed = false;
  try {
    signed = await verifyAsync(
      base64UrlToBytes(body.sig),
      new TextEncoder().encode(body.payload),
      hexToBytes(publicKey),
    );
  } catch {
    signed = false;
  }
  if (!signed) return status('invalid', deviceId, '授权没有通过。加作者微信处理。');
  if (!acceptClock()) return status('clock', deviceId, '这台设备的时间不对。把时间改回正确后再点重新检查。');

  let payload: { v?: unknown; devices?: unknown };
  try {
    payload = JSON.parse(body.payload) as { v?: unknown; devices?: unknown };
  } catch {
    return status('invalid', deviceId, '授权没有通过。加作者微信处理。');
  }
  if (payload.v !== 1 || !payload.devices || typeof payload.devices !== 'object' || Array.isArray(payload.devices)) {
    return status('invalid', deviceId, '授权没有通过。加作者微信处理。');
  }

  const record = (payload.devices as Record<string, SignedDevice>)[deviceId];
  if (!record || typeof record.exp !== 'number') {
    return status('missing', deviceId, '这台设备还未授权。复制下面的设备码，加作者微信发给他。弄好之后再点重新检查。');
  }
  if (record.exp < Math.floor(Date.now() / 1000)) return status('expired', deviceId, '这台设备的授权到期了。加作者微信续上。');

  const features = Array.isArray(record.feat) ? record.feat.filter(isFeature) : [];
  if (!features.length) return status('invalid', deviceId, '这份授权还没开放玩法。加作者微信处理。');
  return status('ready', deviceId, '', features);
}

function status(state: LicenseState, deviceId: string, message: string, features: Feature[] = []): LicenseStatus {
  return { state, deviceId, message, features };
}

function isFeature(value: string): value is Feature {
  return (FEATURES as readonly string[]).includes(value);
}

function acceptClock() {
  try {
    const now = Date.now();
    const seen = Number(localStorage.getItem(SEEN_KEY) || '0');
    if (Number.isFinite(seen) && seen > 0 && now + CLOCK_SKEW_MS < seen) return false;
    localStorage.setItem(SEEN_KEY, String(Math.max(Number.isFinite(seen) ? seen : 0, now)));
    return true;
  } catch {
    return true;
  }
}

async function loadDeviceId() {
  if (!globalThis.crypto?.subtle || !globalThis.indexedDB) {
    throw new DeviceStoreError('这个浏览器记不住这台设备。换一个浏览器打开。');
  }
  const db = await openDb();
  try {
    let stored = await idbGet(db);
    if (stored && !(await holdsPrivateKey(stored))) stored = null;
    if (!stored) {
      stored = await createPair();
      await idbPut(db, stored);
      if (!(await holdsPrivateKey(stored))) {
        throw new DeviceStoreError('这个浏览器记不住这台设备。换一个浏览器打开。');
      }
    }
    return await publicId(stored);
  } finally {
    db.close();
  }
}

async function createPair(): Promise<StoredDevice> {
  const ed25519 = await tryEd25519();
  if (ed25519) return ed25519;
  const pair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign', 'verify']);
  return { alg: 'P-256', publicKey: pair.publicKey, privateKey: pair.privateKey };
}

async function tryEd25519(): Promise<StoredDevice | null> {
  try {
    const generated = await crypto.subtle.generateKey({ name: 'Ed25519' } as AlgorithmIdentifier, false, ['sign', 'verify']);
    if (!isPair(generated)) return null;
    await crypto.subtle.exportKey('raw', generated.publicKey);
    return { alg: 'Ed25519', publicKey: generated.publicKey, privateKey: generated.privateKey };
  } catch {
    return null;
  }
}

function isPair(value: CryptoKey | CryptoKeyPair): value is CryptoKeyPair {
  return typeof value === 'object' && value !== null && 'publicKey' in value && 'privateKey' in value;
}

async function holdsPrivateKey(device: StoredDevice) {
  const data = crypto.getRandomValues(new Uint8Array(32));
  const algorithm = (
    device.alg === 'Ed25519' ? { name: 'Ed25519' } : { name: 'ECDSA', hash: 'SHA-256' }
  ) as AlgorithmIdentifier;
  try {
    const signature = await crypto.subtle.sign(algorithm, device.privateKey, data);
    return crypto.subtle.verify(algorithm, device.publicKey, signature, data);
  } catch {
    return false;
  }
}

async function publicId(device: StoredDevice) {
  if (device.alg === 'Ed25519') {
    const raw = new Uint8Array(await crypto.subtle.exportKey('raw', device.publicKey));
    return `ed25519.${bytesToBase64Url(raw)}`;
  }
  const spki = new Uint8Array(await crypto.subtle.exportKey('spki', device.publicKey));
  return `p256.${bytesToBase64Url(spki)}`;
}

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function idbGet(db: IDBDatabase) {
  return new Promise<StoredDevice | null>((resolve, reject) => {
    const request = db.transaction(STORE, 'readonly').objectStore(STORE).get('current');
    request.onsuccess = () => {
      const value = request.result as StoredDevice | undefined;
      const stored =
        value &&
        (value.alg === 'Ed25519' || value.alg === 'P-256') &&
        value.publicKey instanceof CryptoKey &&
        value.privateKey instanceof CryptoKey
          ? value
          : null;
      resolve(stored);
    };
    request.onerror = () => reject(request.error);
  });
}

function idbPut(db: IDBDatabase, device: StoredDevice) {
  return new Promise<void>((resolve, reject) => {
    const request = db.transaction(STORE, 'readwrite').objectStore(STORE).put(device, 'current');
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function hexToBytes(hex: string) {
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) throw new Error('公钥无效');
  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

function bytesToBase64Url(bytes: Uint8Array) {
  let text = '';
  for (const byte of bytes) text += String.fromCharCode(byte);
  return btoa(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToBytes(value: string) {
  const pad = value.length % 4 === 0 ? '' : '='.repeat(4 - (value.length % 4));
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/') + pad;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

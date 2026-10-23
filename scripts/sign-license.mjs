import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getPublicKeyAsync, signAsync } from '@noble/ed25519';

const root = process.cwd();
const features = new Set(['free', 'map', 'table', 'timed']);

loadLocalEnv();

const hexKey = (process.env.LICENSE_PRIVATE_KEY || '').trim();
if (!hexKey) {
  console.error('缺少 LICENSE_PRIVATE_KEY。写进 .env.local，或 GitHub 环境 github-pages 的 Secret。');
  console.error('生成一把：node scripts/generate-license-key.mjs');
  process.exit(1);
}
if (!/^[0-9a-fA-F]{64}$/.test(hexKey)) {
  console.error('LICENSE_PRIVATE_KEY 需要是 64 位十六进制（32 字节）。');
  process.exit(1);
}

const payloadObject = normalizeAllowlist(readAllowlist());
const payload = canonical(payloadObject);
const secret = hexToBytes(hexKey);
const signature = await signAsync(new TextEncoder().encode(payload), secret);
const publicKey = await getPublicKeyAsync(secret);

mkdirSync(resolve(root, 'src/generated'), { recursive: true });
writeFileSync(
  resolve(root, 'src/generated/license-public.json'),
  `${JSON.stringify({ key: bytesToHex(publicKey) })}\n`,
);
writeFileSync(
  resolve(root, 'public/licenses.json'),
  `${JSON.stringify({ payload, sig: Buffer.from(signature).toString('base64url') })}\n`,
);

const count = Object.keys(payloadObject.devices).length;
console.log(`已签名 ${count} 台设备`);
console.log(`公钥 ${bytesToHex(publicKey)}`);

function loadLocalEnv() {
  const file = resolve(root, '.env.local');
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const normalized = trimmed.startsWith('export ') ? trimmed.slice(7).trim() : trimmed;
    const eq = normalized.indexOf('=');
    if (eq <= 0) continue;
    const key = normalized.slice(0, eq).trim();
    if (process.env[key] !== undefined) continue;
    let value = normalized.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function readAllowlist() {
  const file = resolve(root, 'license/allowlist.json');
  if (!existsSync(file)) {
    console.error('缺少 license/allowlist.json');
    process.exit(1);
  }
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    console.error('license/allowlist.json 不是合法的 JSON');
    process.exit(1);
  }
}

function normalizeAllowlist(allow) {
  if (!allow || allow.v !== 1 || !allow.devices || typeof allow.devices !== 'object' || Array.isArray(allow.devices)) {
    console.error('license/allowlist.json 需要是 { "v": 1, "devices": {} }');
    process.exit(1);
  }
  const devices = {};
  for (const [id, record] of Object.entries(allow.devices)) {
    if (!id.trim() || id !== id.trim()) {
      console.error('设备码不能是空的，也不能带首尾空格');
      process.exit(1);
    }
    if (!record || !Number.isInteger(record.exp) || record.exp <= 0) {
      console.error(`设备 ${id} 的 exp 需要是正整数 Unix 秒`);
      process.exit(1);
    }
    if (!Array.isArray(record.feat) || record.feat.length === 0) {
      console.error(`设备 ${id} 缺少 feat`);
      process.exit(1);
    }
    const feat = [...new Set(record.feat)];
    for (const item of feat) {
      if (!features.has(item)) {
        console.error(`设备 ${id} 有不认识的玩法 ${item}`);
        process.exit(1);
      }
    }
    devices[id] = { exp: record.exp, feat: feat.sort() };
  }
  return {
    v: 1,
    issued: Math.floor(Date.now() / 1000),
    devices,
  };
}

function canonical(value) {
  if (value === null || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map((item) => canonical(item)).join(',')}]`;
  if (typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`)
      .join(',')}}`;
  }
  throw new Error('授权名单里有不能签名的值');
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes) {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

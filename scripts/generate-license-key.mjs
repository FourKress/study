import { getPublicKeyAsync, utils } from '@noble/ed25519';

const secret = utils.randomSecretKey();
const publicKey = await getPublicKeyAsync(secret);

function bytesToHex(bytes) {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

console.log('把下面这一行写入 .env.local，并设为 GitHub 环境 github-pages 的 Secret，名字是 LICENSE_PRIVATE_KEY。');
console.log('');
console.log(`LICENSE_PRIVATE_KEY=${bytesToHex(secret)}`);
console.log('');
console.log('公钥会在构建时写进页面，不用单独配置：');
console.log(bytesToHex(publicKey));

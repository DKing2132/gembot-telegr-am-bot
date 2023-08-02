import { createCipheriv, createDecipheriv } from 'crypto';
import { ivStr, keyStr } from './constants';

const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = Buffer.from(keyStr, 'hex'); //Creating Key
export const iv = Buffer.from(ivStr, 'hex'); //Creating IV

//Encrypting text
export function encrypt(text: string) {
  let cipher = createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

// Decrypting text
export function decrypt(text: { iv: string; encryptedData: string }) {
  let iv = Buffer.from(text.iv, 'hex');
  let encryptedText = Buffer.from(text.encryptedData, 'hex');
  let decipher = createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

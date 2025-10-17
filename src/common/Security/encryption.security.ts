import CryptoJS from 'crypto-js';

export const encrypt = (plainText: string, secretKey?: string) => {
  return CryptoJS.AES.encrypt(JSON.stringify(plainText), secretKey).toString();
};

export const decrypt = (cipherText: string, secretKey?: string) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

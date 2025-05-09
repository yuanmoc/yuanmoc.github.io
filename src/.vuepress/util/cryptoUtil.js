import CryptoJS from 'crypto-js';

// md5加密
export const md5 = (text) => {
    return CryptoJS.MD5(text).toString();
}

// sha256 加密
export const sha256 = (text) => {
    return CryptoJS.SHA256(text).toString();
}

// 加密
export const encrypt = (content, key) => {
    const encrypt = CryptoJS.AES.encrypt(content, key, {
        iv: key,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypt.toString()
}

// 解密
export const decrypted = (content, key) => {
    const decrypted = CryptoJS.AES.decrypt(content, key, {
        iv: key,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

export const randomBase64 = () => {
    const wordArray = CryptoJS.lib.WordArray.random(16);
    return md5(wordArray.toString(CryptoJS.enc.Base64));
}

export const generatorKey = (password) => {
    return md5(sha256(password))
}

export const checkKeyEqual = (key, password) => {
    return generatorKey(password) === key
}
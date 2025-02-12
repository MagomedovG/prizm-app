import walletUtils from "./walletUtils"
import converters from './converters';
import curve25519_ from './curve25519_';
// import CryptoJS from './aes'
const CryptoJS = require('./CryptoJS');

import 'react-native-get-random-values'
import * as pako from './pako'
function getPrivateKeyByteArray(secretPhrase) {
  let secretPhraseHash = walletUtils.simpleHash(converters.stringToByteArray(secretPhrase));
  let secretPhraseClamp = curve25519_clamp(converters.byteArrayToShortArray(secretPhraseHash));
  return converters.hexStringToByteArray(converters.shortArrayToHexString(secretPhraseClamp));
}

function curve25519_clamp(curve) {
  curve[0] &= 0xFFF8;
  curve[15] &= 0x7FFF;
  curve[15] |= 0x4000;
  return curve;
}

function getSharedSecret(key1, key2) {
  return converters.shortArrayToByteArray(curve25519_(converters.byteArrayToShortArray(key1), converters.byteArrayToShortArray(key2), null));
}

function aesEncrypt(msg, sharedKeyBytes, nonce) {
  // CryptoJS likes WordArray parameters
  let text                = converters.byteArrayToWordArray(msg);
  let sharedKey           = sharedKeyBytes.slice(0); //clone

  for (var i = 0; i < 32; ++i) {
    sharedKey[i] ^= nonce[i];
  };
  let sharedKeyHash       = CryptoJS.SHA256(converters.byteArrayToWordArray(sharedKey));
  let tmp                 = new Uint8Array(16);
  let iv                  = converters.byteArrayToWordArray(crypto.getRandomValues(tmp)); // здесь поменять на react-native-get-random-values
  let encrypted           = CryptoJS.AES.encrypt(text, sharedKeyHash, {iv: iv});
  let ivOut               = converters.wordArrayToByteArray(encrypted.iv);
  let ciphertextOut       = converters.wordArrayToByteArray(encrypted.ciphertext);
  return ivOut.concat(ciphertextOut);
}

const hashMessage = (senderSecretPhrase, message, recipientPublicKey) => {
  // let senderSecretPhrase = 'prizm squeeze treat dress nervous fright whistle spread certainly crush nobodyxhxhdbdbdbxhdbrh second taken forest serve doom split';
  var privatKeyBytes      = getPrivateKeyByteArray(senderSecretPhrase);
  
  var recipientStaticPublicKey  = '669132b0027b2e1d5cff5493de3456bc08e0c5931800b2350fc982ec649f6f52';  // 8HWPR
  console.log(recipientPublicKey === recipientStaticPublicKey, recipientPublicKey)
  var publicKeyBytes      = converters.hexStringToByteArray(recipientPublicKey);
  
  var sharedKeyBytes      = getSharedSecret(privatKeyBytes, publicKeyBytes);
  
  // var message             = "test encrypt message и русские буквы и 3895657345642 и +-*/=()[],.<>`~;:%$#@!";
  var messageBytes        = converters.stringToByteArray(message);
  
  var nonce               = crypto.getRandomValues(new Uint8Array(32)); // здесь поменять на react-native-get-random-values
  var compressedPlaintext = pako.gzip(new Uint8Array(messageBytes));
  var encryptedData       = aesEncrypt(compressedPlaintext, sharedKeyBytes, nonce);

  var encryptedDataHex    = converters.byteArrayToHexString(encryptedData);
  var nonceHex            = converters.byteArrayToHexString(nonce);

  return { encryptedDataHex, nonceHex }

}
                       // R9JKB

//  Далее создаём неподписанную транзакцию как прежде по API.sendMoney и добавляем в request 2 аргумента
//  ....&encryptedMessageData=encryptedDataHex&encryptedMessageNonce=nonceHex
//  Далее полуаем в responce unsignedTransactionsBytes, подписываем локально и отправляем байты подписанной транзакции на ноду как прежде
export default {hashMessage}
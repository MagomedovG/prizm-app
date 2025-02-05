import curve25519 from './curve2';
const CryptoJS = require('./CryptoJS');
import converters from './converters';

export default function signBytes(message, secretPhrase) {
    if (!secretPhrase) {
        throw {"message": $.t("error_encryption_passphrase_required"), "errorCode": 1};
    }
    var messageBytes = converters.hexStringToByteArray(message);
    var secretPhraseBytes = converters.hexStringToByteArray(converters.stringToHexString(secretPhrase));
    var digest = simpleHash(secretPhraseBytes);
    var s = curve25519.keygen(digest).s;
    var m = simpleHash(messageBytes);
    var x = simpleHash(m, s);
    var y = curve25519.keygen(x).p;
    var h = simpleHash(m, y);
    var v = curve25519.sign(h, x, s);
    var signature = converters.byteArrayToHexString(v.concat(h));

    var payload = message.substr(0, 192) + signature + message.substr(320);
    return payload;
}


function simpleHash(b1, b2) {
    var sha256 = CryptoJS.algo.SHA256.create();
    sha256.update(converters.byteArrayToWordArray(b1));
    if (b2) {
        sha256.update(converters.byteArrayToWordArray(b2));
    }
    var hash = sha256.finalize();
    return converters.wordArrayToByteArrayImpl(hash, false);
}

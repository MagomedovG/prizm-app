import curve25519 from './curve25519';
import converters from './converters';
import walletUtils from "@/src/utils/walletUtils"

export default function signBytes(message, secretPhrase) {
    if (!secretPhrase) {
        throw {"message": $.t("error_encryption_passphrase_required"), "errorCode": 1};
    }
    var messageBytes = converters.hexStringToByteArray(message);
    var secretPhraseBytes = converters.hexStringToByteArray(converters.stringToHexString(secretPhrase));
    var digest = walletUtils.simpleHash(secretPhraseBytes);
    var s = curve25519.keygen(digest).s;
    var m = walletUtils.simpleHash(messageBytes);
    var x = walletUtils.simpleHash(m, s);
    var y = curve25519.keygen(x).p;
    var h = walletUtils.simpleHash(m, y);
    var v = curve25519.sign(h, x, s);
    var signature = converters.byteArrayToHexString(v.concat(h));

    var payload = message.substr(0, 192) + signature + message.substr(320);
    return payload;
}




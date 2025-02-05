let initial_codeword = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let codeword_map = [3, 2, 1, 0, 7, 6, 5, 4, 13, 14, 15, 16, 12, 8, 9, 10, 11];
let alphabet = "PRZM23456789ABCDEFGHJKLNQSTUVWXY";
 
let base_32_length = 13;
 
function gmult(first_number, second_number) {
    let gexp = [1, 2, 4, 8, 16, 5, 10, 20, 13, 26, 17, 7, 14, 28, 29, 31, 27, 19, 3, 6, 12, 24, 21, 15, 30, 25, 23, 11, 22, 9, 18, 1];
    let glog = [0, 0, 1, 18, 2, 5, 19, 11, 3, 29, 6, 27, 20, 8, 12, 23, 4, 10, 30, 17, 7, 22, 28, 26, 21, 25, 9, 16, 13, 14, 24, 15];
    if (first_number === 0 || second_number === 0) {
        return 0;
    }
 
    let index = (glog[first_number] + glog[second_number]) % 31;
 
    return gexp[index];
}
 
function _get_account_id_by_account_rs(cypher_string) {
    cypher_string = cypher_string.replace('PRIZM', '');
    cypher_string = cypher_string.replace('-', '');
 
    let codeword = Array(initial_codeword.length).fill(0);
    let codeword_length = 0;
 
    for (let i = 0; i < cypher_string.length; i++) {
        let position_in_alphabet = alphabet.indexOf(cypher_string[i]);
 
        if (position_in_alphabet <= -1 || position_in_alphabet > alphabet.length) {
            continue;
        }
 
        let codeword_index = codeword_map[codeword_length];
        codeword[codeword_index] = position_in_alphabet;
        codeword_length++;
    }
 
    let length = base_32_length;
    let cypher_string_32 = Array(length).fill(0);
    for (let i = 0; i < length; i++) {
        cypher_string_32[i] = codeword[length - i - 1];
    }
 
    let plain_string_builder = [];
    while (true) {
        let new_length = 0;
        let digit_10 = 0;
 
        for (let i = 0; i < length; i++) {
            digit_10 = digit_10 * 32 + cypher_string_32[i];
 
            if (digit_10 >= 10) {
                cypher_string_32[new_length] = Math.floor(digit_10 / 10);
                digit_10 %= 10;
                new_length++;
            } else if (new_length > 0) {
                cypher_string_32[new_length] = 0;
                new_length++;
            }
        }
 
        length = new_length;
        plain_string_builder.push(String.fromCharCode(digit_10 + '0'.charCodeAt(0)));
 
        if (length <= 0) {
            break;
        }
    }
 
    return parseInt(plain_string_builder.reverse().join(''));
}
 
export default function encode(plain) {
    let plain_string = plain.toString();
    let length = plain_string.length;
    let plain_string_base_10 = new Array(20).fill(0);
    

    for (let i = 0; i < length; i++) {
        plain_string_base_10[i] = plain_string.charCodeAt(i) - '0'.charCodeAt(0);
    }
    
    let codeword_length = 0;
    let codeword = new Array(initial_codeword.length).fill(0);
    
    while (length > 0) {
        let new_length = 0;
        let digit_base_32 = 0;
        for (let i = 0; i < length; i++) {
            digit_base_32 = digit_base_32 * 10 + plain_string_base_10[i];
            if (digit_base_32 >= 32) {
                plain_string_base_10[new_length] = digit_base_32 >> 5;
                digit_base_32 &= 31;
                new_length += 1;
            } else if (new_length > 0) {
                plain_string_base_10[new_length] = 0;
                new_length += 1;
            }
        }
        length = new_length;
        codeword[codeword_length] = digit_base_32;
        codeword_length += 1;
    }
    
    let p = [0, 0, 0, 0];
    for (let i = base_32_length - 1; i >= 0; i--) {
        let fb = codeword[i] ^ p[3];
        p[3] = p[2] ^ gmult(30, fb);
        p[2] = p[1] ^ gmult(6, fb);
        p[1] = p[0] ^ gmult(9, fb);
        p[0] = gmult(17, fb);
    }
    
    codeword.push(...p);
    
    let cypher_string_builder = [];
    for (let i = 0; i < 17; i++) {
        let codework_index = codeword_map[i];
        let alphabet_index = codeword[codework_index];
        cypher_string_builder.push(alphabet[alphabet_index]);
    
        if ((i & 3) == 3 && i < 13) {
            cypher_string_builder.push('-');
        }
    }
    
    return cypher_string_builder.join('')
}

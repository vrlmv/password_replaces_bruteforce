

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

class Passwords
{

    words;
    replaces;
    hash;

    constructor(words, replaces, hash) {
        this.words = words;
        this.replaces = replaces;
        this.hash = hash;
    }

    findPassword() {
        let passwords = [];
        let brutedPassword = '';

        this.words.forEach(word => {
            if (MD5(word) === this.hash) {
                brutedPassword = word;
            }
            passwords = this.findReplaces(word);

            passwords.forEach(password => {
                let passwordHash = MD5(password);
                if (passwordHash === this.hash) {
                    brutedPassword = password;
                }
            })
        });

        return brutedPassword;
    }

    findReplaces(word) {
        let positions = {};
        let strArr = [];
        let result = [];

        for (let symbol in this.replaces) {
            if (symbol === '') {
                continue;
            }
            positions = Object.assign(this.strpos_recursive(word, symbol), positions);
        }

        let combinations = this.getCombinations(Object.keys(positions));
        let str = word;

        combinations.forEach(combination => {
            let variant = combination.split('_');

            strArr = str.split('');

            variant.forEach(offset => {
                strArr[offset] = positions[offset];
            })

            result.push(strArr.join(''));
        });

        return result;


    }



    getCombinations(chars) {
        var result = [];
        var f = function(prefix, chars) {
            for (var i = 0; i < chars.length; i++) {
                result.push(prefix + chars[i]);
                f(prefix + chars[i] + '_', chars.slice(i + 1));
            }
        }
        f('', chars);
        return result;
    }

    strpos_recursive(haystack, needle, offset = 0, results = {}) {
        let offset1 = this.strpos(haystack, needle, offset);
        if (offset1 === false) {
            return results;
        } else {
            results[offset1] = this.replaces[needle];
            return this.strpos_recursive(haystack, needle, offset1+1, results);
        }
    }

    strpos (haystack, needle, offset) {
        var i = (haystack + '')
            .indexOf(needle, (offset || 0))
        return i === -1 ? false : i
    }
}
String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

var BreakException = {};

class Passwords {

    words;
    replaces;
    hash;
    brutedPassword = {};
    currWord = '';

    constructor(words, replaces, hash) {
        this.words = words;
        this.replaces = replaces;
        this.hash = hash;
    }

    findPassword() {
        let passwords = [];

        try {
            this.words.forEach(word => {
                this.currWord = word;
                if (JSON.stringify(this.brutedPassword) !== JSON.stringify({})) {
                    return;
                }

                if (MD5(word.trim()) === this.hash) {
                    (this.brutedPassword)['originalWord'] = word;
                    (this.brutedPassword)['startWord'] = word;
                    throw BreakException;
                }
                let passwordCombinations = this.findReplaces(word);

                // passwordCombinations.forEach(combination => {
                //
                //     if (MD5(combination) === this.hash) {
                //         (this.brutedPassword)['originalWord'] = combination;
                //         (this.brutedPassword)['startWord'] = word;
                //         throw BreakException;
                //     }
                // })

            });
        } catch (e) {
            if (e !== BreakException) throw e;
        }


        return this.brutedPassword;
    }

    findReplaces(word) {
        let positions = {};
        let strArr = [];
        let result = [];


        for (let index in this.replaces) {
            let symbols = this.replaces[index];
            for (let symbol in symbols) {
                if (symbol === '') {
                    continue;
                }

                positions = Object.assign(this.strpos_recursive(word, index), positions);
            }
        }
        let combinations = this.getCombinations(Object.keys(positions));
        let str = word;
        combinations.forEach(combination => {
            let variant = combination.split('_');

            strArr = str.split('');
            variant.forEach(offset => {

                strArr[offset] = positions[offset];
            })
            result.push(strArr);
        });

        result.forEach(vart => {
            this.getHardCombinations(vart);
        })


    }

    getHardCombinations(variant) {
        let combos = [],
            indexes = [];

        variant.forEach((char, index) => {
            if (Array.isArray(char)) {
                indexes.push(index);
                combos.push(char);
            }
        });

        let combine = combineArrays(combos);

        combine.forEach((combo, index) => {
            let passwd = variant;
            let positions = combo.split('_').join('').split(''); // [0] ==== [0,2,// 1,3]
            positions.forEach((positionInVariant, indexOfString) => {
                let symbol = combos[indexOfString][positionInVariant]; // y
                passwd[indexes[indexOfString]] = symbol;
            })
            if (MD5(passwd.join('').trim()) === this.hash) {
                (this.brutedPassword)['originalWord'] = passwd.join('');
                (this.brutedPassword)['startWord'] = this.currWord;
                throw BreakException;
            }
        })
    }

    getCombinations(chars) {
        var result = [];
        var f = function (prefix, chars) {
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
            return this.strpos_recursive(haystack, needle, offset1 + 1, results);
        }
    }

    strpos(haystack, needle, offset) {
        var i = (haystack + '')
            .indexOf(needle, (offset || 0))
        return i === -1 ? false : i
    }
}

function combineArrays(array_of_arrays) {
    if (!array_of_arrays) {
        return [];
    }
    if (!Array.isArray(array_of_arrays)) {
        return [];
    }
    if (array_of_arrays.length == 0) {
        return [];
    }
    for (let i = 0; i < array_of_arrays.length; i++) {
        if (!Array.isArray(array_of_arrays[i]) || array_of_arrays[i].length == 0) {
            return [];
        }
    }
    let odometer = new Array(array_of_arrays.length);
    odometer.fill(0);
    let output = [];
    let newCombination = formCombination(odometer, array_of_arrays);
    output.push(newCombination);
    while (odometer_increment(odometer, array_of_arrays)) {
        newCombination = formCombination(odometer, array_of_arrays);
        output.push(newCombination);
    }
    return output;
}


function formCombination(odometer, array_of_arrays) {
    return odometer.reduce(function (accumulator, odometer_value, odometer_index) {
        return "" + accumulator + odometer_value + "_";
    }, "");
}

function odometer_increment(odometer, array_of_arrays) {
    for (let i_odometer_digit = odometer.length - 1; i_odometer_digit >= 0; i_odometer_digit--) {
        let maxee = array_of_arrays[i_odometer_digit].length - 1;
        if (odometer[i_odometer_digit] + 1 <= maxee) {
            odometer[i_odometer_digit]++;
            return true;
        } else {
            if (i_odometer_digit - 1 < 0) {
                return false;
            } else {
                odometer[i_odometer_digit] = 0;
                continue;
            }
        }
    }
}

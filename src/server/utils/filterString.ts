const SPACE = 32;
const DEL = 127;
const END = 254;
const REPLACE_WITH = ".";
const filterString = (input: string): string => {
    if (typeof input === "object" || !input.length) { return input; }
    let output: string = "";
    let flag: boolean = false;
    try {
        for (const char of input.split("")) {
            if (flag) {
                if (char === "]") {
                    flag = false;
                    output += char;
                    continue;
                }
                const code = char.charCodeAt(0);
                // Exclude Invalid Ascii Char from result as per JSON standard
                if (SPACE <= code && code !== DEL && code < END) {
                    output += char;
                } else {
                    output += REPLACE_WITH;
                }
            } else {
                if (char === "[") { flag = true; }
                output += char;
            }
        }
    } catch (err) {
        throw new Error("Invalid format is passed");
    }
    return output;
}

export default filterString;


import { FIELD_SPECIFIERS, isValidFilter } from "./isValidFilter";

const formatStringToArray = (input: string, skipX = true): string[] => {
    if (typeof input !== "string" || input.length === 0 || !isValidFilter(input)) {
        return [];
    }
    const result: string[] = [];
    let tmpStr = "";
    input.split(" ")[0].split("").forEach((char: string) => {
        if (FIELD_SPECIFIERS.includes(char)) {
            if (tmpStr.length) {
                result.push(tmpStr);
                tmpStr = "";
            }
        }
        tmpStr += char;
        if (tmpStr && char === "*") {
            result.push(tmpStr);
            tmpStr = "";
        }
    });
    if (tmpStr.length) { result.push(tmpStr); }
    if (skipX) {
        return result.filter((r: string) => (
            !r.startsWith("x") && !r.startsWith("X")
        ));
    }
    return result;
};

export default formatStringToArray;

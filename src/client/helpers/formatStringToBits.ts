import { FIELD_SPECIFIERS } from "./isValidFilter";

export enum RESULT {
    rest = -1,
    invalid = 0,
}

export const FIELD_SPECIFIER_DICT: { readonly[index: string]: number } = {
    "@": 8,
    "A": 8,
    "B": 1,
    "C": 8,
    "H": 4,
    "I": 32,
    "S": 16,
    "W": 64,
    "X": -8,
    "a": 8,
    "b": 1,
    "c": 8,
    "d": 64, // depends on environment
    "f": 32, // depends on environment
    "h": 4,
    "i": 32,
    "s": 16,
    "w": 64,
    "x": 8,
};

export const formatStringToBits = (input: string): number => {
    const matched = input.match(/^(\w)(\d+|\*)?/) || [];
    const c = matched[1];
    const n = matched[2] || "1";
    if (!c || FIELD_SPECIFIERS.indexOf(c) === -1) {
        return RESULT.invalid;
    }
    if (n === "*") {
        return RESULT.rest;
    }
    return FIELD_SPECIFIER_DICT[c] * parseInt(n, 10);
};

export default formatStringToBits;

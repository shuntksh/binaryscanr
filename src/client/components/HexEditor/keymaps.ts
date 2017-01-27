export const CODE = {
    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,
    a: 65,
    b: 66,
    c: 67,
    d: 68,
    e: 69,
    f: 70,
    i: 73,
    j: 74,
    k: 75,
    l: 76,
    v: 86,
    x: 88,
};

export const CODE_TO_KEY = {
    48: "0",
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9",
    65: "a",
    66: "b",
    67: "c",
    68: "d",
    69: "e",
    70: "f",
};

export const BS     = 8;
export const TAB    = 9;
export const ENTER  = 13;
export const ESC    = 27;
export const SPACE  = 32;
export const LEFT   = 37;
export const UP     = 38;
export const RIGHT  = 39;
export const DOWN   = 40;
export const DEL    = 46;

export const ARROW_KEYS    = [ UP, DOWN, LEFT, RIGHT, ENTER, CODE.i, CODE.j, CODE.k, CODE.l ];
export const HEX_KEYS      = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70];
export const ALLOWED_KEYS  = [BS, DEL, SPACE, TAB, ESC, CODE.x, ...ARROW_KEYS, ...HEX_KEYS];
export const CTRL_KEYS     = [224, 17, 91, 93];

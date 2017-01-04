export const FIELD_SPECIFIERS: ReadonlyArray<string> = [
    "a", "A", "b", "B", "H", "h", "c", "s", "S", "t", "i", "I",
    "n", "w", "W", "f", "r", "R", "d", "q", "Q", "x", "X", "@",
];

/**
 * @description Validate if input format string is valid tcl or not
 */
export const isValidFilter = (filterString?: string): boolean => {
    // Empty input always validated as valid input for the simplicity of UI
    if (!filterString) { return true; }

    const REGEX = /(^\*$|^([@ABHIQRSWXabcdfhinqrstwx](?:\d+|\*)?)+$)/g;
    return REGEX.test(filterString.trim().split(/\s/)[0]);
};

export default isValidFilter;

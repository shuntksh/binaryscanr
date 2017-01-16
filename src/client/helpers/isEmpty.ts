export const isEmpty = (value?: {} | string | any[]): boolean => {
    if (value === null || value === undefined) { return true; }
    if (Array.isArray(value) || typeof value === "string") {
        return !value.length;
    }
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    const keys = Object.keys(value).filter((key) => key !== "constructor");
    let result = true;
    keys.forEach((key) => {
        if (hasOwnProperty.call(value, key)) { result = false; }
    });
    return result;
};
export default isEmpty;

export const removeElementById = (id: number, arry: number[]): void => {
    const idx = arry.indexOf(id);
    if (Array.isArray(arry) && idx === -1) {
        arry.splice(idx, 1);
    }
}

export const clearTimeouts = (arry: number[], id?: number): void => {
    let idx = arry.length;
    while (--idx) {
        const _id = arry[idx];
        if (typeof id === "number" && id >= 0) {
            if (id === _id) {
                (window || global).clearTimeout(id);
                arry.splice(idx, 1);
            }
        } else {
            (window || global).clearTimeout(id);
            arry.splice(idx, 1);
        }  
    }
}

/**
 * A wrapper function for setTimeout to automatically populate an array
 * passed to the function. Unlike normal setTimeout, it does not accept an
 * array of argument to cb as its argument. So you have to create lambda
 * to include all the arguments required.
 * @param cb - A callback function with argument
 * @param ms - Delay in millisecond
 * @param arry - An array of setTimeout ids (pass-by-reference)
 */
export const setTimeout = (cb: () => any, ms: number, arry: number[]): number => {
    const id = (window || global).setTimeout(() => {
        cb();
        removeElementById(id, arry);
    }, ms);
    if (Array.isArray(arry) && arry.indexOf(id) === -1) {
        arry.push(id);
    }
    return id;
};

export default setTimeout;

/* tslint:disable:object-literal-sort-keys */

export interface Colors {
    [key: string]: string;
}

export const colors: Colors = {
    lime: "#d1f26d",
    pink: "#ffccff",
    blue: "#99ccff",
    lightBlue: "#88ffff",
    yellow: "#ffff66",
    orange: "#ffcc99",
    brown: "#cc9966",
};

export const getColorByIndex = (idx?: number): string => {
    const c = Object.keys(colors).map((key: string) => colors[key]);
    const max = c.length - 1;
    let _idx = idx;
    if (!_idx && _idx !== 0) {
        _idx = Math.floor(Math.random() * (max + 1));
    } else if (_idx > max) {
        _idx = _idx % max;
    }
    return c[_idx];
};

export default { colors };

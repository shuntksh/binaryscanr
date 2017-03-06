import { Store } from "redux";

import { AppState } from "../app";
import { actions } from "./module";

const _timerRef: number[] = [];

const _setTimeout = (callback: () => any, ms: number): number => {
    const id = (window || global).setTimeout(() => {
        const idx = _timerRef.indexOf(id);
        if (idx !== -1) { _timerRef.splice(idx, 1); }
        if (typeof callback === "function") { callback(); }
    }, ms);
    _timerRef.push(id);
    return id;
};

const _cancelReplay = (): void => {
    if (_timerRef.length) {
        _timerRef.forEach((id) => (window || global).clearTimeout(id));
    }
};

const _exampleReplayer = (
    value: string,
    filter: string,
    store: Store<AppState>,
): void => {
    _cancelReplay();
    store.dispatch(actions.updateHexData(value));
    let delay = 500;
    const interval = 100;
    const _filterArr = filter.split("");
    for (let i = 1; i <= _filterArr.length; i++) {
        delay += interval;
        const id = _setTimeout(
            () => store.dispatch(actions.updateInputValue(filter.slice(0, i))),
            delay,
        );
        if (_timerRef.indexOf(id) === -1) {
            _timerRef.push(id);
        }
    }
};

const exampleHandler = (store: Store<AppState>): void => {
    let prevState: string = "";
    store.subscribe((): void => {
        const state = store.getState(); // The state is immutable Map.
        const example = state.get("example");
        if (!example || example === prevState) {
            if (prevState && !example) {
                prevState = "";
                _cancelReplay();
            }
            return void 0;
        }
        if (example && example !== prevState) {
            prevState = example;
            let value = "";
            let filter = "";
            if (example === "random") {
                const _arr = new Uint32Array(120);
                (window || global).crypto.getRandomValues(_arr);
                _arr.forEach((item) => value += item.toString(16));
                filter = "b32B32H16H16f2x128a32 bin Bin Hex hex float ascii";
            }

            if (value && typeof filter === "string") {
                _exampleReplayer(value, filter, store);
            }
        }
    });
};

export default exampleHandler;

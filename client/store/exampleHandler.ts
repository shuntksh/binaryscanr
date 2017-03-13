
import axios, { CancelTokenSource } from "axios";
import { Store } from "redux";

import { AppState } from "../app";
import { examples } from "../constants";
import { clearTimeouts, removeElementById, setTimeout } from "../helpers/setTimeout";
import { actions } from "./module";

interface ExampleResponse {
    filter: string;
    value: string;
}

const _timerRef: number[] = [];
const _cancelTokens: CancelTokenSource[] = [];

const cancelRequests = (): void => {
    let i = _cancelTokens.length;
    while (--i >= 0) {
        _cancelTokens[i].cancel();
        _cancelTokens.splice(i, 1);
    }
};

const _exampleReplayer = (
    value: string,
    filter: string,
    store: Store<AppState>,
): void => {
    clearTimeouts(_timerRef);
    store.dispatch(actions.updateHexData(value));
    let delay = 500;
    const interval = 100;
    const _filterArr = filter.split("");
    for (let i = 1; i <= _filterArr.length; i++) {
        delay += interval;
        const id = setTimeout(
            () => store.dispatch(actions.updateInputValue(filter.slice(0, i))),
            delay,
            _timerRef,
        );
        if (_timerRef.indexOf(id) === -1) {
            _timerRef.push(id);
        }
    }
};

const fetchExample = (
    name: string,
    cancelTokenSource: CancelTokenSource,
    store: Store<AppState>,
): void => {
    axios.get(`/api/example/${name}`, { cancelToken: cancelTokenSource.token, timeout: 1000 })
        .then((res) => {
            removeElementById(cancelTokenSource, _cancelTokens);
            store.dispatch(actions.stopLoading());
            const { filter, value } = res.data as ExampleResponse;
            _exampleReplayer(value, filter, store);
        })
        .catch((err) => {
            const errorMsg = (err.response ? err.response.data.error : err.message) ||
                            err.message ||
                            "Unknown Error";
            store.dispatch(actions.stopLoading());
            store.dispatch(actions.apiError(errorMsg));
        });
};

const exampleHandler = (store: Store<AppState>): void => {
    let prevState: string = "";
    store.subscribe((): void => {
        const state = store.getState(); // The state is immutable Map.
        const example = state.get("example");
        if (!example || example === prevState) {
            if (prevState && !example) {
                prevState = "";
                clearTimeouts(_timerRef);
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
                _exampleReplayer(value, filter, store);
                return void 0;
            }

            if (examples.indexOf(example) > -1) {
                store.dispatch(actions.startLoading());
                // Cancel inflight request (if any)
                if (_cancelTokens.length) {
                    cancelRequests();
                }
                const cancelSource = axios.CancelToken.source();
                _cancelTokens.push(cancelSource);
                fetchExample(example, cancelSource, store);
                return void 0;
            }
        }
    });
};

export default exampleHandler;

import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { fromJS } from "immutable";
import { Store } from "redux";
import { AppState } from "../app";
import { actions } from "./module";

import throttle = require("lodash.throttle");

interface APIBody {
    formatString: string;
    input: string;
}

const API_PATH = "/api/process";
const TOKEN_PATH = "/api/token";
const REQUEST_INTERVAL = 250; // ms
const request = axios.create({ timeout: 1000 });

request.interceptors.request.use((config: AxiosRequestConfig ): any => {
    return new Promise((resolve) => {
        axios.get(TOKEN_PATH)
            .then((res) => {
                if (typeof (res.data || {})._csrf === "string") {
                    config.headers["x-csrf-token"] = res.data._csrf;
                }
                resolve(config);
            })
            .catch(() => { resolve(config); });
    });
});

const apiHandler = (store: Store<AppState>): void => {
    let prevState: any = fromJS({});
    store.subscribe(throttle((): void => {
        const state = store.getState(); // The state is Immutable Map
        if (state.get("isLoading") === true || state.get("valid") === false) {
            return void 0;
        }
        const prevFmtString = (prevState.get("input") || "").split(" ")[0];
        const currFmtString = (state.get("input") || "").split(" ")[0];
        if (
            typeof prevState.get === "function" &&
            state.get("input").length > 0 &&
            state.get("hexData").length > 0 &&
            (
                prevFmtString !== currFmtString ||
                prevState.get("hexData") !== state.get("hexData")
            )
        ) {
            store.dispatch(actions.startLoading());
            const body: APIBody = {
                formatString: state.get("input"),
                input: state.get("hexData"),
            };
            request.post(API_PATH, body)
                .then((res) => {
                    let data = res.data;
                    if (typeof data === "string") {
                        data = JSON.parse(`${data}`);
                    }
                    store.dispatch(actions.updateResults(data.results));
                    store.dispatch(actions.stopLoading());
                })
                .catch((err: AxiosError) => {
                    const errorMsg = err.response ?
                        err.response.data.error : err.message;
                    store.dispatch(actions.stopLoading());
                    store.dispatch(actions.apiError(errorMsg));
                });
        }
        prevState = state;
    }, REQUEST_INTERVAL));
};

export default apiHandler;

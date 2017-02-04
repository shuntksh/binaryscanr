import axios, { AxiosRequestConfig } from "axios";
import { fromJS } from "immutable";
import { Store } from "redux";
import { AppState } from "../app";
import { actions } from "../store/module";

// @types/lodash.throttle only allow commonJS import.
/* tslint:disable-next-line:no-var-requires */
const throttle = require("lodash.throttle");

interface APIBody {
    formatString: string;
    input: string;
}

const API_PATH = "/api/process";
const TOKEN_PATH = "/api/token";
const REQUEST_INTERVAL = 500; // ms
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
        if (
            typeof prevState.get === "function" &&
            state.get("input").length > 0 &&
            state.get("hexData").length > 0 &&
            (
                prevState.get("input") !== state.get("input") ||
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
                    console.log("1", res);
                    let data = res.data;
                    if (typeof data === "string") {
                        console.log(data[20], data.charCodeAt(20));
                        data = JSON.parse(`${data}`);
                    }
                    console.log(data, typeof data);
                    store.dispatch(actions.stopLoading());
                })
                .catch((err: Error) => {
                    console.log(err);
                    store.dispatch(actions.stopLoading());
                    store.dispatch(actions.apiError(err.message));
                });
        }
        prevState = state;
    }, REQUEST_INTERVAL));
};

export default apiHandler;

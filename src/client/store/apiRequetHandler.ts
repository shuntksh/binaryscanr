import axios from "axios";
import { fromJS } from "immutable";
import { Store } from "redux";
import { AppState } from "../app";
import { actions } from "../store/module";

// @types/lodash.debounce only allow commonJS import.
/* tslint:disable-next-line:no-var-requires */
const debounce = require("lodash.debounce");

interface APIBody {
    formatString: string;
    input: string;
}

const API_PATH = "/api/process";
const REQUEST_INTERVAL = 500; // ms

const request = axios.create({
    timeout: 1000,
});

const apiHandler = (store: Store<AppState>): void => {
    let prevState: any = fromJS({});
    store.subscribe(debounce((): void => {
        const state = store.getState(); // The state is Immutable Map
        console.log(state.toJS());
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
                    console.log(res);
                    store.dispatch(actions.stopLoading());
                })
                .catch((err: Error) => {
                    console.log(err.message);
                });
        }
        prevState = state;
    }, REQUEST_INTERVAL));
};

export default apiHandler;

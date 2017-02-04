import * as React from "react";
import * as ReactDom from "react-dom";
import { Provider } from "react-redux";

import { fromJS, Map } from "immutable";

import apiHandler from "./helpers/apiRequetHandler";
import MainLayout from "./layouts/Main";
import apiHandler from "./store/apiRequetHandler";
import configureStore from "./store/configureStore";

export interface AppState extends Map<string, any> {
    input?: string;
    data?: string;
    vars?: Variables[];
    valid?: boolean;
    isLoading?: boolean;
};

export interface AppWindow extends Window {
    __PRELOADED_STATE__: AppState;
}

export interface Variables extends Map<string, string | undefined> {
    name?: string;
    value?: string;
}

const hexData: string[] = [];
for (let i = 0; i < 440; i += 1) { hexData.push("00"); }

const initialState: AppState =
    fromJS((window as AppWindow).__PRELOADED_STATE__ ||
    { input: "", hexData, vars: [], valid: true, isLoading: false });

// Load initial state from passed by the backend
const store = configureStore(initialState);
apiHandler(store);

ReactDom.render(
    <Provider store={store}><MainLayout /></Provider>,
    document.getElementById("main"),
);

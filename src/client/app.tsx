import * as React from "react";
import * as ReactDom from "react-dom";
import { Provider } from "react-redux";

import { fromJS, Map } from "immutable";

import MainLayout from "./layouts/Main";
import apiHandler from "./store/apiRequetHandler";
import configureStore from "./store/configureStore";
import exampleHandler from "./store/exampleHandler";

export interface AppState extends Map<string, any> {
    input?: string;
    hexData?: string;
    vars?: Result[];
    valid?: boolean;
    isLoading?: boolean;
    results?: Result[];
    tab?: string;
};

export interface AppWindow extends Window {
    __PRELOADED_STATE__: AppState;
}

export interface Result extends Map<string, string | undefined> {
    setByUser?: boolean;
    value?: string;
    varName?: string;
    formatter?: string;
    highlight?: string;
}

let hexData: string = "";
for (let i = 0; i < 440; i += 1) { hexData += "00"; }

export const initialState: AppState = fromJS(
    (window as AppWindow).__PRELOADED_STATE__ ||
    {
        hexData,
        input: "",
        isLoading: false,
        results: [],
        tab: "help",
        valid: true,
        vars: [],
    },
);

// Load initial state from passed by the backend
const store = configureStore(initialState);
apiHandler(store);
exampleHandler(store);

ReactDom.render(
    <Provider store={store}><MainLayout /></Provider>,
    document.getElementById("main"),
);

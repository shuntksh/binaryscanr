import * as React from "react";
import * as ReactDom from "react-dom";
import { Provider } from "react-redux";

import { fromJS, Map } from "immutable";

import MainLayout from "./layouts/Main";
import configureStore from "./store/configureStore";

export interface AppState extends Map<string, any> {
    input?: string;
    data?: string;
    vars?: Variables[];
    valid?: boolean;
};

export interface AppWindow extends Window {
    __PRELOADED_STATE__: AppState;
}

export interface Variables extends Map<string, string | undefined> {
    name?: string;
    value?: string;
}

const initialState: AppState =
    fromJS((window as AppWindow).__PRELOADED_STATE__ ||
    { input: "", data: "", vars: [], valid: true });

// Load initial state from passed by the backend
const store = configureStore(initialState);

ReactDom.render(
    <Provider store={store}><MainLayout /></Provider>,
    document.getElementById("main"),
);

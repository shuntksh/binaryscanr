import * as React from "react";
import * as ReactDom from "react-dom";
import { Provider } from "react-redux";

import { fromJS, Map } from "immutable";

import MainLayout from "./layouts/Main";
import configureStore from "./store/configureStore";

export interface IAppState extends Map<string, any> {
    input?: string;
    data?: string;
    vars?: IVariables[];
    valid?: boolean;
};

export interface IVariables extends Map<string, string | undefined> {
    name?: string;
    value?: string;
}

interface AppWindow extends Window {
    __PRELOADED_STATE__: IAppState;
}

const initialState: IAppState =
    fromJS((window as AppWindow).__PRELOADED_STATE__ || { input: "", data: "", vars: [], valid: true });

// Load initial state from passed by the backend
const store = configureStore(initialState);

ReactDom.render(
    <Provider store={store}><MainLayout /></Provider>,
    document.getElementById("main"),
);

import * as React from "react";
import * as ReactDom from "react-dom";
import { Provider } from "react-redux";

import { fromJS, Iterable } from "immutable";

import MainLayout from "./layouts/Main";
import configureStore from "./store/configureStore";

export interface IInitialState {
    input?: string;
    data?: string;
    vars?: IVariables[];
};

export interface IVariables extends Iterable<string, string | undefined> {
    name?: string;
    value?: string;
}


const initialState = (window as any).__PRELOADED_STATE__ || { input: "", data: "", vars: [] };

// Load initial state from passed by the backend
const store = configureStore(fromJS(initialState));

ReactDom.render(
    <Provider store={store}><MainLayout /></Provider>,
    document.getElementById("main"),
);

import * as redux from "redux";

import { AppState, AppWindow } from "../app";
import { reducer } from "./module";

export interface LocalWindow extends AppWindow {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
}

export function configureStore(initialState: AppState): redux.Store<AppState> {
    if (process.env.NODE_ENV === "development") {
        const composeEnhancers =
            (window as LocalWindow).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||
            redux.compose;
        return redux.createStore(reducer, initialState, composeEnhancers());
    }
    return redux.createStore(reducer, initialState);
}

export default configureStore;

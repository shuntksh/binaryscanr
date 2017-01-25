import * as redux from "redux";
import reduxThunk from "redux-thunk";

import { AppState, AppWindow } from "../app";
import { reducer } from "./module";

export interface LocalWindow extends AppWindow {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
}

export function configureStore(initialState: AppState): redux.Store<AppState> {
    const thunkMiddleware = reduxThunk.withExtraArgument({ api: true });
    let middleware = redux.applyMiddleware(thunkMiddleware);
    if (process.env.NODE_ENV === "development") {
        const composeEnhancers =
            (window as LocalWindow).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||
            redux.compose;
        middleware = composeEnhancers(middleware);
    }
    return redux.createStore(reducer, initialState, middleware);
};

export default configureStore;

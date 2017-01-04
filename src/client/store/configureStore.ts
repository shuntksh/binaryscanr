import * as redux from "redux";
import reduxThunk from "redux-thunk";

import { IInitialState } from "../app";
import { reducer } from "./module";

export function configureStore(initialState: IInitialState): redux.Store<IInitialState> {
    const thunkMiddleware = reduxThunk.withExtraArgument({ api: true });
    let middleware = redux.applyMiddleware(thunkMiddleware);

    if (process.env.NODE_ENV === "development") {
        const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || redux.compose;
        middleware = composeEnhancers(middleware);
    }

    return redux.createStore(reducer, initialState, middleware);
};

export default configureStore;

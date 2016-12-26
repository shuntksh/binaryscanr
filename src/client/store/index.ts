import * as redux from "redux";
import { reducer } from "./module";

export interface InitialState { input?: string; };

export function configureStore(initialState: InitialState) {
    const store = redux.createStore(reducer, initialState);
    return store;
};

export default configureStore;

import * as redux from "redux";
import { reducer } from "./module";

export interface IInitialState { input?: string; };

export function configureStore(initialState: IInitialState) {
    const store = redux.createStore(reducer, initialState);
    return store;
};

export default configureStore;

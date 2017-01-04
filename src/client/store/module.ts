import * as redux from "redux";

export interface ActionTypes {
    [index: string]: string;
}

export const types: ActionTypes = {
    init: "app/INIT",
};

export interface ActionCreators {
    [index: string]: redux.ActionCreator<any>;
};

export const actions: ActionCreators = {
};

export const selectors = {
};

export function reducer<S>(state: S, action: redux.Action ): S {
    const { type } = action;
    switch (type) {
    default:
        return state;
    }
}

export default reducer;

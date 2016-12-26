import { Action } from "redux";

export interface ActionType {
    [index: string]: string;
}

export const types: ActionType = {
    init: "app/INIT",
};

export const actions = {
    
}

export function reducer<S>(state: S, action: Action ): S {
    const { type } = action;
    switch (type) {
    default:
        return state;
    }
}

export default reducer;

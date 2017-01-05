// import { fromJS } from "immutable";
import * as redux from "redux";

import { IAppState } from "../app";
import isValidFilter from "./isValidFilter";

export interface IAction extends redux.Action {
    [index: string]: any;
    readonly type: string;
    readonly payload?: any;
    readonly error?: any;
}

export interface IActionTypes {
    [index: string]: string;
    readonly init: string;
    readonly input_clear: string;
    readonly input_error: string;
    readonly input_update: string;
}

export const types: IActionTypes = {
    init: "@@app/INIT",
    input_clear: "@@app/INPUT/CLEAR",
    input_error: "@@app/INPUT/ERROR",
    input_update: "@@app/INPUT/UPDATE",
};

export interface IActionCreators {
    [index: string]: redux.ActionCreator<any>;
    readonly clearInput: () => IAction;
    readonly updateInput: (ev: React.FormEvent<Event>) => IAction;
};

export const actions: IActionCreators = {
    clearInput: () => ({ type: types.input_clear }),
    updateInput: (ev: React.FormEvent<Event>): IAction => {
        const input = (ev.target as HTMLInputElement).value;
        if (typeof input !== "string") {
            const error = { input: `Invalid Filter Type: ${typeof input}` };
            return { type: types.input_error, error };
        }
        const payload = { input: input || "", valid: isValidFilter(input) };
        return { type: types.input_update, payload };
    },
};

export const selectors = {
    getInput: () => (state: IAppState): string => state.get("input") || "",
};

export function reducer(state: IAppState, action: IAction ): IAppState {
    const { type, payload } = action;
    switch (type) {
    //
    // Filter String (aka Input)
    //
    case types.input_clear: {
        return state
            .set("input", "");
    }
    case types.input_update: {
        return state
            .set("input", payload.input)
            .set("valid", payload.valid);
    }

    //
    // Hex Data (aka Data)
    //

    default:
        return state;
    }
}

export default reducer;

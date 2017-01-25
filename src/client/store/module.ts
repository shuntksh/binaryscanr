// import { fromJS } from "immutable";
import * as redux from "redux";

import { AppState } from "../app";
import { HighlightProps, Intent } from "../components/TaggableInput";
import c from "../constants";
import isValidFilter from "../helpers/isValidFilter";

export interface Action extends redux.Action {
    [index: string]: any;
    readonly type: string;
    readonly payload?: any;
    readonly error?: any;
}

export interface ActionTypes {
    [index: string]: string;
    readonly init: string;
    readonly input_clear: string;
    readonly input_error: string;
    readonly input_update: string;
}

export const types: ActionTypes = {
    init: "@@app/INIT",
    input_clear: "@@app/INPUT/CLEAR",
    input_error: "@@app/INPUT/ERROR",
    input_update: "@@app/INPUT/UPDATE",
};

export interface ActionCreators {
    [index: string]: redux.ActionCreator<any>;
    readonly clearInput: () => Action;
    readonly updateInput: (ev: React.SyntheticEvent<HTMLInputElement>) => Action;
};

export const actions: ActionCreators = {
    clearInput: () => ({ type: types.input_clear }),
    updateInput: (ev: React.SyntheticEvent<HTMLInputElement>): Action => {
        const input = (ev.target as HTMLInputElement).value;
        if (typeof input !== "string") {
            const error = { input: `Invalid Filter Type: ${typeof input}` };
            return { type: types.input_error, error };
        }
        const payload = { input: input || "", valid: isValidFilter(input || "") };
        return { type: types.input_update, payload };
    },
};

export const selectors = {
    getFullSentence: () => (state: AppState): string => {
        const input = state.get("input").trim();
        return input ? `[binary scan $str ${input}]` : "";
    },
    getHighlights: () => (state: AppState): HighlightProps[] => {
        const highlights: HighlightProps[] = [];
        const input = state.get("input");

        // Show placeholder text if the input is empty.
        if (!input) {
            const placeholder = "formatString ?varName varName ...?";
            return [{ placeholder, intent: Intent.None }];
        }
        if (input.length > 4) {
            highlights.push({ at: 2, size: input.length, color: c.colors.lime });
        }
        return highlights;
    },
    getInput: () => (state: AppState): string => state.get("input") || "",
    isValid: () => (state: AppState): boolean => !!state.get("valid"),
};

export function reducer(state: AppState, action: Action ): AppState {
    const { type, payload } = action;
    switch (type) {
    //
    // Filter String (aka Input)
    //
    case types.input_clear: {
        return state
            .set("input", "")
            .set("valid", true);
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

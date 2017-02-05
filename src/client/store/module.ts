import { fromJS } from "immutable";
import * as redux from "redux";

import { AppState, Result } from "../app";
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
    readonly api_error: string;
    readonly hex_clear: string;
    readonly hex_error: string;
    readonly hex_update: string;
    readonly init: string;
    readonly input_clear: string;
    readonly input_error: string;
    readonly input_update: string;
    readonly start_loading: string;
    readonly stop_loading: string;
    readonly update_results: string;
}

export const types: ActionTypes = {
    api_error: "@@app/HEX/API_ERROR",
    hex_clear: "@@app/HEX/CLEAR",
    hex_error: "@@app/HEX/ERROR",
    hex_update: "@@app/HEX/UPDATE",
    init: "@@app/INIT",
    input_clear: "@@app/INPUT/CLEAR",
    input_error: "@@app/INPUT/ERROR",
    input_update: "@@app/INPUT/UPDATE",
    start_loading: "@@app/LOADING/START",
    stop_loading: "@@app/LOADING/STOP",
    update_results: "@@/API/SET_RESULTS",
};

export interface ActionCreators {
    [index: string]: redux.ActionCreator<any>;
    readonly apiError: (errMsg: string) => Action;
    readonly clearInput: () => Action;
    readonly startLoading: () => Action;
    readonly stopLoading: () => Action;
    readonly updateHexData: (value: string) => Action;
    readonly updateInput: (ev: React.SyntheticEvent<HTMLInputElement>) => Action;
    readonly updateResults: (results: string[]) => Action;
};

export const actions: ActionCreators = {
    apiError: (errMsg: string) => ({ type: types.api_error, payload: errMsg }),

    clearInput: () => ({ type: types.input_clear }),

    startLoading: () => ({ type: types.start_loading }),

    stopLoading: () => ({ type: types.stop_loading }),

    updateHexData: (value: string): Action => {
        if (typeof value !== "string") {
            const error = { input: `Invalid Hex Data Type: ${typeof value}` };
            return { type: types.hex_error, payload: error };
        }
        return { type: types.hex_update, payload: value };
    },

    updateInput: (ev: React.SyntheticEvent<HTMLInputElement>): Action => {
        const input = (ev.target as HTMLInputElement).value;
        if (typeof input !== "string") {
            const error = { input: `Invalid Filter Type: ${typeof input}` };
            return { type: types.input_error, error };
        }
        const vars = input.trim().split(" ");
        vars.shift();
        const payload = {
            input: input || "",
            valid: isValidFilter(input || ""),
            vars,
        };
        return { type: types.input_update, payload };
    },

    updateResults: (results: string[]): Action => {
        const payload = results.every((r: string) => typeof r === "string") ? results : [];
        return { type: types.update_results, payload };
    },
};

export const selectors = {
    getFullSentence: () => (state: AppState): string => {
        const input = state.get("input").trim();
        return input ? `[binary scan $str ${input}]` : "";
    },

    getHexData: () => (state: AppState): string => {
        return state.get("data") || "";
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

    getResults: () => (state: AppState): Result[] => state.get("results").toJS() || [],

    getVarNameStub: () => (state: AppState): HighlightProps => {
        const inputLen = state.get("input").split(" ")[0].length;
        const varNames = state
            .get("results")
            .map((result: Result) => result.get("varName"))
            .join(" ");
        if (!varNames.length || !state.get("input").length) { return {}; }
        const varNamesStub: HighlightProps = {
            at: inputLen + 2,
            placeholder: varNames,
        };
        return varNamesStub;
    },

    isValid: () => (state: AppState): boolean => (
        !!state.get("valid") && !state.get("error")
    ),
};

export function reducer(state: AppState, action: Action ): AppState {
    const { type, payload } = action;
    switch (type) {
    //
    // Loading State
    //
    case types.start_loading: {
        return state.set("isLoading", true);
    }

    case types.stop_loading: {
        return state.set("isLoading", false);
    }

    case types.api_error: {
        return state.set("error", payload);
    }

    //
    // Filter String (aka Input)
    //
    case types.input_clear: {
        return state
            .set("input", "")
            .set("valid", true);
    }

    case types.input_update: {
        const { input, valid, vars } = payload;
        const error = input.length ? state.get("error") : "";
        const results = state.get("results").map((result: Result, idx: number) => (
            vars[idx] ?
                result.set("varName", vars[idx]) :
                result.set("varName", `var${idx}`)
        ));

        return state.withMutations((mState) => mState
            .set("error", error)
            .set("input", input)
            .set("valid", valid)
            .set("vars", fromJS(vars))
            .set("results", results));
    }

    //
    // Hex Data (aka Data)
    //
    case types.hex_clear: {
        return state.set("hexData", "");
    }

    case types.hex_update: {
        return state.set("hexData", payload.toUpperCase() || "");
    }

    //
    // API Results
    //
    case types.update_results: {
        const results = payload.map((value: string, idx: number) => ({
            setByUser: !!state.getIn(["vars", idx]),
            value,
            varName: state.getIn(["vars", idx]) || `var${idx}`,
        }));
        return state
            .set("results", fromJS(results))
            .set("error", "");
    }

    default:
        return state;
    }
}

export default reducer;

import { fromJS } from "immutable";
import * as redux from "redux";

import { AppState, initialState, Result } from "../app";
import { HighlightProps, Intent } from "../components/TaggableInput";
import { getColorByIndex } from "../constants";
import formatStringToArray from "../helpers/formatStringToArray";
import formatStringToBits from "../helpers/formatStringToBits";
import isValidFilter from "../helpers/isValidFilter";

const MAX_LEN = 1500; // bytes

export interface Action extends redux.Action {
    [index: string]: any;
    readonly type: string;
    readonly payload?: any;
    readonly error?: any;
}

export const types: {
    readonly [index: string]: string;
} = {
    api_error: "@@app/HEX/API_ERROR",
    hex_clear: "@@app/HEX/CLEAR",
    hex_error: "@@app/HEX/ERROR",
    hex_update: "@@app/HEX/UPDATE",
    init: "@@app/INIT",
    input_clear: "@@app/INPUT/CLEAR",
    input_error: "@@app/INPUT/ERROR",
    input_update: "@@app/INPUT/UPDATE",
    reset: "@@app/RESET",
    set_example: "@@app/EXAMPLE/SET",
    start_loading: "@@app/LOADING/START",
    stop_loading: "@@app/LOADING/STOP",
    switch_tab: "@@/API/SWITCH_TAB",
    update_results: "@@/API/SET_RESULTS",
};

export interface ActionCreators {
    readonly [index: string]: redux.ActionCreator<any>;
    apiError: (errMsg: string) => Action;
    clearInput: () => Action;
    resetApp: () => Action;
    setExample: (name: string) => Action;
    startLoading: () => Action;
    stopLoading: () => Action;
    switchTab: (tab: string) => Action;
    updateHexData: (value: string) => Action;
    updateInput: (ev: React.SyntheticEvent<HTMLInputElement>) => Action;
    updateResults: (results: string[]) => Action;
}

export const actions: ActionCreators = {
    apiError: (errMsg: string) => ({ type: types.api_error, payload: errMsg }),

    clearInput: () => ({ type: types.input_clear }),

    resetApp: () => ({ type: types.reset }),

    setExample: (name: string) => ({ type: types.set_example, payload: name }),

    startLoading: () => ({ type: types.start_loading }),

    stopLoading: () => ({ type: types.stop_loading }),

    switchTab: (tab: string = "help") => {
        const payload = typeof tab === "string" ? tab : "help";
        return { type: types.switch_tab, payload };
    },

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

    updateInputValue: (input: string): Action => {
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
    getCurrentExample: () => (state: AppState): string | undefined => {
        return state.get("example") || "";
    },

    getCurrentTab: () => (state: AppState): string => {
        return state.get("tab") || "help";
    },

    getError: () => (state: AppState): string => {
        if (!state.get("valid")) {
            return "Erorr: Invalid input.";
        }
        return state.get("error") || "";
    },

    getFullSentence: () => (state: AppState): string => {
        const input = state.get("input").trim();
        return input ? `[binary scan $str ${input}]` : "";
    },

    getHexData: () => (state: AppState): string => {
        return state.get("hexData") || "";
    },

    getHighlights: () => (state: AppState): HighlightProps[] => {
        const highlights: HighlightProps[] = [];
        const input = state.get("input");
        const inputArr = formatStringToArray(input, false);
        const valueLength = (state.get("hexData") as string).length * 4;

        // Show placeholder text if the input is empty.
        if (!input) {
            const placeholder = "formatString ?varName varName ...?";
            return [{ placeholder, intent: Intent.None }];
        }

        let cursor = 1;
        let bits = 0;
        inputArr.forEach((formatter: string, idx: number) => {
            let len = formatStringToBits(formatter);
            if (len === -1) {
                len = valueLength - bits;
            }
            if (formatter.startsWith("x") || formatter.startsWith("X")) {
                cursor += formatter.length;
                bits += len;
            } else if (formatter.startsWith("@")) {
                cursor += formatter.length;
                bits = parseInt((formatter.match(/(\d+)/) || [])[1] || "0", 10) * 8;
            } else {
                const id = idx;
                const at = cursor;
                const size = at + formatter.length;
                const color = getColorByIndex(idx);
                highlights.push({ id, at, size, color, bitsAt: bits, bits: len });
                cursor += (size - at);
                bits += len;
            }
        });
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

export function reducer(state: AppState, action: Action): AppState {
    const { type, payload } = action;
    switch (type) {
    //
    // UI State
    //
    case types.switch_tab: {
        return state.set("tab", payload);
    }

    case types.reset: {
        return fromJS(initialState);
    }

    //
    // Example
    //
    case types.set_example: {
        return state.set("example", payload);
    }

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
            .set("valid", true)
            .set("results", fromJS([]))
            .set("error", "");
    }

    case types.input_update: {
        const { input, valid, vars } = payload;
        const error = input.length ? state.get("error") : "";
        const results = input.length ? state.get("results").map((result: Result, idx: number) => (
            vars[idx] ?
                result.set("varName", vars[idx]) :
                result.set("varName", `var${idx}`)
        )) : fromJS([]);

        return state.withMutations((s) => s
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
        const hexData = (payload.toUpperCase() || "").substring(0, MAX_LEN * 2);
        return state.set("hexData", hexData);
    }

    //
    // API Results
    //
    case types.update_results: {
        const input = fromJS(formatStringToArray(state.get("input")));
        const results = payload.map((value: string, idx: number) => ({
            formatter: input.get(idx),
            highlight: getColorByIndex(idx),
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

import { Action } from "redux";

export function reducer<S>(state: S, action: Action ): S {
    const { type } = action;
    switch (type) {
    default:
        return state;
    }
}

export default reducer;

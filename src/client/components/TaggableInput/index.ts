import TaggableInput from "./TaggableInput";

export enum Intent {
    None,
    Invalid,
    Valid,
}

export interface IHighlight {
    at?: number;
    size?: number;
    placeholder?: string;
    style?: {};
    color?: string;
    intent?: Intent;
}

export default TaggableInput;

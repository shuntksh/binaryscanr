import TaggableInput from "./TaggableInput";

export enum Intent {
    None,
    Invalid,
    Valid,
}

export interface HighlightProps {
    id?: number;
    at?: number;
    bitsAt?: number;
    bits?: number;
    size?: number;
    placeholder?: string;
    style?: {};
    color?: string;
    intent?: Intent;
}

export default TaggableInput;

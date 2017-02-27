import { HexEditor, HexEditorProps } from "./HexEditor";

export { HexEditor, HexEditorProps };

export enum Intent {
    None,
    Invalid,
    Valid,
}

export interface Highlight {
    at?: number;
    size?: number;
    color?: string;
}

export interface HexHighlightProps {
    id?: number;
    at?: number;
    bitsAt?: number;
    bits?: number;
    color?: string;
    intent?: Intent;
    placeholder?: string;
    size?: number;
    style?: {};
}

export default HexEditor;

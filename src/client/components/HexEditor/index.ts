import { HexEditor, HexEditorProps } from "./HexEditor";

export { HexEditor, HexEditorProps };

export enum Intent {
    None,
    Invalid,
    Valid,
}

export interface Highlight {
    at: number;
    color: string;
}

export interface HighlightProps {
    at?: number;
    color?: string;
    intent?: Intent;
    placeholder?: string;
    size?: number;
    style?: {};
}

export default HexEditor;

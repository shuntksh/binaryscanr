import * as cx from "classnames";
import * as React from "react";

// Using commonJS module syntax for lodash.throttle
const throttle = require("lodash.throttle");

import * as css from "./HexEditor.css";
import * as KEY from "./keymaps";
import Line from "./Line";

export const END_OF_INPUT = "< ";
export const BYTES_PER_LINE = 16;

export enum CellState {
    EMPTY = -1,
    EOF = -2,
}

export interface HexEditorProps {
    onBlur?: () => any;
    onChange?: (value: string) => any;
    onFocus?: () => any;
    value?: string;
}

export interface Selection {
    from: number;
    to: number;
    isSelecting: boolean;
}

export interface HexEditorState {
    currentCursorPosition?: number;
    cursorAt: number;
    editingCellAt: number;
    editingCellTempValue: string;
    isCtrlPressing: boolean;
    isFocused: boolean;
    selection: Selection;
    localValue: string[];
}

const strArr: string[] = [];
for (let i = 0; i < 440; i += 1) { strArr.push("00"); }

export class HexEditor extends React.Component<HexEditorProps, HexEditorState> {
    public static stringToArray = (str: string): string[] => {
        const arr = str.toUpperCase().match(/.{1,2}/g) || [];
        if (arr[arr.length - 1].length === 1) {
            arr[arr.length - 1] = "0" + arr[arr.length - 1];
        }
        if (arr[arr.length - 1] !== END_OF_INPUT) {
            arr.push(END_OF_INPUT);
        }
        return arr;
    }

   public static deleteRange(arr: string[], from: number, to: number): string[] {
        const _from = (from < to) ? from : to;
        const _to = (from < to) ? to : from;
        const _arr = [...arr];
        _arr.splice(_from, _to - _from + 1); // +1 to include target itself
        return _arr;
    }

    public state: HexEditorState = {
        currentCursorPosition: 0,
        cursorAt: 0,
        editingCellAt: CellState.EOF,
        editingCellTempValue: "",
        isCtrlPressing: false,
        isFocused: false,
        selection: { from: -1, to: -1, isSelecting: false },
        localValue: [...strArr, END_OF_INPUT],
    };

    private hexEditorElement: HTMLDivElement;

    private refHandlers: any = {
        hexEditorElement: (ref: HTMLDivElement): void => { this.hexEditorElement = ref; },
    };


    //
    // Getters / Setters
    //

    // Remove Getter to fix "Cannot set property isEditingCell of #<HexEditor> which has only a getter"
    public isEditingCell(): boolean {
        return (
            this.state &&
            Object.prototype.hasOwnProperty.call(this.state, "editingCellAt") &&
            this.state.editingCellAt !== CellState.EOF
        );
    }

    public isSelectingCell(): boolean {
        const { selection: { from, to } } = this.state;
        return (from !== -1 && to !== -1);
    }

    //
    // Component Lifecycle Methods
    //

    public componentWillMount() {
        const debounced = throttle(this.handleKeyDown.bind(this), 15);
        window.addEventListener("keydown", (event: KeyboardEvent) => debounced(event), false);
        window.addEventListener("keyup", (event: KeyboardEvent) => this.handleControlKeyUp(event), false);
        window.addEventListener("focus", () => this.handleFocus(), true);
        window.addEventListener("blur", () => this.handleFocus(false), true);

        // Synchlonize external state into local state
        if (this.props.value && typeof this.props.value === "string") {
            const localValue = HexEditor.stringToArray(this.props.value);
            localValue.push(END_OF_INPUT);
            this.setState({ localValue });
        }
    }

    public componentWillReceiveProps(nextProp: HexEditorProps) {
        // Synchlonize external state into local state
        if (nextProp.value && nextProp.value !== this.props.value) {
            this.setState({ localValue: HexEditor.stringToArray(nextProp.value) });
        }
    }

    public componentWillUnmount() {
        window.removeEventListener("keydown", (event: KeyboardEvent) => this.handleKeyDown(event));
        window.removeEventListener("keyup", (event: KeyboardEvent) => this.handleControlKeyUp(event));
        window.removeEventListener("focus", () => this.handleFocus());
        window.removeEventListener("blur", () => this.handleFocus());
    }


    //
    // Public Methods
    //

    public appendZero = (numChar: number = 100): string => {
        // const { localValue } = this.state;
        let out = "";
        for (let i = 0; i < numChar; i += 1) {
            out += "0";
        }
        return out;
    }

    public handleHoverOnCell = (currentCursorPosition: number): void => {
        if (typeof currentCursorPosition === "number") {
            this.setState({ currentCursorPosition });
        }
    }

    public render() {
        const { editingCellAt, editingCellTempValue, localValue, selection, isFocused } = this.state;
        const value = { data: localValue };
        const lines = [];
        for (let i = 0; i < Math.ceil(localValue.length / BYTES_PER_LINE); i += 1) {
            lines.push(i * BYTES_PER_LINE);
        }
        return (
            <div tabIndex={0} className={cx(["hexEditor", css.base])} ref={this.refHandlers.hexEditorElement}>
                {lines.map((line) => (
                <Line
                    key={line}
                    lineNum={line}
                    addrStart={line}
                    length={BYTES_PER_LINE}
                    value={value}
                    onHovering={this.handleHoverOnCell}
                    cursorAt={this.state.cursorAt}
                    editingCellAt={editingCellAt}
                    editingCellTempValue={editingCellTempValue}
                    isFocused={isFocused}
                    moveCursor={this.moveCursor}
                    selection={selection}
                    selectLine={this.selectLine}
                    onBeginSelection={this.beginSelection}
                    onUpdateSelection={this.updateSelection}
                    onFinishSelection={this.finishSelection}
                />
                ))}
            </div>
        );
    }

    //
    // Private Methods
    //

    /**
     * @param [onFocus=true] - Handler that set focus state. false means blur 
     */
    private handleFocus(onFocus: boolean = true): void {
        // Handle the situation where user clicks body or outside of browser tab / window
        if (onFocus === false) {
            this.setState({ isFocused: false });
            this.resetSelection();
            if (typeof this.props.onBlur === "function") { this.props.onBlur(); }
            return void 0;
        }
        if (document.activeElement === this.hexEditorElement) {
            this.setState({ isFocused: true });
            if (typeof this.props.onFocus === "function") {
                this.props.onFocus();
            }
        } else {
            if (this.state.isFocused) {
                this.setState({ isFocused: false });
                if (typeof this.props.onBlur === "function") { this.props.onBlur(); }
                this.resetSelection();
            }
        }
    }

    private handleControlKeyUp(event: KeyboardEvent): void {
        const code = event.which || event.keyCode;
        if (this.state.isCtrlPressing && KEY.CTRL_KEYS.includes(code)) {
            this.setState({isCtrlPressing: false});
        }
    }

    private handleKeyDown(event: KeyboardEvent): void {
        const { isCtrlPressing, cursorAt, localValue } = this.state;
        const length = localValue.length;
        const code = event.which || event.keyCode;
        const target = event.target as HTMLElement;

        // Prevent page navigation with backspace when it is not on any focus-able elements
        if (target.tagName === "BODY" && code === KEY.BS) {
            event.preventDefault();
        }

        // Toggle Control Key Flag
        if (!isCtrlPressing && KEY.CTRL_KEYS.includes(code)) {
            this.setState({ isCtrlPressing: true });
            return void 0;
        }

        // Ignore keydown event when possible
        if (!this.state.isFocused || !code || !KEY.ALLOWED_KEYS.includes(code)) {
            return void 0;
        }

        switch (code) {
        case KEY.ESC: {
            this.cancelEditCell();
            return void 0;
        }

        // Prevent Page Scroll while focus
        case KEY.SPACE: {
            event.preventDefault();
            return void 0;
        }

        case KEY.BS: { 
            event.preventDefault();
            this.handleDelete(true);
            return void 0;
        }
        
        case KEY.CODE["x"]:
        case KEY.DEL: {
            event.preventDefault();
            this.handleDelete(); 
            return void 0;
        }

        // Move Cursor <IJKL>
        case KEY.CODE["i"]:
        case KEY.UP: {
            event.preventDefault(); // Prevent Page Scroll
            const to = isCtrlPressing ? 0 : cursorAt - BYTES_PER_LINE;
            if (event.shiftKey) {
                if (this.isSelectingCell()) {
                    this.updateSelection(to, undefined, isCtrlPressing);                    
                } else {
                    this.updateSelection(to, cursorAt - 1, isCtrlPressing);
                }
                this.moveCursor(to, false);
                return void 0;
            } 
            this.moveCursor(to);
            return void 0;
        }

        case KEY.CODE["j"]:
        case KEY.LEFT: {
            event.preventDefault(); // Prevent Page Scroll
            if (cursorAt === 0) { 
                this.resetSelection();
                return void 0;
            }
            let to = cursorAt -1;
            if (isCtrlPressing) {
                to = BYTES_PER_LINE * Math.floor(cursorAt / BYTES_PER_LINE);
            }
            if (event.shiftKey) {
                if (this.isSelectingCell()) {
                    this.updateSelection(to, undefined, isCtrlPressing);                    
                } else {
                    this.updateSelection(to, cursorAt - 1, isCtrlPressing);
                }
                this.moveCursor(to, false);
                return void 0;
            } 
            this.moveCursor(to);
            return void 0;
        }

        case KEY.CODE["k"]:
        case KEY.DOWN: {
            event.preventDefault(); // Prevent Page Scroll
            const to = isCtrlPressing ? length - 1 : cursorAt + BYTES_PER_LINE;
            if (event.shiftKey) {
                if (this.isSelectingCell()) {
                    this.updateSelection(to, undefined, isCtrlPressing);                    
                } else {
                    this.updateSelection(to, cursorAt, isCtrlPressing);
                }
                this.moveCursor(to, false);
                return void 0;
            } 
            this.moveCursor(to);
            return void 0;
        }

        case KEY.CODE["l"]:
        case KEY.RIGHT: {
            event.preventDefault(); // Prevent Page Scroll
            let to = cursorAt + 1;
            if (isCtrlPressing) {
                to = BYTES_PER_LINE * Math.floor(cursorAt / BYTES_PER_LINE) + 15;
            }
            if (event.shiftKey) {
                if (this.isSelectingCell()) {
                    this.updateSelection(to, undefined, isCtrlPressing);                    
                } else {
                    this.updateSelection(to, cursorAt, isCtrlPressing);
                }
                this.moveCursor(to, false);
                return void 0;
            } 
            this.moveCursor(to);
            return void 0;
        }

        default: { 
            if (KEY.HEX_KEYS.includes(code)) {
                this.editCell(code);
            }
        }
        } // of switch
    }

    private editCell(code: number): void {
        const { cursorAt, editingCellAt, editingCellTempValue } = this.state;
        const char = KEY.CODE_TO_KEY[code].toUpperCase();

        // Going to modify the cell
        if (editingCellAt === CellState.EOF) {
            this.setState({ editingCellAt: cursorAt, editingCellTempValue: char });
            return void 0;
        }

        // Currently modifying the cell
        if (editingCellAt === cursorAt) {
            this.setState({ editingCellTempValue: editingCellTempValue + char }, () => {
                if (this.state.editingCellTempValue.length === 2) {
                    this.commitEditCell();
                }
            });
            return void 0;
        }
    }

    private cancelEditCell():void {
        this.setState({ editingCellAt: CellState.EOF, editingCellTempValue: "" });
    }

    private commitEditCell(moveCursor: boolean = true, resetSelection: boolean = true): void {
        const {
            cursorAt, editingCellAt, editingCellTempValue, localValue,
        } = this.state;
        if (!editingCellTempValue) {
            this.cancelEditCell();
        } else {
            const newCellValue = (editingCellTempValue.length === 1) ?
                "0" + editingCellTempValue : editingCellTempValue;
            localValue[editingCellAt] = newCellValue;
            this.setState({ editingCellAt: CellState.EOF, editingCellTempValue: "" }, () => {
                if (localValue[localValue.length - 1] !== END_OF_INPUT) {
                    localValue.push(END_OF_INPUT);
                }
                this.handleChange(localValue);
                if (moveCursor === true) {
                    let moveCursorTo: number = cursorAt + 1;
                    this.moveCursor(moveCursorTo, resetSelection);
                }
            });
        }
    }

    private handleChange(input: string[] = [], moveCursorTo?: number): void {
        const { onChange } = this.props;
        const { selection: { isSelecting } } = this.state;
        if (Array.isArray(input)) {
            if (typeof onChange === "function") {
                if (input[input.length - 1] === END_OF_INPUT) { input.pop(); }
                onChange((input).join(""));
            } else {
                this.setState({ localValue: input }, () => {
                    if (moveCursorTo >= 0) {
                        this.moveCursor(moveCursorTo, !isSelecting);
                    }
                });
            }
        }
    }

    private handleDelete(backspace: boolean = false): void {
        const { cursorAt, localValue, selection: { from, to } } = this.state;
        const length = localValue.length;
        // Delete selection regardless of BS or DEL
        if (this.isSelectingCell()) {
            const _moveCursorTo = (from < to) ? from : to;
            const _value = HexEditor.deleteRange(localValue, from, to);
            this.resetSelection();
            this.handleChange(_value, _moveCursorTo);
            return void 0;
        }

        // Nothing to Delete
        if (backspace) {
            if (cursorAt === 0) { return void 0; }
        } else {
            if (localValue.length === 1) { return void 0; }
        }

        const del = (cursorAt === length - 1) ? cursorAt - 1 : cursorAt;
        const _value = HexEditor.deleteRange(localValue, del, del);
        this.resetSelection();
        this.handleChange(_value, cursorAt - 1);
    }

    private moveCursor = (to: number = 0, resetSelection: boolean = true, cb?: () => any): void => {
        if (typeof to === "number") {
            let cursorAt = to <= 0 ? 0 : to;
            const length = (this.state.localValue).length - 1;
            if (length <= cursorAt || to === CellState.EOF) {
                cursorAt = length;
            }
            // Commit current editing before moving cursor
            if (this.isEditingCell()) {
                this.commitEditCell(false, false);
            }
            this.setState({ cursorAt }, () => {
                if (resetSelection) {
                    this.resetSelection();
                }
                if (typeof cb === "function") { cb(); }
            });
        }
    }

    private beginSelection = (from: number): void => {
        const { localValue } = this.state;
        const maxLen = localValue.length - 2;
        const _from = Math.max(0, Math.min(from, maxLen));
        this.setState({ selection: { from: _from, to: _from, isSelecting: true } });
    }

    private updateSelection = (to: number, newFrom?: number, finishAfter: boolean = false): void => {
        const { selection: { from }, localValue } = this.state;
        const maxLen = localValue.length - 2;
        const _from = Math.max(0, (typeof newFrom === 'number') ? newFrom : from);
        const _to = Math.min(to, maxLen);
        this.setState({ selection: { from: _from, to: _to, isSelecting: !finishAfter } });
    }

    private selectLine = (from: number): void => {
        const { localValue } = this.state;
        const totalLines = Math.ceil(localValue.length / BYTES_PER_LINE);
        const currentLine = Math.ceil((from + BYTES_PER_LINE) / BYTES_PER_LINE);
        const isLastLine = totalLines === currentLine;
        const to = isLastLine ? localValue.length - 2: from + BYTES_PER_LINE - 1;
        this.setState({ selection: { from, to, isSelecting: false } }, () => {
            this.moveCursor(to + 1, false);
        });
    }

    private finishSelection = (to: number): void => {
        const { selection: { from }, localValue } = this.state;
        const maxLen = localValue.length - 2;
        const _from = Math.max(0, from);
        const _to = Math.min(to, maxLen);
        this.setState({ selection: { from: _from, to: _to, isSelecting: false } }, () => {
            this.moveCursor(_to, false);
        });        
    }

    private resetSelection = (cb?: () => any): void => {
        this.setState({ selection: { from: -1, to: -1, isSelecting: false } }, cb);
    }
}

export default HexEditor;

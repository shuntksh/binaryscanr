import * as cx from "classnames";
import * as React from "react";

import * as css from "./HexEditor.css";
import * as KEY from "./keymaps";
import Line from "./Line";

export const END_OF_INPUT = "<<";
export const BYTES_PER_LINE = 16;

export interface HexEditorProps {
    onBlur?: () => {};
    onChange?: (value: string) => {};
    onFocus?: () => {};
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

    public state: HexEditorState = {
        currentCursorPosition: 0,
        cursorAt: 0,
        editingCellAt: -2,
        editingCellTempValue: "",
        isCtrlPressing: false,
        isFocused: false,
        selection: { from: -1, to: -1, isSelecting: false },
        localValue: [END_OF_INPUT],
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
            this.state.editingCellAt !== -2
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
        window.addEventListener("keydown", (event: KeyboardEvent) => this.handleKeyDown(event), false);
        window.addEventListener("keyup", (event: KeyboardEvent) => this.handleControlKeyUp(event), false);
        window.addEventListener("focus", () => this.handleFocus(), true);
        window.addEventListener("blur", () => this.handleFocus(false), true);

        // Synchlonize external state into local state
        if (this.props.value && typeof this.props.value === "string") {
            this.setState({ localValue: HexEditor.stringToArray(this.props.value) });
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
        const { editingCellAt, editingCellTempValue, localValue, selection } = this.state;
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
                        addrStart={line}
                        length={BYTES_PER_LINE}
                        value={value}
                        onHovering={this.handleHoverOnCell}
                        cursorAt={this.state.cursorAt}
                        editingCellAt={editingCellAt}
                        editingCellTempValue={editingCellTempValue}
                        moveCursor={this.moveCursor}

                        selection={selection}
                        onBeginSelection={this.beginSelection}
                        onUpdateSelection={this.updateSelection}
                        onFinishSelection={this.finishSelection}
                    />
                ))}
                <div>{this.state.currentCursorPosition || 0}</div>
                <div>{this.state.isFocused ? "focusing" : "not focused"}</div>
                <div>{this.state.editingCellAt} / {this.state.editingCellTempValue}</div>
                <div>{selection.isSelecting ? "SEL" : "NO_SEL"} / {selection.from} / {selection.to}</div>
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
        const { isCtrlPressing } = this.state;

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
            if (this.state.isCtrlPressing) {
                this.moveCursor(0);
            } else {
                this.moveCursor(this.state.cursorAt - BYTES_PER_LINE);
            }
            return void 0;
        }

        case KEY.CODE["j"]:
        case KEY.LEFT: {
            event.preventDefault(); // Prevent Page Scroll
            if (this.state.isCtrlPressing) {
                const newpos = BYTES_PER_LINE * Math.floor(this.state.cursorAt / BYTES_PER_LINE);
                this.moveCursor(newpos);
            } else {
                this.moveCursor(this.state.cursorAt - 1);
            }
            return void 0;
        }

        case KEY.CODE["k"]:
        case KEY.DOWN: {
            event.preventDefault(); // Prevent Page Scroll
            if (this.state.isCtrlPressing) {
                this.moveCursor(-2);
            } else {
                this.moveCursor(this.state.cursorAt + BYTES_PER_LINE);
            }
            return void 0;
        }

        case KEY.CODE["l"]:
        case KEY.RIGHT: {
            event.preventDefault(); // Prevent Page Scroll
            if (this.state.isCtrlPressing) {
                const newpos = BYTES_PER_LINE * Math.floor(this.state.cursorAt / BYTES_PER_LINE) + 15;
                this.moveCursor(newpos);
            } else {
                if (this.isEditingCell()) {
                    this.commitEditCell(true);
                } else {
                    this.moveCursor(this.state.cursorAt + 1);
                }
            }
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
        if (editingCellAt === -2) {
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
        this.setState({ editingCellAt: -2, editingCellTempValue: "" });
    }

    private commitEditCell(moveCursor: boolean = true, resetSelection: boolean = true): void {
        const { cursorAt, editingCellAt, editingCellTempValue, localValue } = this.state;
        if (!editingCellTempValue) {
            this.cancelEditCell();
        } else {
            const newCellValue = (editingCellTempValue.length === 1) ?
                "0" + editingCellTempValue : editingCellTempValue;
            
                localValue[editingCellAt] = newCellValue;

            this.setState({ editingCellAt: -2, editingCellTempValue: "" }, () => {
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

    private handleChange(input: string[] = []): void {
        const { onChange } = this.props;
        const { selection: { isSelecting } } = this.state;
        if (Array.isArray(input)) {
            if (typeof onChange === "function") {
                if (input[input.length - 1] === END_OF_INPUT) { input.pop(); }
                onChange((input).join(""));
            } else {
                this.setState({ localValue: input }, () => {
                    if (!isSelecting) {
                        this.resetSelection();
                    }
                });
            }
        }
    }

    private handleDelete(backspace: boolean = false): void {
        const { cursorAt, localValue, selection: { from, to } } = this.state;

        // Delete selection regardless of BS or DEL
        if (this.isSelectingCell()) {
            this.deleteCells(from, to);
            return void 0;
        }

        // Nothing to Delete
        if (backspace) {
            if (cursorAt === 0) { return void 0; }
        } else {
            if (cursorAt === localValue.length) { return void 0; }
        }
    }

    private deleteCells(from: number, to: number): void {
        const { localValue } = this.state;
        const _from = (from < to) ? from : to;
        const _to = (from < to) ? to : from;
        const _value = [...localValue];
        _value.splice(_from, _to - _from);
        this.handleChange(_value);
    }

    private moveCursor = (to: number = 0, resetSelection: boolean = true, cb?: () => any): void => {
        if (typeof to === "number") {
            let cursorAt = to <= 0 ? 0 : to;
            const length = (this.state.localValue).length - 1;
            if (length <= cursorAt || to === -2) {
                cursorAt = length;
            }
            console.log(resetSelection);
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
        this.setState({ selection: { from, to: from, isSelecting: true } });
    }

    private updateSelection = (to: number): void => {
        const { selection: { from } } = this.state;
        this.setState({ selection: { from, to, isSelecting: true } });
    }

    private finishSelection = (to: number): void => {
        const { selection: { from } } = this.state;
        this.setState({ selection: { from, to, isSelecting: false } }, () => {
            this.moveCursor(to, false);
        });        
    }

    private resetSelection = (cb?: () => any): void => {
        this.setState({ selection: { from: -1, to: -1, isSelecting: false } }, cb);
    }
}

export default HexEditor;

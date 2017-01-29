import * as React from "react";

import * as cx from "classnames";

import * as css from "./HexEditor.css";
import * as KEY from "./keymaps";
import Line from "./Line";

export const BYTES_PER_LINE = 32;

const DATA = "0123456789ABCDEF0123456789ABCDEF0BEEF00123456789ABCDEF0123456789ABCDEF0123";

export interface HexEditorProps {
    onBlur?: () => {};
    onChange?: (value: string) => {};
    onFocus?: () => {};
    value?: string;
}

export interface HexEditorState {
    currentCursorPosition?: number;
    cursorAt: number;
    isCtrlPressing?: boolean;
    isFocused?: boolean;
}

export class HexEditor extends React.Component<HexEditorProps, HexEditorState> {
    public state: HexEditorState = {
        cursorAt: 0,
        isCtrlPressing: false,
        isFocused: false,
    };

    private hexEditorElement: HTMLDivElement;
    private refHandlers: any = {
        hexEditorElement: (ref: HTMLDivElement): void => { this.hexEditorElement = ref; },
    };

    public componentWillMount() {
        window.addEventListener("keydown", (event: KeyboardEvent) => this.handleKeyDown(event), false);
        window.addEventListener("keyup", (event: KeyboardEvent) => this.handleControlKeyUp(event), false);
        window.addEventListener("focus", () => this.handleFocus(), true);
        window.addEventListener("blur", () => this.handleFocus(false), true);
    }

    public componentWillUnmount() {
        window.removeEventListener("keydown", (event: KeyboardEvent) => this.handleKeyDown(event));
        window.removeEventListener("keyup", (event: KeyboardEvent) => this.handleControlKeyUp(event));
        window.removeEventListener("focus", () => this.handleFocus());
        window.removeEventListener("blur", () => this.handleFocus());
    }

    public handleHoverOnCell = (currentCursorPosition: number): void => {
        if (typeof currentCursorPosition === "number") {
            this.setState({ currentCursorPosition });
        }
    }

    public render() {
        const value = {
            data: this.props.value || DATA,
        };
        return (
            <div tabIndex={0} className={cx(["hexEditor", css.base])} ref={this.refHandlers.hexEditorElement}>
                <Line
                    addrStart={0}
                    length={BYTES_PER_LINE}
                    value={value}
                    onHovering={this.handleHoverOnCell}
                    cursorAt={this.state.cursorAt}
                    moveCursor={this.moveCursor}
                />
                <Line
                    addrStart={32}
                    length={BYTES_PER_LINE}
                    value={value}
                    onHovering={this.handleHoverOnCell}
                    cursorAt={this.state.cursorAt}
                    moveCursor={this.moveCursor}
                />
                <Line
                    addrStart={64}
                    length={BYTES_PER_LINE}
                    value={value}
                    onHovering={this.handleHoverOnCell}
                    cursorAt={this.state.cursorAt}
                    moveCursor={this.moveCursor}
                />
                <div>{this.state.currentCursorPosition || 0}</div>
                <div>{this.state.isFocused ? "focusing" : "not focused"}</div>
            </div>
        );
    }

    private handleFocus(onFocus?: boolean): void {
        // Handle the situation where user clicks body or outside of browser tab / window
        if (onFocus === false) {
            this.setState({ isFocused: false });
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
            window.focus();
            console.log(document.activeElement);
            return void 0;
        }

        // Prevent Page Scroll while focus
        case KEY.SPACE: { event.preventDefault(); return void 0; }

        // Move Cursor <IJKL>
        case KEY.CODE.i:
        case KEY.UP: {
            event.preventDefault(); // Prevent Page Scroll
            if (this.state.isCtrlPressing) {
                this.moveCursor(0);
            } else {
                this.moveCursor(this.state.cursorAt - BYTES_PER_LINE);
            }
            return void 0;
        }

        case KEY.CODE.j:
        case KEY.LEFT: {
            event.preventDefault(); // Prevent Page Scroll
            if (this.state.isCtrlPressing) {
                const newpos = BYTES_PER_LINE * Math.floor(this.state.cursorAt / BYTES_PER_LINE);
                this.moveCursor(newpos);
            } else {
                this.moveCursor(this.state.cursorAt - 2);
            }
            return void 0;
        }

        case KEY.CODE.k:
        case KEY.DOWN: {
            event.preventDefault(); // Prevent Page Scroll
            if (this.state.isCtrlPressing) {
                this.moveCursor(-1);
            } else {
                this.moveCursor(this.state.cursorAt + BYTES_PER_LINE);
            }
            return void 0;
        }

        case KEY.CODE.l:
        case KEY.RIGHT: {
            event.preventDefault(); // Prevent Page Scroll
            if (this.state.isCtrlPressing) {
                const newpos = BYTES_PER_LINE * Math.floor(this.state.cursorAt / BYTES_PER_LINE) + 30;
                this.moveCursor(newpos);
            } else {
                this.moveCursor(this.state.cursorAt + 2);
            }
            return void 0;
        }

        default: { console.log("do something"); }
        }

    }

    private moveCursor = (to: number = 0): void => {
        if (typeof to === "number") {
            let cursorAt = to <= 0 ? 0 : to;
            const length = (this.props.value || DATA).length - 2;
            if (length <= cursorAt || to === -1) {
                cursorAt = length;
            }
            this.setState({ cursorAt });
        }
    }
}

export default HexEditor;

import * as React from "react";

import * as css from "./HexEditor.css";
import * as KEY from "./keymaps";

export interface HexEditorProps {
    onBlur?: () => {};
    value?: string;
    onChange?: (value: string) => {};
}

export interface HexEditorState {
    isCtrlPressing: boolean;
}

export class HexEditor extends React.Component<HexEditorProps, HexEditorState> {
    public state = {
        isCtrlPressing: false,
    };

    public componentWillMount() {
        window.addEventListener("mousedown", (event: MouseEvent) => this.handleClick(event));
        window.addEventListener("keydown", (event: KeyboardEvent) => this.handleKeyDown(event));
        window.addEventListener("keyup", (event: KeyboardEvent) => this.handleControlKeyUp(event));
    }

    public componentWillUnmount() {
        window.removeEventListener("mousedown", (event: MouseEvent) => this.handleClick(event));
        window.removeEventListener("keydown", (event: KeyboardEvent) => this.handleKeyDown(event));
        window.removeEventListener("keyup", (event: KeyboardEvent) => this.handleControlKeyUp(event));
    }

    public render() {
        return (
            <div className={css.base} />
        );
    }

    /**
     * @description Toggle focus state based on click location
     */
    private handleClick(event: MouseEvent): void {
        // Handles focus and blur on HexEditor
        const element = document.querySelector(".hexEditor");
        if (!element) { return void 0; }

        const editorRect = element.getBoundingClientRect();

        if (editorRect.left < event.clientX && event.clientX < editorRect.right) {
            if  (editorRect.top < event.clientY && event.clientY < editorRect.bottom) {
                return void 0;
            }
        }

        if (typeof this.props.onBlur === "function") {
            this.props.onBlur();
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

    }

}

export default HexEditor;

import * as cx from "classnames";
import * as React from "react";

import { END_OF_INPUT } from "./HexEditor";
import * as css from "./HexEditor.css";

export interface AsciiCellProps {
    char: string;
    onClick?: (pos: number) => any;
    onHovering?: (idx: number) => void;
    editingCellTempValue: string;
    pos: number;
    highlight?: string;
    isFocused: boolean;
    isCursorOn: boolean;
    isHoveringOnPeer: boolean;
    isEditing: boolean;
    isSelecting: boolean;
    isSelectingCell: boolean;
    onBeginSelection: (from: number) => void;
    onUpdateSelection: (to: number) => void;
    onFinishSelection: (to: number) => void;
}

export interface AsciiCellState {
    isHovering: boolean;
}

export class AsciiCell extends React.PureComponent<AsciiCellProps, AsciiCellState> {
    public state: AsciiCellState = { isHovering: false };

    public render() {
        const {
            isSelectingCell, highlight, char, isCursorOn, isEditing, editingCellTempValue,
            isFocused, isHoveringOnPeer,
        } = this.props;
        const { isHovering } = this.state;
        let _char = char;
        if (isEditing && editingCellTempValue) {
            _char = editingCellTempValue;
            if (_char.length === 1) { _char += "_"; }
        }

        const styles: any = {};
        const classNames = [css.asciiCell];

        if (highlight) {
            if (!isCursorOn && !isHovering && !isSelectingCell) {
                styles.background = highlight;
                styles.opacity = 0.6;
            }
            styles.borderBottom = `${highlight} solid 1px`;
        }

        if (isSelectingCell) {
            classNames.push(css.selecting);
        }

        if (isHovering || isHoveringOnPeer) {
            classNames.push(css.hovering);
        }

        if (isCursorOn) {
            classNames.push(css.cursor);
            if (isFocused === false) {
                styles.opacity = "0.5";
            }
        }

        const hex = parseInt(_char, 16);
        const asciiChar = (hex >= 0x21 && hex <= 0xFF) ? String.fromCharCode(hex) : ".";

        return (
            <span
                style={styles}
                className={cx(classNames)}
                onClick={this.handleClick}
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                onMouseEnter={this.handleEnter}
                onMouseLeave={this.handleLeave}
            >
                {asciiChar || "."}
            </span>
        );
    }

    private handleClick = (): void => {
        if (typeof this.props.onClick === "function") {
            this.props.onClick(this.props.pos);
        }
    }

    private handleMouseDown = (): void => {
        const { char, isSelecting, onFinishSelection, pos } = this.props;
        const _pos = char === END_OF_INPUT ? pos - 1 : pos;
        if (isSelecting) {
            onFinishSelection(_pos);
        }
    }

    private handleMouseUp = (): void => {
        const { char, isSelecting, onFinishSelection, pos } = this.props;
        const _pos = char === END_OF_INPUT ? pos - 1 : pos;
        if (isSelecting) {
            onFinishSelection(_pos);
        }
    }

    private handleEnter = (): void => {
        const { char, isSelecting, onHovering, onUpdateSelection, pos } = this.props;
        if (isSelecting && char !== END_OF_INPUT) {
            onUpdateSelection(pos);
        }
        if (!this.state.isHovering) {
            this.setState({ isHovering: true });
            if (typeof onHovering === "function" && char !== END_OF_INPUT) {
                onHovering(pos);
            }
        }
    }

    private handleLeave = (): void => {
        this.setState({ isHovering: false });
    }
}

export default AsciiCell;

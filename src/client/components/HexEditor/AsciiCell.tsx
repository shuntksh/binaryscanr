import * as cx from "classnames";
import * as React from "react";

import { END_OF_INPUT } from "./HexEditor";
import * as css from "./HexEditor.css";
import { Selection } from "./HexEditor";

export interface AsciiCellProps {
    char: string;
    onClick?: (pos: number) => any;
    onHovering?: (idx: number) => void;
    cursorAt: number;
    editingCellAt: number;
    editingCellTempValue: string;
    pos: number;

    selection: Selection;

    onBeginSelection: (from: number) => void;
    onUpdateSelection: (to: number) => void;
    onFinishSelection: (to: number) => void;
}

export interface AsciiCellState {
    isHovering: boolean;
}

export class AsciiCell extends React.Component<AsciiCellProps, AsciiCellState> {
    public state: AsciiCellState = { isHovering: false };
    public render() {
        const { char, cursorAt, editingCellAt, editingCellTempValue, pos } = this.props;
        const { isHovering } = this.state;
        let _char = char;
        if (editingCellAt === pos && editingCellTempValue) {
            _char = editingCellTempValue;
            if (_char.length === 1) { _char += "_"; }
        }

        const classNames = [css.cell];
        if (this.isSelectingCell()) {
            classNames.push(css.selecting);
        }

        const hex = parseInt(_char, 16);
        let asciiChar = (hex >= 0x20 && hex <= 0x7E) ? String.fromCharCode(hex) : '.';

        return (
            <span
                className={cx(classNames)}
                style={{ background: isHovering ? "red" : null, color: cursorAt === pos ? "red" : "black" }}
                onClick={this.handleClick}
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                onMouseOver={this.handleMouseMove}
                onMouseEnter={this.handleEnter}
                onMouseLeave={this.handleLeave}
            >
                {asciiChar}
            </span>
        );
    }

    private isSelectingCell(): boolean {
        const { selection: { from, to }, pos } = this.props;
        const _from = from < to ? from : to;
        const _to = from < to ? to : from;
        return (_from <= pos && pos <= _to);
    }

    private handleClick = (): void => {
        if (typeof this.props.onClick === "function") {
            this.props.onClick(this.props.pos);
        }
    }

    private handleMouseDown = (): void => {
        const {
            char, selection: { isSelecting }, onBeginSelection, pos,
        } = this.props;
        if (!isSelecting) {
            const _pos = char === END_OF_INPUT ? pos - 1 : pos;
            onBeginSelection(_pos);
        }
    }

    private handleMouseMove = (): void => {
        const { char, selection: { isSelecting }, onUpdateSelection, pos } = this.props;
        if (isSelecting && char !== END_OF_INPUT) {
            onUpdateSelection(pos);
        }
        this.handleEnter();
    }

    private handleMouseUp = (): void => {
        const { char, selection: { isSelecting }, onFinishSelection, pos } = this.props;
        if (isSelecting) {
            const _pos = char === END_OF_INPUT ? pos - 1 : pos;
            onFinishSelection(_pos);
        }
    }

    private handleEnter = (): void => {
        if (!this.state.isHovering) {
            this.setState({ isHovering: true });
            if (typeof this.props.onHovering === "function") {
                this.props.onHovering(this.props.pos);
            }
        }
    }

    private handleLeave = (): void => {
        this.setState({ isHovering: false });
    }
}

export default AsciiCell;

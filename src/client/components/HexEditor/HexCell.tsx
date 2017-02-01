import * as cx from "classnames";
import * as React from "react";
import * as shallowCompare from "react-addons-shallow-compare";

import { END_OF_INPUT } from "./HexEditor";
import * as css from "./HexEditor.css";
import { Selection } from "./HexEditor";

export interface HexCellProps {
    char: string;
    onClick?: (pos: number) => any;
    onHovering?: (idx: number) => void;
    cursorAt: number;
    currentCursorPosition?: number;
    editingCellAt: number;
    editingCellTempValue: string;
    pos: number;
    isFocused: boolean;
    selection: Selection;

    onBeginSelection: (from: number) => void;
    onUpdateSelection: (to: number) => void;
    onFinishSelection: (to: number) => void;
}

export interface HexCellState {
    isHovering: boolean;
}

export class HexCell extends React.Component<HexCellProps, HexCellState> {
    public state: HexCellState = { isHovering: false };

    public shouldComponentUpdate(nextProps: HexCellProps, nextState: HexCellState) {
        return shallowCompare(this, nextProps, nextState);
    }

    public render() {
        const {
            char, cursorAt, editingCellAt, editingCellTempValue, pos, currentCursorPosition, isFocused
        } = this.props;
        const { isHovering } = this.state;
        let _char = char;
        if (editingCellAt === pos && editingCellTempValue) {
            _char = editingCellTempValue;
            if (_char.length === 1) { _char += "_"; }
        }
        const styles: any = {};
        const classNames = [css.cell];
        if (this.isSelectingCell() && !isHovering) {
            classNames.push(css.selecting);
        }
        if (isHovering || currentCursorPosition === pos) {
            classNames.push(css.hovering);
        }

        if (cursorAt === pos) {
            classNames.push(css.cursor);
            if (isFocused === false) {
                styles.opacity = "0.5"
            } else {
                classNames.push(css.blinkCursor);
            }
        }
        
        if (_char === "<") {
            styles.color = "black";
        }

        return (
            <span
                className={cx(classNames)}
                style={styles}
                onClick={this.handleClick}
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                onMouseOver={this.handleMouseMove}
                onMouseEnter={this.handleEnter}
                onMouseLeave={this.handleLeave}
            >
                {_char}
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

export default HexCell;

import * as cx from "classnames";
import * as React from "react";
import * as shallowCompare from "react-addons-shallow-compare";

import { END_OF_INPUT } from "./HexEditor";
import * as css from "./HexEditor.css";

export interface HexCellProps {
    char: string;
    onClick?: (pos: number) => any;
    onHovering?: (idx: number) => void;
    editingCellTempValue: string;
    pos: number;
    isFocused: boolean;
    isHoveringOnPeer: boolean;
    isCursorOn: boolean;
    isEditing: boolean;
    isSelecting: boolean;
    isSelectingCell: boolean;
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
            char, isCursorOn, isEditing, editingCellTempValue, isFocused, isHoveringOnPeer,
        } = this.props;
        const { isHovering } = this.state;
        const styles: any = {};
        const classNames = [css.cell];

        let _char = char;
        if (isEditing && editingCellTempValue) {
            _char = editingCellTempValue;
            if (_char.length === 1) { _char += "_"; }
        }

        if (this.isSelectingCell() && !isHovering) {
            classNames.push(css.selecting);
        }

        if (isHovering || isHoveringOnPeer) {
            classNames.push(css.hovering);
        }

        if (isCursorOn) {
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

    private isSelectingCell(props?: HexCellProps): boolean {
        const { isSelectingCell } = props || this.props;
        return isSelectingCell;
    }

    private handleClick = (): void => {
        if (typeof this.props.onClick === "function") {
            this.props.onClick(this.props.pos);
        }
    }

    private handleMouseDown = (): void => {
        const {
            char, onBeginSelection, pos, isSelecting,
        } = this.props;

        const _pos = char === END_OF_INPUT ? pos - 1 : pos;
        if (!isSelecting) {
            onBeginSelection(_pos);
        }
    }

    private handleMouseMove = (): void => {
        // this.handleEnter();
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

export default HexCell;

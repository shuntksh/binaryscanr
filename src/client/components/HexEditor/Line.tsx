import * as React from "react";
import * as shallowCompare from "react-addons-shallow-compare";

import * as css from "./HexEditor.css";

import AsciiCell from "./AsciiCell";
import HexCell from "./HexCell";
import { Selection } from "./HexEditor";

export interface Value {
    data?: string[];
}

export interface LineProps {
    lineNum: number;
    addrStart: number;
    length: number;
    cursorAt: number;
    editingCellAt: number;
    editingCellTempValue: string;
    moveCursor: (to: number) => void;
    onHovering: (pos: number) => void;
    value: Value;
    selection: Selection;

    onBeginSelection: (from: number) => void;
    onUpdateSelection: (to: number) => void;
    onFinishSelection: (to: number) => void;
}

export interface LineState {
    line: string[];
    currentCursorPosition?: number;
    isHovering?: boolean;
}

const formatString = (str: string, width: number, padChar: string = "0"): string => {
    if (str.length >= width) { return str; }
    let pad = "";
    for (let i = 0; i < (width - str.length); i += 1) { pad += padChar; }
    return pad + str;
}

export class Line extends React.Component<LineProps, LineState> {
    public state: LineState = { isHovering: false, line: [] };

    public handleHoverOnCell = (currentCursorPosition: number): void => {
        if (typeof currentCursorPosition === "number") {
            if (typeof this.props.onHovering === "function") {
                this.props.onHovering(currentCursorPosition);
            }
            this.setState({ currentCursorPosition });
        }
    }

    public getLineArray = (props?: LineProps): string[] => {
        const { addrStart, length, value: { data = [] } } = props ? props : this.props;
        const newData = [];
        for (let i = addrStart; i < addrStart + length; i += 1) {
            if (data[i]) {
                newData.push(data[i]);
            }
        }
        return newData;
    }

    public componentWillMount() {
        this.setState({ line: this.getLineArray() });
    }

    public componentWillReceiveProps(nextProp: LineProps) {
        this.setState({ line: this.getLineArray(nextProp) });
    }

    public shouldComponentUpdate(nextProps: LineProps, nextState: LineState) {
        return shallowCompare(this, nextProps, nextState);
    }

    public render() {
        const {
            addrStart, moveCursor, cursorAt, editingCellAt, editingCellTempValue,
            selection, onBeginSelection, onUpdateSelection, onFinishSelection, lineNum,
        } = this.props;
        const { line } = this.state;
        const num = lineNum.toString(16).toUpperCase();
        return (
            <div
                className={css.lineContainer}
                onMouseEnter={this.handleEnter}
                onMouseMove={this.handleEnter}
                onMouseLeave={this.handleLeave}
            >
                <div className={css.line}>
                    <span>{formatString(num, 8)}</span>
                </div>
                <div className={css.hexLineContainer}>
                {line.map((char, idx) => (
                    <HexCell
                        key={idx}
                        char={char}
                        cursorAt={cursorAt}
                        editingCellAt={editingCellAt}
                        editingCellTempValue={editingCellTempValue}
                        pos={addrStart + idx}
                        onHovering={this.handleHoverOnCell}
                        onClick={moveCursor}

                        selection={selection}
                        onBeginSelection={onBeginSelection}
                        onUpdateSelection={onUpdateSelection}
                        onFinishSelection={onFinishSelection}
                    />
                ))}
                </div>
                <div className={css.asciiLineContainer}>
                {line.map((char, idx) => (
                    <AsciiCell
                        key={idx}
                        char={char}
                        cursorAt={cursorAt}
                        editingCellAt={editingCellAt}
                        editingCellTempValue={editingCellTempValue}
                        pos={addrStart + idx}
                        onHovering={this.handleHoverOnCell}
                        onClick={moveCursor}

                        selection={selection}
                        onBeginSelection={onBeginSelection}
                        onUpdateSelection={onUpdateSelection}
                        onFinishSelection={onFinishSelection}
                    />
                ))}
                </div>
            </div>
        );
    }

    private handleEnter = (): void => {
        if (!this.state.isHovering) {
            this.setState({ isHovering: true });
        }
    }

    private handleLeave = (): void => {
        this.setState({ isHovering: false });
    }
}

export default Line;

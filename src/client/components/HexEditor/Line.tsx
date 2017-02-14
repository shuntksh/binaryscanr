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
    lineCount: number;
    addrStart: number;
    length: number;
    cursorAt: number;
    editingCellAt: number;
    editingCellTempValue: string;
    moveCursor: (to: number) => void;
    onHovering: (pos: number) => void;
    isFocused: boolean;
    value: Value;
    scrollTo: number;
    onFinishScroll: () => void;
    selection: Selection;
    selectLine: (lineNum: number) => void;
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
    public ref: HTMLDivElement;
    public setRef = (ref: HTMLDivElement) => { this.ref = ref; };

    public handleHoverOnCell = (currentCursorPosition: number): void => {
        if (typeof currentCursorPosition === "number") {
            if (typeof this.props.onHovering === "function") {
                this.props.onHovering(currentCursorPosition);
            }
            this.setState({ currentCursorPosition });
        }
    }

    public handleScroll = (nextProps?: LineProps): void => {
        const {
            isFocused, cursorAt, addrStart, length, scrollTo, onFinishScroll, lineNum, lineCount,
        } = nextProps || this.props;
        const isLastLine = Math.ceil(lineNum / length) + 1 === lineCount;
        if (this.ref && scrollTo === cursorAt && isFocused) {
            if (addrStart < cursorAt && cursorAt < (addrStart + length + 1)) {
                // this line is active
                const { top, bottom } = this.ref.getBoundingClientRect();
                if (top > window.innerHeight) {
                    const height = bottom - top;
                    console.log("hey", top, top - height, window.innerHeight);
                    window.scroll(0, top - height);
                    onFinishScroll();
                } else if (isLastLine) {
                    // If last line and no need to scroll, reset scroll flag
                    onFinishScroll();
                }
            }
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

    public componentDidMount() {
        this.handleScroll();
    }

    public componentWillReceiveProps(nextProp: LineProps) {
        this.setState({ line: this.getLineArray(nextProp) });
        this.handleScroll(nextProp);
    }

    public shouldComponentUpdate(nextProps: LineProps, nextState: LineState) {
        return shallowCompare(this, nextProps, nextState);
    }

    public render() {
        const {
            addrStart, moveCursor, cursorAt, editingCellAt, editingCellTempValue, isFocused,
            selection, onBeginSelection, onUpdateSelection, onFinishSelection, lineNum,
        } = this.props;
        const { line, currentCursorPosition } = this.state;
        const num = lineNum.toString(16).toUpperCase();
        return (
            <div
                className={css.lineContainer}
                onDoubleClick={this.handleClickLine}
                onMouseEnter={this.handleEnter}
                onMouseMove={this.handleEnter}
                onMouseLeave={this.handleLeave}
                ref={this.setRef}
            >
                <div
                    className={css.line}
                    onClick={this.handleClickLine}
                >
                    <span>{formatString(num, 8)}</span>
                </div>

                <div className={css.hexLineContainer}>
                {line.map((char, idx) => (
                    <HexCell
                        key={idx}
                        char={char}
                        cursorAt={cursorAt}
                        currentCursorPosition={currentCursorPosition}
                        editingCellAt={editingCellAt}
                        editingCellTempValue={editingCellTempValue}
                        pos={addrStart + idx}
                        onHovering={this.handleHoverOnCell}
                        onClick={moveCursor}
                        selection={selection}
                        onBeginSelection={onBeginSelection}
                        onUpdateSelection={onUpdateSelection}
                        onFinishSelection={onFinishSelection}
                        isFocused={isFocused}
                    />
                ))}
                </div>

                <div className={css.asciiLineContainer}>
                {line.map((char, idx) => (
                    <AsciiCell
                        key={idx}
                        char={char}
                        cursorAt={cursorAt}
                        currentCursorPosition={currentCursorPosition}
                        editingCellAt={editingCellAt}
                        editingCellTempValue={editingCellTempValue}
                        pos={addrStart + idx}
                        onHovering={this.handleHoverOnCell}
                        onClick={moveCursor}
                        selection={selection}
                        onBeginSelection={onBeginSelection}
                        onUpdateSelection={onUpdateSelection}
                        onFinishSelection={onFinishSelection}
                        isFocused={isFocused}
                    />
                ))}
                </div>
            </div>
        );
    }

    private handleClickLine = (): void => {
        const { selectLine, lineNum } = this.props;
        if (typeof selectLine === "function") {
            selectLine(lineNum);
        }
    }

    private handleEnter = (): void => {
        if (!this.state.isHovering) {
            this.setState({ isHovering: true });
        }
    }

    private handleLeave = (): void => {
        this.setState({ isHovering: false, currentCursorPosition: undefined });
    }
}

export default Line;

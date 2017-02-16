import * as React from "react";
import * as shallowCompare from "react-addons-shallow-compare";

import * as css from "./HexEditor.css";

import { Highlight } from "./";

import AsciiCell from "./AsciiCell";
import HexCell from "./HexCell";
import { Selection } from "./HexEditor";

export interface Value {
    data?: string[];
}

export interface LineProps {
    addrStart: number;
    cursorAt: number;
    editingCellAt: number;
    editingCellTempValue: string;
    highlights?: Highlight[];
    isFocused: boolean;
    length: number;
    lineCount: number;
    lineNum: number;
    moveCursor: (to: number) => void;
    onBeginSelection: (from: number) => void;
    onFinishScroll: () => void;
    onFinishSelection: (to: number) => void;
    onHovering: (pos: number) => void;
    onUpdateSelection: (to: number) => void;
    scrollTo: number;
    selection: Selection;
    selectLine: (lineNum: number) => void;
    value: Value;
}

export interface LineState {
    currentCursorPosition?: number;
    isHovering?: boolean;
    line: string[];
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

        // Adding +1 as lineCount is the length of array (not index of)
        const isLastLine = Math.ceil(lineNum / length) + 1 === lineCount;
        const isFirstLine = Math.ceil(lineNum / length) === 0;
        if (this.ref && scrollTo === cursorAt && isFocused) {
            if (addrStart < cursorAt && cursorAt < (addrStart + length + 1)) {
                // this line is active
                const { top, bottom } = this.ref.getBoundingClientRect();
                const { innerHeight, scrollY } = window;
                if (bottom > innerHeight - 20) {
                    const newY = scrollY + (bottom - innerHeight) + 30;
                    window.scroll(0, newY);
                    onFinishScroll();
                } else if (top < 0) {
                    window.scroll(0, top + scrollY);
                    onFinishScroll();
                } else if (isLastLine || isFirstLine) {
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
                        currentCursorPosition={currentCursorPosition}
                        cursorAt={cursorAt}
                        editingCellAt={editingCellAt}
                        editingCellTempValue={editingCellTempValue}
                        isFocused={isFocused}
                        onBeginSelection={onBeginSelection}
                        onClick={moveCursor}
                        onFinishSelection={onFinishSelection}
                        onHovering={this.handleHoverOnCell}
                        onUpdateSelection={onUpdateSelection}
                        pos={addrStart + idx}
                        selection={selection}
                    />
                    ))}
                </div>

                <div className={css.asciiLineContainer}>
                {line.map((char, idx) => (
                    <AsciiCell
                        key={idx}
                        char={char}
                        currentCursorPosition={currentCursorPosition}
                        cursorAt={cursorAt}
                        editingCellAt={editingCellAt}
                        editingCellTempValue={editingCellTempValue}
                        isFocused={isFocused}
                        onBeginSelection={onBeginSelection}
                        onClick={moveCursor}
                        onFinishSelection={onFinishSelection}
                        onHovering={this.handleHoverOnCell}
                        onUpdateSelection={onUpdateSelection}
                        pos={addrStart + idx}
                        selection={selection}
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

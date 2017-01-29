import * as React from "react";

import HexCell from "./HexCell";

export interface Value {
    data?: string;
}

export interface LineProps {
    addrStart: number;
    length: number;
    cursorAt: number;
    moveCursor: (to: number) => void;
    onHovering: (pos: number) => void;
    value: Value;
}

export interface LineState {
    currentCursorPosition?: number;
    isHovering?: boolean;
}

export class Line extends React.Component<LineProps, LineState> {
    public state: LineState = { isHovering: false };

    public handleHoverOnCell = (currentCursorPosition: number): void => {
        if (typeof currentCursorPosition === "number") {
            if (typeof this.props.onHovering === "function") {
                this.props.onHovering(currentCursorPosition);
            }
            this.setState({ currentCursorPosition });
        }
    }

    public render() {
        const { addrStart, moveCursor, cursorAt } = this.props;
        // const { isHovering } = this.state;
        const line = this.getLine();
        return (
            <div
                onMouseEnter={this.handleEnter}
                onMouseMove={this.handleEnter}
                onMouseLeave={this.handleLeave}
            >
                {line.map((char, idx) => (
                    <HexCell
                        key={idx}
                        char={char}
                        cursorAt={cursorAt}
                        pos={addrStart + 2 * idx}
                        onHovering={this.handleHoverOnCell}
                        onClick={moveCursor}
                    />
                ))}
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

    private getLine(): string[] {
        const { addrStart, length, value: { data = "" } } = this.props;
        const line = data.slice(addrStart, addrStart + length).match(/.{1,2}/g) || [];
        return line;
    }
}

export default Line;

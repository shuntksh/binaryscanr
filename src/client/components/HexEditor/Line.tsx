import * as React from "react";

export interface Value {
    data?: string;
}

export interface LineProps {
    addrStart: number;
    length: number;
    value: Value;
}

export interface LineState {
    isHovering: boolean;
}

export class Line extends React.Component<LineProps, LineState> {
    public state: LineState = { isHovering: false };

    public handleEnter = (): void => { this.setState({ isHovering: true }); };
    public handleLeave = (): void => { this.setState({ isHovering: false }); };

    public render() {
        const { isHovering } = this.state;
        const line = this.getLine();
        return (
            <div
                onMouseEnter={this.handleEnter}
                onMouseLeave={this.handleLeave}
            >
                {line.map((char, idx) => <span key={idx}>{char}</span>)}
                : {line.length} : {isHovering ? "true" : "false"}
            </div>
        );
    }

    private getLine(): string[] {
        const { addrStart, length, value: { data = "" } } = this.props;
        const line = data.slice(addrStart, addrStart + length).split("");
        return line;
    }
}

export default Line;

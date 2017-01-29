import * as React from "react";

export interface HexCellProps {
    char: string;
    onClick?: (pos: number) => any;
    onHovering?: (idx: number) => void;
    cursorAt: number;
    pos: number;
}

export interface HexCellState {
    isHovering: boolean;
}

export class HexCell extends React.Component<HexCellProps, HexCellState> {
    public state: HexCellState = { isHovering: false };

    public render() {
        const { char, cursorAt, pos } = this.props;
        const { isHovering } = this.state;
        return (
            <span
                style={{ background: isHovering ? "red" : "#fff", color: cursorAt === pos ? "red" : "black" }}
                onClick={this.handleClick}
                onMouseEnter={this.handleEnter}
                onMouseMove={this.handleEnter}
                onMouseLeave={this.handleLeave}
            >
                {char}
            </span>
        );
    }

    private handleClick = (): void => {
        if (typeof this.props.onClick === "function") {
            this.props.onClick(this.props.pos);
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

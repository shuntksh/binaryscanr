import * as React from "react";

export interface TooltipProps {
    isOpen: boolean;
}

export class Tooltip extends React.Component<TooltipProps, {}> {
    public state = { active: false };
    public toolTip: HTMLDivElement;
    public setRef = (ref: HTMLDivElement) => { this.toolTip = ref; };

    public componentDidMount() {
        this.showTooltip();
    }

    public showTooltip = (): void => {
        this.setState({ active: true });
    }

    public hideTooltip = (): void => {
        this.setState({ active: false });
    }

    public render() {
        return <noscript />;
    }
}

export default Tooltip;

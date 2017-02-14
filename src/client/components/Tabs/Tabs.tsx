import * as React from "react";

export interface TabsProps {
    tabs: string[];
    onChange: (tabNumber: number) => void;
}

export class Tabs extends React.Component<TabsProps, {}> {
    public render() {
        return (
            <div>Tab</div>
        );
    }

    private getTabs(): JSX.Element {
        const { children } = this.props;
        return React.Children.map(children, (child) => {
            

        });
    }
}

export default Tabs;

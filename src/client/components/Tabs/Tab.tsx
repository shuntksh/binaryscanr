import * as React from "react";

import * as css from "./Tabs.css";

export interface TabProps {
    tabId: number;
    name: string;
    active: boolean;
    onChange: (tabId: number) => any;
}

export const Tab: React.SFC<TabProps> = (props: TabProps) => {
    return (
        <div>Tab</div>
    );
};

export default Tab;

import * as React from "react";
import { connect } from "react-redux";

import PulldownMenu, { MenuItemProps } from "../components/PulldownMenu";

export class ExapmleSelectorContainer extends React.Component<{}, {}> {
    public render() {
        const menus: MenuItemProps[] = [
            { label: "Random", value: "props" },
            { label: "Radius", value: "props" },
            { label: "HTTP", value: "props" },
            { label: "DHCPv4", value: "props" },
        ];
        return (
            <PulldownMenu menus={menus} placeholder="Examples" value="" onChange={console.log}/>
        );
    }
}

export default connect()(ExapmleSelectorContainer);

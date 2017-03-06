import * as React from "react";
import { connect } from "react-redux";
import { ActionCreator, Dispatch } from "redux";

import { AppState } from "../app";
import PulldownMenu, { MenuItemProps } from "../components/PulldownMenu";
import { actions, selectors } from "../store/module";

export interface HexEditorProps {
    readonly example?: string;
};

export interface DispatchedProps {
    readonly setExample: (example: string) => void;
}

const mapState = (state: AppState): HexEditorProps => ({
    example: selectors.getCurrentExample()(state),
});

const mapDispatch = (dispatch: Dispatch<ActionCreator<any>>): DispatchedProps => ({
    setExample: (example: string) => dispatch(actions.setExample(example)),
});

export class ExapmleSelectorContainer extends React.Component<HexEditorProps & DispatchedProps, {}> {
    public render() {
        const { example, setExample } = this.props;
        const menus: MenuItemProps[] = [
            { label: "Random", value: "random" },
            { label: "---", value: "--" },
            { label: "Radius", value: "radius" },
            { label: "HTTP", value: "http" },
            { label: "DHCPv4", value: "dhcp4" },
        ];
        return (
            <PulldownMenu
                menus={menus}
                placeholder="Examples"
                value={example || ""}
                onChange={setExample}
            />
        );
    }
}

export default connect(mapState, mapDispatch)(ExapmleSelectorContainer);

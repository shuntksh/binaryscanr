import * as React from "react";
import { connect } from "react-redux";

import * as css from "../app.css";

import HexEditorContainer from "../containers/HexEditorContainer";
import InputContainer from "../containers/InputContainer";
import location from "../containers/LocationHoC";

// export interface ILayoutState {}

export class MainLayout extends React.Component<{}, {}> {
    public displayName: string;
    public render() {
        return (
            <div>
                <div className={css.row}>
                    <InputContainer />
                </div>
                <div className={css.row}>
                    <HexEditorContainer />
                </div>
            </div>
        );
    }
}
export default connect()(location(MainLayout));

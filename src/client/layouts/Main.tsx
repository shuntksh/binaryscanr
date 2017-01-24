import * as React from "react";
import { connect } from "react-redux";

import * as css from "../app.css";

import InputSection from "../containers/InputSection";
import location from "../containers/LocationHoC";

// export interface ILayoutState {}

export class MainLayout extends React.Component<{}, {}> {
    public displayName: string;
    public render() {
        return (
            <div>
                <div className={css.row}>
                    <InputSection />
                </div>
            </div>
        );
    }
}
export default connect()(location(MainLayout));

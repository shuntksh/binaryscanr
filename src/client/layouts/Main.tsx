import * as React from "react";
import { connect } from "react-redux";

import InputSection from "../containers/InputSection";
import location from "../containers/LocationHoC";

// export interface ILayoutState {}

export class MainLayout extends React.Component<{}, {}> {
    public displayName: string;
    public render() {
        return (
           <InputSection />
        );
    }
}
export default connect()(location(MainLayout));

import * as React from "react";
import { connect } from "react-redux";

import PulldownMenu from "../components/PulldownMenu";

export class ExapmleSelectorContainer extends React.Component<{}, {}> {
    public render() {
        return (
            <PulldownMenu />
        );
    }
}

export default connect()(ExapmleSelectorContainer);

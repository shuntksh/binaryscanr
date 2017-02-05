import * as cx from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import * as css from "../app.css";

import HexEditorContainer from "../containers/HexEditorContainer";
import InputContainer from "../containers/InputContainer";
import location from "../containers/LocationHoC";
import ResultTableContainerProps from "../containers/ResultTableContainer";

export class MainLayout extends React.Component<{}, {}> {
    public displayName: string;
    public render() {
        return (
            <div>
                <div className={cx(css.row, css.header)}>
                    <InputContainer />
                </div>
                <div className={css.row}>
                    <div className={css.hexSection}>
                        <div className={css.hexEditorContainer}>
                            <HexEditorContainer />
                        </div>
                        <div className={css.resultSectionContainer}>
                            <ResultTableContainerProps />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default connect()(location(MainLayout));

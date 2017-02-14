import * as cx from "classnames";
import * as React from "react";

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
                        <div className={css.sectionHeader}>
                            <span>Hexadecimal Input (Max: 1500 bytes)</span>
                        </div>
                        <HexEditorContainer />
                    </div>
                    <div className={css.resultSectionContainer}>
                        <div className={css.sectionHeader}>
                            <span className={css.active}>Results</span>
                            <span className={css.tabs}>Help</span>
                        </div>
                        <ResultTableContainerProps />
                    </div>
                </div>
            </div>
        </div>
        );
    }
}
export default location(MainLayout);

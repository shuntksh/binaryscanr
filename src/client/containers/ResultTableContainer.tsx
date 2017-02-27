import * as cx from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import { AppState, Result } from "../app";
import * as css from "../app.css";
import HelpTable from "../components/HelpTable";
import ResultTable from "../components/ResultTable";
import { selectors } from "../store/module";

export interface ResultTableContainerProps {
    readonly results: Result[];
    readonly error?: string;
    readonly tab: string;
};

const mapState = (state: AppState): ResultTableContainerProps => ({
    error: selectors.getError()(state),
    results: selectors.getResults()(state),
    tab: selectors.getCurrentTab()(state),
});

export class ResultTableContainer extends React.Component<ResultTableContainerProps, {}> {
    public render() {
        const { error, results, tab } = this.props;
        const classNames: string[] = [css.tabInner];
        if (tab === "results") {
            classNames.push(css.toRight);
        } else {
            classNames.push(css.toLeft);
        }
        return (
            <div style={{ position: "relative" }} >
                <div className={css.tabContainer}>
                    <div className={cx(classNames)}>
                        <div className={css.tabItem}>
                            <ResultTable results={results} />
                        </div>
                        <div className={css.tabItem} style={{ marginLeft: "10px" }}>
                            <HelpTable />
                        </div>
                    </div>
                </div>
                {error && <span className={css.errorBox}>{error}</span>}
            </div>
        );
    }
}
export default connect(mapState)(ResultTableContainer);

import * as React from "react";
import { connect } from "react-redux";

import { AppState, Result } from "../app";
import * as css from "../app.css";
import ResultTable from "../components/ResultTable";
import { selectors } from "../store/module";

export interface ResultTableContainerProps {
    readonly results: Result[];
    readonly error?: string;
};

const mapState = (state: AppState): ResultTableContainerProps => ({
    error: selectors.getError()(state),
    results: selectors.getResults()(state),
});

export class ResultTableContainer extends React.Component<ResultTableContainerProps, {}> {
    public render() {
        const { error, results } = this.props;
        return (
            <div style={{ position: "relative" }} >
                <ResultTable results={results} />
                {error && <span className={css.errorBox}>{error}</span>}
            </div>
        );
    }
}
export default connect(mapState)(ResultTableContainer);

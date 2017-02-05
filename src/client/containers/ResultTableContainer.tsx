import * as React from "react";
import { connect } from "react-redux";

import { AppState, Result } from "../app";
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
            <ResultTable
                results={results}
                error={error}
            />
        );
    }
}
export default connect(mapState)(ResultTableContainer);

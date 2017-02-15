import * as React from "react";

import { Result } from "../../app";
import ResultItem from "./ResultItem";

export interface ResultTableProps {
    results: Result[];
}

export class ResultTable extends React.Component<ResultTableProps, {}> {
    public render() {
        const { results } = this.props;
        return (
            <div style={{ paddingTop: "5px" }}>
                {results.map((result, idx) => <ResultItem key={idx} result={result} />)}
            </div>
        );
    }
}

export default ResultTable;

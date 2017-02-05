import * as React from "react";

import { Result } from "../../app";
import ResultItem from "./ResultItem";

export interface ResultTableProps {
    error?: string;
    results: Result[];
}

export class ResultTable extends React.Component<ResultTableProps, {}> {
    public render() {
        const { error, results } = this.props;
        return (
            <div>
                {results.map((result, idx) => <ResultItem key={idx} result={result} />)}
                <span>{error}</span>
            </div>
        );
    }
}

export default ResultTable;

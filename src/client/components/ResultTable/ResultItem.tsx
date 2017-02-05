// import * as cx from "classnames";
import * as React from "react";

import { Result } from "../../app";
import * as css from "./ResultTable.css";

export interface ResultItemProps {
    result: Result;
}

export const ResultItem: React.SFC<ResultItemProps> = (props: ResultItemProps) => {
    const { result: { value, varName, formatter = "" } } = props;
    const c = formatter.slice(0, 1);
    // const n = formatter.slice(1);
    return (
        <div className={css.outer}>
            <span className={css.formatter}>{c}</span>
            <span className={css.varName}>{varName}</span>
            <span className={css.value}>{value}</span>
        </div>
    );
};

export default ResultItem;

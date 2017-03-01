import * as React from "react";

import * as css from "./HelpTable.css";

export const HelpTable: React.SFC<{}> = () => {
    return (
    <div className={css.container}>
        <div className={css.box}>
            <span className={css.formatString}>
                a/A
            </span>
            <span className={css.description}>
                help
            </span>
        </div>
        <div className={css.box}>
            <span className={css.formatString}>
                a/A
            </span>
            <span className={css.description}>
                help
            </span>
        </div>
        <div className={css.box}>
            <span className={css.formatString}>
                a/A
            </span>
            <span className={css.description}>
                help
            </span>
        </div>
        <div className={css.box}>
            <span className={css.formatString}>
                a/A
            </span>
            <span className={css.description}>
                help
            </span>
        </div>
        <div className={css.box}>
            <span className={css.formatString}>
                a/A
            </span>
            <span className={css.description}>
                help
            </span>
        </div>
    </div>
    );
};

export default HelpTable;

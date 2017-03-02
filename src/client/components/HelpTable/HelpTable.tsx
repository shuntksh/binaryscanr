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
                an ASCII formatted character string. <strong>A</strong> uses space for padding instead of null.
            </span>
        </div>
        <div className={css.box}>
            <span className={css.formatString}>
                b/B
            </span>
            <span className={css.description}>
               binary digits in litte-endian with <strong>b</strong> and big-endian with <strong>B</strong>.
            </span>
        </div>
        <div className={css.box}>
            <span className={css.formatString}>
                h/H
            </span>
            <span className={css.description}>
                hexadecimal digits in litte-endian with <strong>h</strong> and big-endian with <strong>H</strong>.
            </span>
        </div>
        <div className={css.box}>
            <span className={css.formatString}>
                c
            </span>
            <span className={css.description}>
                8-bit integer values.
            </span>
        </div>
        <div className={css.box}>
            <span className={css.formatString}>
                s/S
            </span>
            <span className={css.description}>
                16-bit integer values in litte-endian with <strong>s</strong> and big-endian with <strong>S</strong>.
            </span>
        </div>
        <div className={css.box}>
            <span className={css.formatString}>
                i/I
            </span>
            <span className={css.description}>
                32-bit integer values in litte-endian with <strong>i</strong> and big-endian with <strong>I</strong>.
            </span>
        </div>
        <div className={css.box}>
            <span className={css.formatString}>
                f
            </span>
            <span className={css.description}>
                Returns a string of one or more single-precision floating point values. (*)
            </span>
        </div>
        <div className={css.box}>
            <span className={css.formatString}>
                d
            </span>
            <span className={css.description}>
                Returns a string of one or more double-precision floating point values. (*)
            </span>
        </div>
        <div className={css.box}>
            <span className={css.formatString}>
                x/X
            </span>
            <span className={css.description}>
                Moves cursor count bytes forward with <strong>x</strong> and backward with <strong>X</strong>
            </span>
        </div>
        <div className={css.box}>
            <span className={css.formatString}>
                @
            </span>
            <span className={css.description}>
                Moves cursor to the absolute location.
            </span>
        </div>
    </div>
    );
};

export default HelpTable;

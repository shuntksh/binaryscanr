import * as React from "react";

import * as css from "./HelpTable.css";

export const HelpTable: React.SFC<{}> = () => {
    return (
    <div className={css.container}>
        <div className={css.box}>
            <span className={css.formatString}>
                aA
            </span>
            <span className={css.description}>
                An ASCII formatted character string. <strong>A</strong> uses space for padding instead of null.
            </span>
        </div>
        <div className={css.box}>
            <span className={css.formatString}>
                bB
            </span>
            <span className={css.description}>
               Binary digits in litte-endian with <strong>b</strong> and big-endian with <strong>B</strong>.
            </span>
        </div>
        <div className={css.box}>
            <span className={css.formatString}>
                hH
            </span>
            <span className={css.description}>
                Hexadecimal digits in litte-endian with <strong>h</strong> and big-endian with <strong>H</strong>.
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
                sS
            </span>
            <span className={css.description}>
                16-bit integer values in litte-endian with <strong>s</strong> and big-endian with <strong>S</strong>.
            </span>
        </div>
        <div className={css.box}>
            <span className={css.formatString}>
                iI
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
                Single-precision floating point values. (*)
            </span>
        </div>
        <div className={css.box}>
            <span className={css.formatString}>
                d
            </span>
            <span className={css.description}>
                Double-precision floating point values. (*)
            </span>
        </div>
        <div className={css.box}>
            <span className={css.formatString}>
                xX
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
        <span className={css.footNote}>
            (*) Floating-point value may vary depends on platform.&nbsp;
            For a complete Tcl binary scan syntax guide, see the&nbsp;
            <a href="https://www.tcl.tk/man/tcl8.0/TclCmd/binary.htm">reference manual</a>.
        </span>
    </div>
    );
};

export default HelpTable;

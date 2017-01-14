/* tslint:disable:no-console */
import * as React from "react";
import * as css from "./TaggableInput.css";

export interface HighlightProps {
    at: number; // 0 <= from <= length
    length: number; // from <= length <= length
    bgColor?: string; // Background Color
    fgColor?: string; // Foreground (font) Color
    highlight?: boolean; // If fill hightlight color
    underline?: boolean; // If draw underline
    value?: string; // Placeholder string to show
}

export const Highlight = (props: HighlightProps) => {
    const style: any = {};
    const {
        at = 2, length = 6, bgColor, fgColor, highlight, value,
    } = props;

    if ((at > length) || typeof at !== "number" && typeof length !== "number") {
        return <noscript />;
    }

    const spacing = new Array(at).join(" ");

    if (highlight && bgColor) { style.backgroundColor = bgColor; }
    if (fgColor) { style.color = fgColor; }

    return (
        <div className={css.inner}>
            <span className={css.spacing}>{spacing}</span>
            <span
                className={css.highlight}
                style={style}
            >
                {value || new Array(length - at + 1).join(" ")}
            </span>
        </div>
    );
};

export default Highlight;

/* tslint:disable:no-console */
import * as React from "react";
import * as css from "./TaggableInput.css";

export interface HighlightProps {
    from: number; // 0 <= from <= length
    to: number; // from <= to <= length
    bgColor?: string; // Background Color
    fgColor?: string; // Foreground (font) Color
    highlight?: boolean; // If fill hightlight color
    underline?: boolean; // If draw underline
    value?: string; // Placeholder string to show
}

export const Highlight = (props: HighlightProps) => {
    const style: any = {};
    const {
        from = 0, to = 0, bgColor, fgColor, highlight, value,
    } = props;

    if ((from > to) || typeof from !== "number" && typeof to !== "number") {
        return <noscript />;
    }

    const spacing = new Array(from).join(" ");

    if (highlight && bgColor) { style.backgroundColor = bgColor; }
    if (fgColor) { style.color = fgColor; }
    return (
        <div className={css.inner}>
            <span className={css.spacing}>{spacing}</span>
            <span
                className={css.highlight}
                style={style}
            >
                {value || new Array(to - from + 1).join(" ")}
            </span>
        </div>
    );
};

export default Highlight;

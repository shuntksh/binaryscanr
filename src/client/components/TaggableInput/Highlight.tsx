import * as cx from "classnames";
import * as React from "react";

import isEmpty from "../../helpers/isEmpty";
import * as css from "./TaggableInput.css";

import { IHighlight, Intent } from "./index";

export interface HighlightProps extends IHighlight {
    bgColor?: string; // Background Color
    fgColor?: string; // Foreground (font) Color
    highlight?: boolean; // If fill hightlight color
    underline?: boolean; // If draw underline
    value?: string; // Placeholder string to show
}

export const Highlight = (props: HighlightProps) => {
    const {
        at = 0, size = 0, color, style, intent, placeholder,
    } = props;

    const highlightStyle: any = {};
    const highlightClassNames: any[] = [css.highlight];

    if ((at > size) || typeof at !== "number" && typeof size !== "number") {
        return <noscript />;
    }

    const spacing = new Array(at).join(" ");

    if (intent === Intent.None) {
        highlightStyle.backgroundColor = "transparent";
    }

    if (color) {
        highlightStyle.backgroundColor = color;
    }

    // Animation
    if (!placeholder && (intent !== Intent.None || color)) {
        highlightClassNames.push(css.highlightAnimation);
    }

    return (
        <div className={css.inner}>
            <span className={css.highlghtSpacing}>{spacing}</span>
            <span
                className={cx(highlightClassNames)}
                style={isEmpty(style) ? highlightStyle : style}
            >
                {placeholder || new Array(size - at + 1).join(" ")}
            </span>
        </div>
    );
};

export default Highlight;

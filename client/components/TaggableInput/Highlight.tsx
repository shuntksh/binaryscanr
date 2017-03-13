import * as cx from "classnames";
import * as React from "react";

import isEmpty from "../../helpers/isEmpty";
import * as css from "./TaggableInput.css";

import { HighlightProps, Intent } from "./index";

export const Highlight: React.SFC<HighlightProps> = (props) => {
    const {
        at = 0, size = 0, color, style, intent, placeholder,
    } = props;

    let _size = size;
    if (_size === 0 && typeof placeholder === "string" && placeholder.length) {
        _size = placeholder.length;
    }

    const highlightStyle: any = {};
    const highlightClassNames: any[] = [css.highlight];

    if ((at > _size) || typeof at !== "number" && typeof _size !== "number") {
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
        <div className={css.highlightContainer}>
            <span className={css.highlghtSpacing}>{spacing}</span>
            <span
                className={cx(highlightClassNames)}
                style={isEmpty(style) ? highlightStyle : style}
            >
                {placeholder || new Array(_size - at + 1).join(" ")}
            </span>
        </div>
    );
};

export default Highlight;

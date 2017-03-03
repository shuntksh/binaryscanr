import * as React from "react";

import * as css from "./PulldownMenu.css";

export interface PulldownMenu {
    container?: HTMLSpanElement;
}

export class PulldownMenu extends React.PureComponent<{}, {}> {
    private refHandlers: any = {
        container:  (ref: HTMLSpanElement): void => { this.container = ref; },
    };

    public render() {
        const label = "Examples";
        return (
            <div tabIndex={1} className={css.container} ref={this.refHandlers.container}>
                <span className={css.label}>{label}</span>
            </div>
        );
    }
}

export default PulldownMenu;

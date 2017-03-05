import * as cx from "classnames";
import * as React from "react";

import * as css from "./PulldownMenu.css";

export interface MenuItemProps {
    label: string;
    value: string;
    onClick?(value: string): any;
}

export interface MenuItem {
    menuContainer?: HTMLDivElement;
}

export class MenuItem extends React.PureComponent<MenuItemProps, {}> {
    public render() {
        const { label } = this.props;
        return (
        <div
            className={cx([css.menuItem, css.clickable])}
            onClick={this.handleClick}
        >
            {label}
        </div>
        );
    }

    private handleClick = (): void => {
        const { onClick, value } = this.props;
        if (typeof onClick === "function") {
            onClick(value);
        }
    }
}

export default MenuItem;

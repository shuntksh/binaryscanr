import * as cx from "classnames";
import * as React from "react";

import * as css from "./PulldownMenu.css";

export interface MenuItemProps {
    label: string;
    value: string;
    onClick?(value: string): any;
    _onClick?(value: string): any;
}

export interface MenuItem {
    menuContainer?: HTMLDivElement;
}

export class MenuItem extends React.PureComponent<MenuItemProps, {}> {
    public render() {
        const { label } = this.props;

        if (label === "---") {
            return <div className={css.seperator}/>;
        }

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
        const { _onClick, onClick, value } = this.props;
        if (typeof onClick === "function") {
            onClick(value);
        }
        if (typeof _onClick === "function") {
            _onClick(value);
        }
    }
}

export default MenuItem;

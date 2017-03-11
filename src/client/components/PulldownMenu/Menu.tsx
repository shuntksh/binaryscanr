import * as React from "react";

import * as css from "./PulldownMenu.css";

import { MenuItem, MenuItemProps } from "./";

export interface MenuProps {
    parent?: HTMLElement;
    menus: MenuItemProps[];
    onChange?(value: string): any;
}

export interface MenuState {
    left?: number;
    top?: number;
}

export interface Menu {
    menuContainer?: HTMLDivElement;
}

export class Menu extends React.PureComponent<MenuProps, MenuState> {
    public state = { top: 0, left: 0 };

    private refHandlers: any = {
        container:  (ref: HTMLDivElement): void => { this.menuContainer = ref; },
    };

    public componentDidMount() {
        this.handleResize();
        window.addEventListener("resize", this.handleResize);
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    public render() {
        const { parent, menus = [] } = this.props;
        const styles: any = {};
        if (parent) {
            styles.top = this.state.top || 0;
            styles.left = this.state.left || 0;
        }
        return (
        <div ref={this.refHandlers.container} className={css.menuOuter} style={styles}>
        {menus.map((menu, idx) => (
            <MenuItem
                key={idx}
                value={menu.value}
                onClick={this.handleCkick}
                _onClick={menu.onClick}
                label={menu.label}
            />
        ))}
        </div>
        );
    }

    private handleResize = () => {
        if (this.menuContainer && this.props.parent) {
            const { bottom, right } = this.props.parent.getBoundingClientRect();
            const { width } = this.menuContainer.getBoundingClientRect();
            const top = bottom + 2;
            const left = right - width;
            this.setState({ top, left });
        }
    }

    private handleCkick = (value: string) => {
        if (typeof this.props.onChange === "function") {
            this.props.onChange(value);
        }
    }
}

export default Menu;

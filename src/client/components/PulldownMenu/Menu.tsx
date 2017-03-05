import * as React from "react";

import * as css from "./PulldownMenu.css";

import { MenuItem, MenuItemProps } from "./";

export interface MenuProps {
    parent?: HTMLElement;
    menus: MenuItemProps[];
    onChange?(value: string): any;
}

export interface MenuState {
    width?: number;
}

export interface Menu {
    menuContainer?: HTMLDivElement;
}

export class Menu extends React.PureComponent<MenuProps, MenuState> {
    public state = { width: 0 };

    private refHandlers: any = {
        container:  (ref: HTMLDivElement): void => { this.menuContainer = ref; },
    };

    public componentDidMount() {
        if (this.menuContainer) {
            const width = this.menuContainer.getBoundingClientRect().width;
            this.setState({ width });
        }
    }

    public render() {
        const { parent, menus = [] } = this.props;
        const styles: any = {};
        if (parent) {
            const rect = parent.getBoundingClientRect();
            styles.top = rect.bottom + 2;
            styles.left = rect.right - (this.state.width || 0);
        }
        return (
        <div ref={this.refHandlers.container} className={css.menuOuter} style={styles}>
        {menus.map((menu, idx) =>
            <MenuItem
                key={idx}
                value={menu.value}
                onClick={menu.onClick}
                label={menu.label}
            />)}
        </div>
        );
    }
}

export default Menu;

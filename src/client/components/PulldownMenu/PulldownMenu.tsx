import * as React from "react";
import * as ReactDOM from "react-dom";

import { MenuItemProps } from "./";
import Menu from "./Menu";
import * as css from "./PulldownMenu.css";

export interface PulldownMenuProps {
    menus: MenuItemProps[];
    value: string;
    placeholder: string;
    onChange(value: string): any;
}

export interface PulldownMenuState {
    show?: boolean;
}

export interface PulldownMenu {
    container?: HTMLDivElement;
    menuNode?: HTMLDivElement;
}

export class PulldownMenu extends React.PureComponent<PulldownMenuProps, PulldownMenuState> {
    public state = { show: false };
    private timerRef: number[] = [];
    private refHandlers: any = {
        container:  (ref: HTMLDivElement): void => { this.container = ref; },
    };

    public componentDidMount() {
        this.menuNode = document.createElement("div");
        window.addEventListener("mouseup", this.handleClickOutside, false);
    }

    public componentWillUpdate({},  nextState: PulldownMenuState) {
        if (nextState.show) {
            this.renderMenu();
        } else {
            this.unmountMenu();
        }
    }

    public componentWillUnmount() {
        window.removeEventListener("mouseup", this.handleClickOutside);
        if (this.menuNode) {
            ReactDOM.unmountComponentAtNode(this.menuNode);
            document.body.removeChild(this.menuNode);
        }
        // Cancel inflight timer created by setTimeout
        if (this.timerRef.length) {
            this.timerRef.forEach((ref) => clearTimeout(ref));
        }
    }

    public render() {
        return (
            <div
                tabIndex={1}
                className={css.container}
                ref={this.refHandlers.container}
                onClick={this.toggleMenuState}
            >
                <span className={css.label}>{this.getValue()}</span>
            </div>
        );
    }

    private getValue = (): string => {
        const { placeholder, value, menus } = this.props;
        const idx = menus.map((i) => i.value).indexOf(value);
        return idx > -1 ? menus[idx].label : placeholder;
    }

    private setTimeout = (callback: () => any, ms: number): number => {
        const id = (window || global).setTimeout(() => {
            const idx = this.timerRef.indexOf(id);
            if (idx !== -1) { this.timerRef.splice(idx, 1); }
            if (typeof callback === "function") { callback(); }
        }, ms);
        this.timerRef.push(id);
        return id;
    }

    private handleChange = (value: string): void => {
        if (typeof this.props.onChange === "function") {
            this.props.onChange(value);
        }
        this.setTimeout(this.toggleMenuState, 50);
    }

    private handleClickOutside = (ev: any): void => {
        if (this.container && this.menuNode && this.state.show) {
            if (
                !ReactDOM.findDOMNode(this.container).contains(ev.target) &&
                !ReactDOM.findDOMNode(this.menuNode).contains(ev.target)
            ) {
                this.toggleMenuState();
            }
        }
    }

    private renderMenu = (): void => {
        if (!this.state.show && this.menuNode) {
            document.body.appendChild(this.menuNode);
            ReactDOM.render(
                <Menu
                    parent={this.container}
                    menus={this.props.menus}
                    onChange={this.handleChange}
                />,
                this.menuNode,
            );
        }
    }

    private unmountMenu = (): void => {
        if (this.state.show && this.menuNode) {
            ReactDOM.unmountComponentAtNode(this.menuNode);
            document.body.removeChild(this.menuNode);
        }
    }

    private toggleMenuState = (): void => {
        this.setState({ show: !this.state.show });
    }

}

export default PulldownMenu;

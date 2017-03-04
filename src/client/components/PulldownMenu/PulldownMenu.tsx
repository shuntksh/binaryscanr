import * as React from "react";
import * as ReactDOM from "react-dom";

import Menu from "./Menu";
import * as css from "./PulldownMenu.css";

export interface PulldownMenuState {
    show?: boolean;
}

export interface PulldownMenu {
    container?: HTMLDivElement;
    menuNode?: HTMLDivElement;
}

export class PulldownMenu extends React.PureComponent<{}, PulldownMenuState> {
    public state = { show: false };

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
            this.closeMenu();
        }
    }

    public componentWillUnmount() {
        window.removeEventListener("mouseup", this.handleClickOutside);
        if (this.menuNode) {
            ReactDOM.unmountComponentAtNode(this.menuNode);
            document.body.removeChild(this.menuNode);
        }
    }

    public render() {
        const label = "Examples";
        return (
            <div
                tabIndex={1}
                className={css.container}
                ref={this.refHandlers.container}
                onClick={this.toggleMenu}
            >
                <span className={css.label}>{label}</span>
            </div>
        );
    }

    private handleClickOutside = (ev: any): void => {
        if (this.container && this.menuNode && this.state.show) {
            if (
                !ReactDOM.findDOMNode(this.container).contains(ev.target) &&
                !ReactDOM.findDOMNode(this.menuNode).contains(ev.target)
            ) {
                this.toggleMenu();
            }
        }
    }

    private renderMenu = (): void => {
        if (!this.state.show && this.menuNode) {
            document.body.appendChild(this.menuNode);
            ReactDOM.render((
            <Menu
                parent={this.container}
            />
            ), this.menuNode);
        }
    }

    private closeMenu = (): void => {
        if (this.state.show && this.menuNode) {
            ReactDOM.unmountComponentAtNode(this.menuNode);
            document.body.removeChild(this.menuNode);
        }
    }

    private toggleMenu = (): void => {
        this.setState({ show: !this.state.show });
    }

}

export default PulldownMenu;

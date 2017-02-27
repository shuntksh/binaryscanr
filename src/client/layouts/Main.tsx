import * as cx from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { ActionCreator, Dispatch } from "redux";

import * as css from "../app.css";

import { AppState } from "../app";
import HexEditorContainer from "../containers/HexEditorContainer";
import InputContainer from "../containers/InputContainer";
import location from "../containers/LocationHoC";
import ResultTableContainerProps from "../containers/ResultTableContainer";

import { actions, selectors } from "../store/module";

export interface MainLayoutProps {
    readonly tab: string;
};

export interface DispatchedProps {
    readonly switchTab: (tab: string) => any;
}

const mapStateToProps = (state: AppState): MainLayoutProps => ({
    tab: selectors.getCurrentTab()(state),
});

const mapDispatchToProps = (dispatch: Dispatch<ActionCreator<any>>): DispatchedProps => ({
    switchTab: (tab: string) => dispatch(actions.switchTab(tab)),
});

export class MainLayout extends React.Component<MainLayoutProps & DispatchedProps, {}> {
    public displayName: string;
    public render() {
        const { tab } = this.props;
        const help = [css.tabs];
        const results = [css.tabs];
        if (tab === "help") {
            help.push(css.active);
        } else {
            results.push(css.active);
        }
        return (
        <div>
            <div className={cx(css.row, css.header)}>
                <InputContainer />
            </div>
            <div className={css.row}>
                <div className={css.hexSection}>
                    <div className={css.hexEditorContainer}>
                    <div className={css.sectionHeader}>
                            <span>Hexadecimal Input (Max: 1500 bytes)</span>
                        </div>
                        <HexEditorContainer />
                    </div>
                    <div className={css.resultSectionContainer}>
                        <div className={css.sectionHeader}>
                            <a href="#" className={cx(results)} onClick={this.switchToResult}>
                                Results
                            </a>
                            <a href="#" className={cx(help)} style={{ marginLeft: "10px" }} onClick={this.switchToHelp}>
                                Help
                            </a>
                        </div>
                        <ResultTableContainerProps />
                    </div>
                </div>
            </div>
        </div>
        );
    }

    private switchToHelp = () => this.props.switchTab("help");
    private switchToResult = () => this.props.switchTab("results");
}

export default connect(mapStateToProps, mapDispatchToProps)(location(MainLayout));

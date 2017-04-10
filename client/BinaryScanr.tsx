import * as cx from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { ActionCreator, Dispatch } from "redux";

import * as css from "./app.css";

import { AppState, Result } from "./app";
import ExampleSelectorContainer from "./containers/ExampleSelectorContainer";
import HexEditorContainer from "./containers/HexEditorContainer";
import InputContainer from "./containers/InputContainer";
import ResultTableContainerProps from "./containers/ResultTableContainer";

import { actions, selectors } from "./store/module";

export interface BinaryScanrLayoutProps {
    readonly tab: string;
    readonly results: Result[];
}

export interface DispatchedProps {
    readonly switchTab: (tab: string) => any;
}

const mapStateToProps = (state: AppState): BinaryScanrLayoutProps => ({
    results: selectors.getResults()(state),
    tab: selectors.getCurrentTab()(state),
});

const mapDispatchToProps = (dispatch: Dispatch<ActionCreator<any>>): DispatchedProps => ({
    switchTab: (tab: string) => dispatch(actions.switchTab(tab)),
});

export class BinaryScanrLayout extends React.Component<BinaryScanrLayoutProps & DispatchedProps, {}> {
    public displayName: string;

    public componentWillReceiveProps(nextProps: BinaryScanrLayoutProps & DispatchedProps) {
        if (!this.props.results.length && nextProps.results.length) {
            this.switchToResult();
        }
        if (this.props.results.length && !nextProps.results.length) {
            this.switchToHelp();
        }
    }

    public render() {
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
                        {this.renderTabs()}
                        <ResultTableContainerProps />
                    </div>
                </div>
            </div>
        </div>
        );
    }

    private renderTabs() {
        const { tab } = this.props;
        const help = [css.tabs];
        const results = [css.tabs];
        if (tab === "help") {
            help.push(css.active);
        } else {
            results.push(css.active);
        }
        return (
            <div className={css.sectionHeader}>
                <a
                    href="#"
                    className={cx(results)}
                    draggable={false}
                    onClick={this.switchToResult}
                >
                    Results
                </a>
                <a
                    href="#"
                    className={cx(help)}
                    draggable={false}
                    onClick={this.switchToHelp}
                >
                    Help
                </a>
                <div className={css.leftMenu}>
                    <ExampleSelectorContainer />
                </div>
            </div>
        );
    }

    private switchToHelp = () => this.props.switchTab("help");
    private switchToResult = () => this.props.switchTab("results");
}

export default connect(mapStateToProps, mapDispatchToProps)(BinaryScanrLayout);

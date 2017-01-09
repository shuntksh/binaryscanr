import * as React from "react";
import { connect } from "react-redux";
import { ActionCreator, Dispatch } from "redux";

import { IAppState } from "../app";
import * as css from "../app.css";
import TaggableInput from "../components/TaggableInput";
import location from "../containers/LocationHoC";
import { actions, selectors } from "../store/module";

export interface ILayoutProps extends React.Props<MainLayout> {
    readonly input: string;
};

export interface IDispatchedProps {
    readonly updateInput: (ev: React.FormEvent<Event>) => void;
}

const mapStateToProps = (state: IAppState) => ({
    input: selectors.getInput()(state),
});

const mapDispatchToProps = (dispatch: Dispatch<ActionCreator<any>>) => ({
    updateInput: (ev: React.FormEvent<Event>) => dispatch(actions.updateInput(ev)),
});

// export interface ILayoutState {}

export class MainLayout extends React.Component<ILayoutProps & IDispatchedProps, {}> {
    public displayName: string;
    public render() {
        const { input, updateInput } = this.props;
        return (
            <div className={css.inputContainer}>
                <span>[binary scan  $str</span>
                <TaggableInput value={input} handleChange={updateInput} />
                <span>]</span>
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(location(MainLayout));

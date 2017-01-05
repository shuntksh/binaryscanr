import * as React from "react";
import { connect } from "react-redux";
import { ActionCreator, Dispatch } from "redux";

import { IAppState } from "../app";
import TaggableInput from "../components/TaggableInput";
import { actions, selectors } from "../store/module";

export interface ILayoutProps extends React.Props<MainLayout> {
    readonly input: string;
};

export interface IDIspatchedProps {
    readonly updateInput: (ev: React.FormEvent<Event>) => void;
}

const mapStateToProps = (state: IAppState) => ({
    input: selectors.getInput()(state),
});

const mapDispatchToProps = (dispatch: Dispatch<ActionCreator<any>>) => ({
    updateInput: (ev: React.FormEvent<Event>) => dispatch(actions.updateInput(ev)),
});

export interface ILayoutState {
}

export class MainLayout extends React.Component<ILayoutProps & IDIspatchedProps, ILayoutState> {
    public displayName: string;
    public render() {
        const { input, updateInput } = this.props;
        return (
            <div>
                <span>Filter: </span>
                <TaggableInput value={input} handleChange={updateInput} />
            </div>
        );
    }
}
export default connect<{}, IDIspatchedProps, {}>(mapStateToProps, mapDispatchToProps)(MainLayout);

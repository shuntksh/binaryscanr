import * as React from "react";
import { connect } from "react-redux";
import { ActionCreator, Dispatch } from "redux";

import { IAppState } from "../app";
import * as css from "../app.css";
import TaggableInput, { IHighlight } from "../components/TaggableInput";
import location from "../containers/LocationHoC";
import { actions, selectors } from "../store/module";

export interface IInputSectionProps extends React.Props<InputSection> {
    readonly highlights: IHighlight[];
    readonly input: string;
    readonly valid: boolean;
};

export interface IDispatchedProps {
    readonly updateInput: (ev: React.FormEvent<Event>) => void;
}

const mapStateToProps = (state: IAppState) => ({
    highlights: selectors.getHighlights()(state),
    input: selectors.getInput()(state),
    valid: selectors.isValid()(state),
});

const mapDispatchToProps = (dispatch: Dispatch<ActionCreator<any>>) => ({
    updateInput: (ev: React.FormEvent<Event>) => dispatch(actions.updateInput(ev)),
});

// export interface ILayoutState {}

export class InputSection extends React.Component<IInputSectionProps & IDispatchedProps, {}> {
    public displayName: string;
    public render() {
        const { input, updateInput, valid, highlights } = this.props;
        return (
            <div className={css.inputContainer}>
                <span className={css.inputCaption}>[binary scan  $str</span>
                <TaggableInput
                    value={input}
                    handleChange={updateInput}
                    highlights={highlights}
                    valid={valid}
                />
                <span className={css.inputCaption}>]</span>
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(location(InputSection));

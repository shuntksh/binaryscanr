import * as React from "react";
import { connect } from "react-redux";
import { ActionCreator, Dispatch } from "redux";

import { IAppState } from "../app";
import * as css from "../app.css";
import ClearButton from "../components/ClearButton";
import CopyButton from "../components/CopyButton";
import TaggableInput, { IHighlight } from "../components/TaggableInput";
import location from "../containers/LocationHoC";
import { actions, selectors } from "../store/module";

export interface IInputSectionProps extends React.Props<InputSection> {
    readonly highlights: IHighlight[];
    readonly input: string;
    readonly strToCopy: string;
    readonly valid: boolean;
};

export interface IDispatchedProps {
    readonly clearInput: () => void;
    readonly updateInput: (ev: React.SyntheticEvent<HTMLInputElement>) => void;
}

const mapStateToProps = (state: IAppState) => ({
    highlights: selectors.getHighlights()(state),
    input: selectors.getInput()(state),
    strToCopy: selectors.getFullSentence()(state),
    valid: selectors.isValid()(state),
});

const mapDispatchToProps = (dispatch: Dispatch<ActionCreator<any>>) => ({
    clearInput: () => dispatch(actions.clearInput()),
    updateInput: (ev: React.SyntheticEvent<HTMLInputElement>) => dispatch(actions.updateInput(ev)),
});

// export interface ILayoutState {}

export class InputSection extends React.Component<IInputSectionProps & IDispatchedProps, {}> {
    public displayName: string;
    public render() {
        const { clearInput, input, updateInput, valid, highlights, strToCopy } = this.props;

        return (
            <div className={css.inputSection}>
                <div className={css.inputContainer}>
                    <span className={css.inputCaption}>
                        [binary scan  $str
                    </span>
                    <TaggableInput
                        value={input}
                        handleChange={updateInput}
                        highlights={highlights}
                        valid={valid}
                    />
                    <span className={css.inputCaption}>
                        ]
                    </span>
                </div>
                <ClearButton disabled={!input} onClick={clearInput} style={{ marginLeft: "5px" }} />
                <CopyButton value={strToCopy} style={{ marginLeft: "10px" }}/>
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(location(InputSection));

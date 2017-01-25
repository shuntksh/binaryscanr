import * as React from "react";
import { connect } from "react-redux";
import { ActionCreator, Dispatch } from "redux";

import { AppState } from "../app";
import * as css from "../app.css";
import CopyButton from "../components/CopyButton";
import TaggableInput, { HighlightProps } from "../components/TaggableInput";
import { actions, selectors } from "../store/module";

export interface InputSectionProps {
    readonly highlights: HighlightProps[];
    readonly input: string;
    readonly strToCopy: string;
    readonly valid: boolean;
};

export interface DispatchedProps {
    readonly clearInput: () => void;
    readonly updateInput: (ev: React.SyntheticEvent<HTMLInputElement>) => void;
}

const mapStateToProps = (state: AppState): InputSectionProps => ({
    highlights: selectors.getHighlights()(state),
    input: selectors.getInput()(state),
    strToCopy: selectors.getFullSentence()(state),
    valid: selectors.isValid()(state),
});

const mapDispatchToProps = (dispatch: Dispatch<ActionCreator<any>>): DispatchedProps => ({
    clearInput: () => dispatch(actions.clearInput()),
    updateInput: (ev: React.SyntheticEvent<HTMLInputElement>) => dispatch(actions.updateInput(ev)),
});

// export interface ILayoutState {}

export class InputSection extends React.Component<InputSectionProps & DispatchedProps, {}> {
    public render() {
        const {
            clearInput, input, updateInput, valid, highlights, strToCopy,
        } = this.props;
        return (
            <div className={css.inputSection}>
                <div className={css.inputContainer}>
                    <span className={css.inputCaption}>
                        [binary scan  $str
                    </span>
                    <TaggableInput
                        value={input}
                        showClearButton={true}
                        handleClear={clearInput}
                        handleChange={updateInput}
                        highlights={highlights}
                        valid={valid}
                    />
                    <span className={css.inputCaption}>
                        ]
                    </span>
                </div>
                <CopyButton value={strToCopy} style={{ marginLeft: "15px" }}/>
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(InputSection);

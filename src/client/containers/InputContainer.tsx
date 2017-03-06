import * as React from "react";
import { connect } from "react-redux";
import { ActionCreator, Dispatch } from "redux";

import { AppState } from "../app";
import * as css from "../app.css";
import CopyButton from "../components/CopyButton";
import TaggableInput, { HighlightProps } from "../components/TaggableInput";
import { actions, selectors } from "../store/module";

export interface InputContainerProps {
    readonly highlights: HighlightProps[];
    readonly input: string;
    readonly varNameStub: HighlightProps;
    readonly strToCopy: string;
    readonly valid: boolean;
};

export interface DispatchedProps {
    readonly clearInput: () => void;
    readonly resetApp: () => void;
    readonly updateInput: (ev: React.SyntheticEvent<HTMLInputElement>) => void;
}

const mapStateToProps = (state: AppState): InputContainerProps => ({
    highlights: selectors.getHighlights()(state),
    input: selectors.getInput()(state),
    strToCopy: selectors.getFullSentence()(state),
    valid: selectors.isValid()(state),
    varNameStub: selectors.getVarNameStub()(state),
});

const mapDispatchToProps = (dispatch: Dispatch<ActionCreator<any>>): DispatchedProps => ({
    clearInput: () => dispatch(actions.clearInput()),
    resetApp: () => dispatch(actions.resetApp()),
    updateInput: (ev: React.SyntheticEvent<HTMLInputElement>) => dispatch(actions.updateInput(ev)),
});

// export interface ILayoutState {}

export class InputContainer extends React.Component<InputContainerProps & DispatchedProps, {}> {
    public render() {
        const {
            clearInput, input, updateInput, valid, highlights, resetApp, strToCopy, varNameStub,
        } = this.props;
        return (
            <div className={css.inputSection}>
                <a href="/" draggable={false} className={css.logo} />
                <div className={css.inputContainer}>
                    <span className={css.inputCaption}>
                        [binary scan  $str
                    </span>
                    <TaggableInput
                        value={input}
                        showClearButton={true}
                        handleClear={clearInput}
                        handleChange={updateInput}
                        highlights={[...highlights, varNameStub]}
                        valid={valid}
                    />
                    <span className={css.inputCaption}>
                        ]
                    </span>
                </div>
                <CopyButton value={strToCopy} style={{ marginLeft: "15px" }}/>
                <button className={css.button} onClick={resetApp}>✕</button>
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(InputContainer);

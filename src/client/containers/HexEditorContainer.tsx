import * as React from "react";
import { connect } from "react-redux";
import { ActionCreator, Dispatch } from "redux";

import { AppState } from "../app";
import HexEditor, { HighlightProps } from "../components/HexEditor";
import { actions, selectors } from "../store/module";

export interface HexEditorProps {
    readonly highlights?: HighlightProps[];
    readonly value: string;
    readonly valid?: boolean;
};

export interface DispatchedProps {
    readonly updateHexData: (value: string) => void;
}

// export interface HexEditorState {}

const mapState = (state: AppState): HexEditorProps => ({
    highlights: selectors.getHighlights()(state),
    value: selectors.getHexData()(state),
});

const mapDispatch = (dispatch: Dispatch<ActionCreator<any>>): DispatchedProps => ({
    updateHexData: (value: string) => dispatch(actions.updateHexData(value)),
});

export class HexEditorContainer extends React.Component<HexEditorProps & DispatchedProps, {}> {
    public render() {
        const { value, updateHexData, highlights } = this.props;
        return (
            <HexEditor
                highlights={highlights}
                onChange={updateHexData}
                value={value}
            />
        );
    }
}
export default connect(mapState, mapDispatch)(HexEditorContainer);

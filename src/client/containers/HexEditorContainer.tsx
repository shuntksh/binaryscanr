import * as React from "react";
import { connect } from "react-redux";
// import { ActionCreator, Dispatch } from "redux";

// import { AppState } from "../app";
import HexEditor from "../components/HexEditor";
// import { actions, selectors } from "../store/module";

// export interface InputSectionProps {
//     readonly highlights: HexEditorProps[];
//     readonly input: string;
//     readonly strToCopy: string;
//     readonly valid: boolean;
// };

// export interface DispatchedProps {
//     readonly clearInput: () => void;
//     readonly updateInput: (ev: React.SyntheticEvent<HTMLInputElement>) => void;
// }

// export interface ILayoutState {}

export class HexEditorContainer extends React.Component<{}, {}> {
    public render() {
        return (
            <HexEditor />
        );
    }
}
export default connect()(HexEditorContainer);

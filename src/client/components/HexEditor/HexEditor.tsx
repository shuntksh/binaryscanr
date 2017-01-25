import * as React from "react";

interface HexEditorProps extends React.Props<HexEditor> {
    value: string;
    onChange: (value: string) => {};
}

class HexEditor extends React.Component<HexEditorProps, {}> {

}

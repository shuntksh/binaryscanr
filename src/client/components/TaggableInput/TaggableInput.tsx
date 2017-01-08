import * as React from "react";
import * as css from "./TaggableInput.css";

export interface InputProps extends React.Props<Input> {
    value?: string;
    handleChange: (ev: React.FormEvent<EventTarget>) => any;
};

export class Input extends React.Component<InputProps, {}> {
    public onChange = (ev: React.FormEvent<EventTarget>) => this.props.handleChange(ev);

    public render() {
        const { value } = this.props;
        return (
            <div>
                <div className={css.taggableContainer}>
                    <span className={css.background} />
                    <input className={css.input} value={value} onChange={this.onChange} />
                </div>
            </div>
        );
    }
}
export default Input;

import * as React from "react";
import * as css from "./TaggableInput.css";

export interface InputProps extends React.Props<Input> {
    value?: string;
    handleChange: (ev: React.FormEvent<EventTarget>) => any;
    hasError?: boolean;
};

export interface InputState {
    isActive: boolean;
}

export class Input extends React.Component<InputProps, InputState> {
    public state: InputState = {
        isActive: false,
    };

    public onChange = (ev: React.FormEvent<EventTarget>) => this.props.handleChange(ev);

    // Change the global state for 
    public setFocus = () => this.setState({ isActive: true });
    public setBlur = () => this.setState({ isActive: false });

    public render() {
        const { value } = this.props;
        return (
            <div className={css.taggableOuter}>
                <div className={css.taggableContainer}>
                    <span className={css.background} />
                    <input
                        className={css.input}
                        value={value}
                        onChange={this.onChange}
                        onFocus={this.setFocus}
                        onBlur={this.setBlur}
                    />
                </div>
            </div>
        );
    }
}
export default Input;

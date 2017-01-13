import * as cx from "classnames";
import * as React from "react";

import Hightlight from "./Highlight";
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

    public renderHighlight(): React.ReactElement<any> {
        return (
            <div className={css.inner}>
                <Hightlight
                    from={5}
                    to={7}
                    value={""}
                />
            </div>
        );
    }

    public render() {
        const { value } = this.props;
        const { isActive } = this.state;

        const className = [css.taggableOuter];
        if (isActive) { className.push(css.focus); }

        return (
            <div className={cx(className)}>
                <div className={css.inputContainer}>
                    <div className={css.background}>
                        {this.renderHighlight()}
                    </div>
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

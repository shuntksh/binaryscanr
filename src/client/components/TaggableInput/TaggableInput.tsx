import * as cx from "classnames";
import * as React from "react";

import Hightlight from "./Highlight";
import { IHighlight, Intent } from "./index";
import * as css from "./TaggableInput.css";

export interface InputProps extends React.Props<Input> {
    highlights: IHighlight[];
    value?: string;
    valid?: boolean;
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
    public setFocus = () => this.setState({ isActive: true });
    public setBlur = () => this.setState({ isActive: false });

    public renderHighlight(): React.ReactElement<any> {
        const { highlights } = this.props;
        return (
            <div className={css.inner}>
            {highlights.map((highlight, idx) => (
                <Hightlight
                    key={idx}
                    at={highlight.at}
                    size={highlight.size}
                    color={highlight.color}
                    intent={highlight.intent || Intent.None}
                    style={highlight.style || {}}
                    placeholder={highlight.placeholder || ""}
                />
            ))}
            </div>
        );
    }

    public render() {
        const { value, valid } = this.props;
        const { isActive } = this.state;
        const className = [css.taggableOuter];
        if (valid) {
            if (isActive) { className.push(css.focus); }
        } else {
            className.push(css.invalid);
        }

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

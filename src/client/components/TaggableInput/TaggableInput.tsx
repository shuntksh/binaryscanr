import * as cx from "classnames";
import * as React from "react";

import Hightlight from "./Highlight";
import { IHighlight, Intent } from "./index";
import * as css from "./TaggableInput.css";

export interface InputProps extends React.Props<Input> {
    showClearButton?: boolean;
    handleClear?: () => any;
    highlights: IHighlight[];
    value?: string;
    valid?: boolean;
    handleChange: (ev: React.FormEvent<EventTarget>) => any;
    hasError?: boolean;
};

export interface InputState {
    isActive?: boolean;
    showOutline?: boolean;
}

export class Input extends React.Component<InputProps, InputState> {
    public state: InputState = {
        isActive: false,
        showOutline: true,
    };

    public render() {
        const { value, valid, showClearButton } = this.props;
        const { isActive } = this.state;
        const className = [css.taggableOuter];
        if (valid) {
            if (isActive) { className.push(css.focused); }
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
                        tabIndex={0}
                        onChange={this.onChange}
                        onFocus={this.setFocus}
                        onBlur={this.setBlur}
                    />
                     {showClearButton && this.renderClearButton()}
                </div>
            </div>
        );
    }

    private onChange = (ev: React.FormEvent<EventTarget>) => this.props.handleChange(ev);
    private setFocus = () => this.setState({ isActive: true });
    private setBlur = () => this.setState({ isActive: false });
    private disableOutline = (): void => { this.setState({ showOutline: false }); };
    private enableOutline = (): void => { this.setState({ showOutline: true }); };

    private renderHighlight(): React.ReactElement<any> {
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

    private renderClearButton(): React.ReactElement<any> {
        const { handleClear, value } = this.props;
        const { showOutline } = this.state;
        return (
            <div className={css.clearButtonOuter} >
                <button
                    className={css.clearButton}
                    style={{ outlineWidth: showOutline ? "5px" : "0" }}
                    disabled={!value}
                    onClick={handleClear}
                    onMouseDown={this.disableOutline}
                    onMouseUp={this.enableOutline}
                >
                    ×
                </button>
            </div>
        );
    }
}
export default Input;

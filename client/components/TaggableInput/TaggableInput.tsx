import * as cx from "classnames";
import * as React from "react";

import Hightlight from "./Highlight";
import { HighlightProps, Intent } from "./index";
import * as css from "./TaggableInput.css";

export interface InputProps extends React.Props<Input> {
    showClearButton?: boolean;
    handleClear?: () => any;
    highlights: HighlightProps[];
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

    //
    // Public Methods
    //

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
                        style={{ color: valid ? null : "#ff3737" }}
                    />
                    {showClearButton && this.renderClearButton()}
                    {this.renderOutline(true)}
                    {this.renderOutline()}
                </div>
            </div>
        );
    }

    //
    // Private Methods
    //

    private onChange = (ev: React.FormEvent<EventTarget>) => this.props.handleChange(ev);
    private setFocus = () => this.setState({ isActive: true });
    private setBlur = () => this.setState({ isActive: false });
    private disableOutline = (): void => { this.setState({ showOutline: false }); };
    private enableOutline = (): void => { this.setState({ showOutline: true }); };

    private renderOutline(background: boolean = false): JSX.Element {
        const { isActive } = this.state;
        const classNames = background ?
            [css.outline, css.outlineBackground] :
            [css.outline, isActive ? css.active : css.inactive];
        if (!this.props.valid) { classNames.push(css.invalidOutline); }
        return (
            <div className={cx(classNames)} />
        );
    }

    private renderHighlight(): JSX.Element {
        const { highlights } = this.props;
        return (
            <div className={css.inner}>
            {highlights.map((h, idx) => (
                <Hightlight
                    key={idx}
                    at={h.at}
                    size={h.size}
                    color={h.color}
                    intent={h.intent || Intent.None}
                    style={h.style || {}}
                    placeholder={h.placeholder || ""}
                />
            ))}
            </div>
        );
    }

    private renderClearButton(): JSX.Element {
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

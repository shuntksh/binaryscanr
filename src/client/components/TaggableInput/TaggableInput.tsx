import * as React from "react";
import * as CSS from "./TaggableInput.css";

export interface InputProps {
  value?: string;
  handleChange: (ev: React.FormEvent<EventTarget>) => any;
};

class Input extends React.Component<InputProps, {}> {
  public onChange = (ev: React.FormEvent<EventTarget>) => this.props.handleChange(ev);

  public render() {
    const { value } = this.props;
    return (
      <input className={CSS.input} value={value} onChange={this.onChange} />
    );
  }
}
export default Input;

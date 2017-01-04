import * as React from "react";
import { connect } from "react-redux";

import TaggableInput from "../components/TaggableInput";

export interface LayoutState {
  readonly value: any;
};

export class Layout extends React.Component<{}, LayoutState> {
  public static propTypes = {
    // React
    data: React.PropTypes.string,
  };

  public displayName: string;
  public state = { value: "" };
  public updateInput = (ev: React.FormEvent<Event>): void => {
    const target = ev.target as HTMLInputElement;
    this.setState({ value: target.value });
  }

  public render() {
    return (
      <div>123test2<span>test</span>
        <TaggableInput value={this.state.value} handleChange={this.updateInput} />
      </div>
    );
  }
}
export default connect()(Layout);

import * as React from "react";
import { connect } from "react-redux";

import TaggableInput from "./components/TaggableInput";

export class Layout<P, S> extends React.Component<P, S> {
  public static propTypes = {
    // React
    data: React.PropTypes.string,
  };

  public displayName: string;

  // constructor(props?: P, context?: any) {
  //   super(props, context);
  // }

  public render() {
    return (
      <div>123test2<span>test</span>
        <TaggableInput />
      </div>
    );
  }
}
export default connect()(Layout);

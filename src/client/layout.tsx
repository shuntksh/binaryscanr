import * as React from "react";
import { connect } from "react-redux";

export class Layout<P, S> extends React.Component<P, S> {
  public static propTypes = {
    // React
    data: React.PropTypes.string,
  };

  public displayName: string;

  constructor(props?: P, context?: any) {
    super(props, context);
  }

  public render() {
    return (
      <div>test</div>
    );
  }
}
export default connect()(Layout);

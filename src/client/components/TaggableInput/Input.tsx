import * as React from "react";

import * as CSS from "./TaggableInput.css";

export interface InputProps {

};

class Input extends React.Component<InputProps, {}> {
  public static propTypes = {
    tags: React.PropTypes.shape({

    }),
  };

  public render() {
    return (
      <input className={CSS.input} />
    );
  }
}
export default Input;

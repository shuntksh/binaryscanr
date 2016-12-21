import * as React from "react";
import * as ReactDom from "react-dom";
import { Provider } from "react-redux";

import Layout from "./layout";

ReactDom.render(
  <Provider><Layout /></Provider>,
  document.querySelector("app"),
);
import * as React from "react";
import * as ReactDom from "react-dom";
import { Provider } from "react-redux";

import Layout from "./layout";
import configureStore from "./store";

// Load initial state from passed by the backend
const store = configureStore((window as any).__PRELOADED_STATE__ || {});

ReactDom.render(
  <Provider store={store}><Layout /></Provider>,
  document.getElementById("app"),
);

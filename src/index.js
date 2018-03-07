import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { init } from "@rematch/core";
import App from "./App";
import traders from "./models/traders";
import currencies from "./models/currencies";
import simulation from "./models/simulation";

const store = init({
  models: {
    traders,
    currencies,
    simulation
  }
});

// import registerServiceWorker from './registerServiceWorker';

// Use react-redux's <Provider /> and pass it the store.
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// No need for this one yet
// registerServiceWorker();

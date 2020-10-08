import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./registerServiceWorker";
import { HashRouter } from "react-router-dom";
import LoadingIndicator from "./components/LoadingIndicator";

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <App />
      <LoadingIndicator />
    </HashRouter>
    ,
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();

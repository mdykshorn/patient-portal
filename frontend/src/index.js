import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./registerServiceWorker";
import { HashRouter } from "react-router-dom";
import LoadingIndicator from "./components/LoadingIndicator";
import Typography from "@material-ui/core/Typography";

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <App />
      <LoadingIndicator />
      <Typography variant="body2" color="textSecondary" component="p">
        This application is built for research purposes, no information provided
        is intended to replace the reccomendations of your physician © 2020
        mdykshorn
      </Typography>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import { store } from "./helpers";
import { App } from "./App";

import LoadingIndicator from "./views/LoadingIndicator";
import Typography from "@material-ui/core/Typography";
import { Paper } from "@material-ui/core";

ReactDOM.render(
  <Provider store={store}>
    <App />
    <LoadingIndicator />
    <Paper>
      <Typography variant="body2" color="textSecondary" component="p">
        This application is built for research purposes, no information provided
        is intended to replace the reccomendations of your physician © 2020
        mdykshorn
      </Typography>
    </Paper>
  </Provider>,

  document.getElementById("app")
);

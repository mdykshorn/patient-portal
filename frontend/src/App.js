import React from "react";
import "./App.css";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { history } from "./helpers";
import { PrivateRoute } from "./components";
import SearchLanding from "./views/SearchLanding";
import PatientDetails from "./views/PatientDetails";
import PatientList from "./views/PatientList";
import { Login } from "./views/Login";
import { Register } from "./views/Register";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { alert } = this.props;
    return (
      <Router history={history}>
        <Switch>
          <PrivateRoute exact path="/" component={Login} />
          <PrivateRoute path="/search/:searchName" component={PatientList} />
          <PrivateRoute path="/search/" component={SearchLanding} exact />
          <PrivateRoute path="/patient/:pid" component={PatientDetails} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Redirect from="*" to="/" />
        </Switch>
      </Router>
    );
  }
}

function mapState(state) {
  const { alert } = state;
  return { alert };
}

const connectedApp = connect(mapState)(App);
export { connectedApp as App };

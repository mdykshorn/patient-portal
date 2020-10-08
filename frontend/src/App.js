import React from "react";
import "./App.css";
import { Route, Switch } from "react-router-dom";
import SearchLanding from "./components/SearchLanding";
import PatientDetails from "./components/PatientDetails";
import patientList from "./components/PatientList";

function App() {
  return (
    <div>
      <Switch>
        <Route path="/" component={SearchLanding} exact />
        <Route path="/search/:searchName" component={patientList} />
        <Route path="/search/" component={SearchLanding} exact />
        <Route path="/patient/:pid" component={PatientDetails} />
      </Switch>
    </div>
  );
}

export default App;

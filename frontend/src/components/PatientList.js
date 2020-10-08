import React, { Component } from "react";
import { Grid, TextField } from "@material-ui/core";
import { trackPromise } from "react-promise-tracker";
import NavBar from "./NavBar";
import Patient from "./Patient";

class PatientList extends Component {
  constructor(props) {
    super();
    this.state = {
      name: props.match.params.searchName,
      patients: [],
    };
  }

  componentDidMount() {
    trackPromise(
      fetch(`api/patient?name=${this.state.name}`, {
        accept: "application/json",
      })
        .then((response) => response.json())
        .then((patients) => {
          console.log(patients);
          this.setState({
            patients: patients,
          });
        })
        .catch((err) => {
          console.log(err);
          this.setState({ loading: false });
        })
    );
  }

  render() {
    return (
      <div>
        {this.state.patients ? (
          <div>
            <NavBar />
            <Grid container spacing={2} style={{ padding: 12 }}>
              {this.state.patients.map((patient, index) => {
                return (
                  <Grid key={index} item xs={12} sm={6} lg={4} xl={3}>
                    <Patient patient={patient} />
                  </Grid>
                );
              })}
            </Grid>
          </div>
        ) : (
          "Could not find Patient"
        )}
      </div>
    );
  }
}

export default PatientList;

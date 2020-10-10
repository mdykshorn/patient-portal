import React, { Component } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import NavBar from "./NavBar";
import { Card, Grid, Typography } from "@material-ui/core";
import { trackPromise } from "react-promise-tracker";
import { ScatterChart, LineChart } from "react-chartkick";
import "chart.js";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    minwidth: 275,
    alignItems: "center",
    maxWidth: 400,
  },
  alignBox: {
    width: 500,
    height: 300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "30%",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

class PatientDetails extends Component {
  constructor(props) {
    super();
    this.state = {
      id: props.match.params.pid,
      patient: {},
      observations: {},
    };
  }
  componentDidMount() {
    trackPromise(
      fetch(`api/patient/${this.state.id}`, {
        accept: "application/json",
      })
        .then((response) => response.json())
        .then((patient) => {
          this.setState(patient);
        })
        .catch((err) => {
          console.log(err);
          this.setState({ loading: false });
        })
    );
  }
  render() {
    const { classes } = this.props;

    console.log(this.state);
    return (
      <div>
        <NavBar />
        <Grid
          item
          xs={12}
          sm={6}
          lg={4}
          xl={3}
          component="span"
          className={classes.alignBox}
        >
          <Card className={classes.root}>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            />
            <Typography variant="h5" component="h2">
              Name: {this.state.patient.name}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              DOB: {this.state.patient.birthDate}
            </Typography>
          </Card>
          {this.state.prognosis ? (
            <Card className={classes.root}>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              />
              <Typography className={classes.pos} color="textSecondary">
                Risk: {this.state.prognosis.RiskFactor}
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                Percentile: {this.state.prognosis.Percentile}
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                Standing: {this.state.prognosis.Standing}
              </Typography>
            </Card>
          ) : (
            <div></div>
          )}
          {Object.keys(this.state.observations).map((code, index) => {
            var codeData = this.state.observations[code];
            console.log(codeData);
            return (
              <Grid key={index} item xs={12} sm={6} lg={4} xl={3}>
                <Card className={classes.root}>
                  <Typography variant="h5" component="h2">
                    {this.state.observations[code].name}
                  </Typography>
                  <LineChart data={codeData.data} />
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </div>
    );
  }
}

export default withStyles(useStyles)(PatientDetails);

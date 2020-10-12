import React, { Component } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import NavBar from "./NavBar";
import {
  Card,
  Grid,
  Typography,
  Paper,
  Divider,
  Link,
  Tooltip,
} from "@material-ui/core";
import { trackPromise } from "react-promise-tracker";
import { LineChart } from "react-chartkick";
import "chart.js";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    minwidth: 275,
    alignItems: "center",
    maxWidth: 300,
    minHeight: 300,
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
  good: {
    colorTextSecondary: "green",
  },
  "at risk": {
    colorTextSecondary: "yellow",
  },
  "seek medical attention": {
    colorTextSecondary: "red",
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
        <Grid container spacing={2} style={{ padding: 12 }}>
          <Grid item component="span" className={classes.alignBox}>
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
              <Typography className={classes.pos} color="textSecondary">
                Patient ID: {this.state.patient.id}
              </Typography>
            </Card>
          </Grid>
          {this.state.prognosis ? (
            <Grid item component="span" className={classes.alignBox}>
              <Card className={classes.root}>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                />
                <Typography variant="h5" component="h2">
                  Prognosis
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                  <Link
                    href="https://www.uptodate.com/contents/treatment-and-prognosis-of-iga-nephropathy"
                    target="_blank"
                    rel="noopener"
                  >
                    Prognosis Metrics Adapted from UpToDate
                  </Link>
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                  Risk (0-80): {this.state.prognosis.RiskFactor}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                  Odds of ESRD in 10 Years: {this.state.prognosis.Percentile}
                </Typography>
                <Typography
                  color="textSecondary"
                  className={this.state.prognosis.Standing}
                >
                  Standing: {this.state.prognosis.Standing}
                </Typography>
              </Card>
            </Grid>
          ) : (
            <div></div>
          )}
          {this.state.observations ? (
            <Grid item component="span" className={classes.alignBox}>
              <Card className={classes.root}>
                <Typography
                  className={classes.title}
                  color="textSecondary"
                  gutterBottom
                />
                <Typography variant="h5" component="h2">
                  Recent Observations
                </Typography>
                {Object.keys(this.state.observations).map((obs, index) => {
                  var codeData = this.state.observations[obs];
                  return codeData.recent ? (
                    <Tooltip title={codeData.description}>
                      <Typography
                        variant="body2"
                        component="h2"
                        color="textSecondary"
                        key={index}
                      >
                        {codeData.shortName}: {codeData.recent[1]}{" "}
                        {codeData.units}
                      </Typography>
                    </Tooltip>
                  ) : (
                    <Tooltip title={codeData.description}>
                      <Typography
                        variant="body2"
                        component="h2"
                        color="textSecondary"
                        key={index}
                      >
                        {codeData.name}: No Record
                      </Typography>
                    </Tooltip>
                  );
                })}
              </Card>
            </Grid>
          ) : (
            <div></div>
          )}
        </Grid>
        <Divider />
        <Paper elevation={3}>
          <Typography variant="h3" component="h2" align="center">
            Charts
          </Typography>
          <Grid container spacing={2} style={{ padding: 12 }}>
            {Object.keys(this.state.observations).map((code, index) => {
              var codeData = this.state.observations[code];
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  lg={4}
                  xl={3}
                  component="span"
                  className={classes.alignBox}
                  key={index}
                >
                  <Card className={classes.root}>
                    <Typography variant="h5" component="h2">
                      {this.state.observations[code].shortName}
                    </Typography>
                    <LineChart data={codeData.data} />
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default withStyles(useStyles)(PatientDetails);

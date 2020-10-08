import React, { Component } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import NavBar from "./NavBar";
import { Card, Box, Typography } from "@material-ui/core";
import { trackPromise } from "react-promise-tracker";

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
    };
  }
  componentDidMount() {
    trackPromise(
      fetch(`api/patient/${this.state.id}`, {
        accept: "application/json",
      })
        .then((response) => response.json())
        .then((patient) => {
          this.setState({ patient: patient });
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
        <Box component="span" className={classes.alignBox}>
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
        </Box>
      </div>
    );
  }
}

export default withStyles(useStyles)(PatientDetails);

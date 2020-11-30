import React from "react";
import {
  Button,
  TextField,
  Grid,
  Paper,
  AppBar,
  Typography,
  Toolbar,
  Link,
} from "@material-ui/core";
import { connect } from "react-redux";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { userActions } from "./../actions";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  "login-form": {
    "justify-content": "center",
    "min-height": "90vh",
  },
  "button-block": {
    width: 100,
  },
  "login-background": {
    "justify-content": "center",
    "min-height": "30vh",
    padding: "50px",
  },
});

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      patient_id: "",
      dob: new Date(),
      submitted: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const {
      email,
      password,
      firstname,
      lastname,
      dob,
      patient_id,
    } = this.state;
    if (email && password) {
      this.props.register({
        email: email,
        password: password,
        firstname: firstname,
        lastname: lastname,
        dob: dob,
        patient_id: patient_id,
      });
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography className={classes.title} variant="h6" noWrap>
              IGA Buddy
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid
          container
          spacing={0}
          style={{ padding: 30 }}
          justify="center"
          direction="row"
        >
          <Grid item>
            <Grid
              container
              direction="column"
              justify="center"
              spacing={2}
              className="login-form"
            >
              <Paper
                variant="elevation"
                elevation={2}
                className="login-background"
              >
                <Grid item>
                  <Typography component="h1" variant="h5">
                    Create Account
                  </Typography>
                </Grid>
                <Grid item style={{ padding: 10 }}>
                  <form onSubmit={this.handleSubmit}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <TextField
                          type="firstname"
                          placeholder="First Name"
                          fullWidth
                          name="firstname"
                          variant="outlined"
                          value={this.state.firstname}
                          onChange={(event) =>
                            this.setState({
                              [event.target.name]: event.target.value,
                            })
                          }
                          required
                          autoFocus
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          type="lastname"
                          placeholder="Last Name"
                          fullWidth
                          name="lastname"
                          variant="outlined"
                          value={this.state.lastname}
                          onChange={(event) =>
                            this.setState({
                              [event.target.name]: event.target.value,
                            })
                          }
                          autoFocus
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          type="email"
                          placeholder="Email"
                          fullWidth
                          name="email"
                          variant="outlined"
                          value={this.state.username}
                          onChange={(event) =>
                            this.setState({
                              [event.target.name]: event.target.value,
                            })
                          }
                          required
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          type="password"
                          placeholder="Password"
                          fullWidth
                          name="password"
                          variant="outlined"
                          value={this.state.password}
                          onChange={(event) =>
                            this.setState({
                              [event.target.name]: event.target.value,
                            })
                          }
                          required
                        />
                      </Grid>
                      <Grid item>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            name="dob"
                            type="patient_id"
                            label="Date of Birth"
                            value={this.state.dob}
                            onChange={(event) => {
                              this.setState({
                                dob: event,
                              });
                            }}
                            KeyboardButtonProps={{
                              "aria-label": "change date",
                            }}
                          />
                        </MuiPickersUtilsProvider>
                      </Grid>
                      <Grid item>
                        <TextField
                          type="patient_id"
                          placeholder="Patient ID (Optional)"
                          fullWidth
                          name="patient_id"
                          variant="outlined"
                          value={this.state.patient_id}
                          onChange={(event) =>
                            this.setState({
                              [event.target.name]: event.target.value,
                            })
                          }
                        />
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          className="button-block"
                        >
                          Submit
                        </Button>
                      </Grid>
                      <Grid item>
                        <Link href="/login" variant="body2">
                          I have an Account
                        </Link>
                      </Grid>
                    </Grid>
                  </form>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

function mapState(state) {
  const { registering } = state.registration;
  return { registering };
}

const actionCreators = {
  register: userActions.register,
};

const connectedRegisterPage = connect(mapState, actionCreators)(Register);
const connectedWithStyles = withStyles(styles)(connectedRegisterPage);
export { connectedWithStyles as Register };

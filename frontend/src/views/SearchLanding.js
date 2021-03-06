import React, { Component } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputAdornment,
  IconButton,
  TextField,
  Box,
  Card,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { withStyles } from "@material-ui/core/styles";
import "./../App.css";

const styles = (theme) => ({
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
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
    color: theme.palette.common.white,
  },
  pos: {
    marginBottom: theme.spacing(4),
    marginLeft: theme.spacing(4),
  },
});

class SearchLanding extends Component {
  constructor(props) {
    super(props);

    this.state = { patientName: "", patients: [] };

    this.searchPatientNames = this.searchPatientNames.bind(this);
  }

  searchPatientNames(value) {
    this.setState({ loading: true });
    fetch(`../api/patient?name=${value}`, {
      accept: "application/json",
    })
      .then((response) => response.json())
      .then((patients) => {
        this.setState({
          patients: patients,
          loading: false,
          searchResolved: true,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });
  }

  handleSearchInput = (event) => {
    this.setState({ patientName: event.target.value });
  };

  onSearchClick = (e) => {
    this.props.history.push(`/search/${this.state.patientName}`);
    window.location.reload();
  };

  onSearchEnter = (e) => {
    if (e.keyCode === 13) {
      this.props.history.push(`/search/${this.state.patientName}`);
      window.location.reload();
    }
  };

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
        <Box component="span" className={classes.alignBox}>
          <Card className={classes.root}>
            <TextField
              label="Search For Patient"
              className={classes.pos}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton onClick={this.onSearchClick}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={this.handleSearchInput}
              onKeyDown={this.onSearchEnter}
            />
          </Card>
        </Box>
      </div>
    );
  }
}

export default withStyles(styles)(SearchLanding);

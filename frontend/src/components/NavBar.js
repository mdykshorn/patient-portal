import React, { Component } from "react";
import { fade, withStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Tooltip,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import MenuIcon from "@material-ui/icons/Menu";
import { Link, withRouter } from "react-router-dom";

import RecordInput from "./RecordInput";

const styles = (theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  iconButton: {
    marginRight: theme.spacing(0),
    marginLeft: theme.spacing(2),
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
});

class NavBar extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      searchVal: "",
      open: false,
    };
  }

  handleSearchInput = (event) => {
    this.setState({ searchVal: event.target.value });
  };

  onSearchClick = (e) => {
    e.preventDefault();
    this.props.history.push(`/search/${this.state.searchVal}`);
    window.location.reload();
  };

  onSearchEnter = (e) => {
    if (e.keyCode === 13) {
      this.props.history.push(`/search/${this.state.searchVal}`);
      window.location.reload();
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.grow}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <Tooltip title="Previous Patients">
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerOpen}
                edge="start"
                className={
                  (classes.menuButton, this.state.open && classes.hide)
                }
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
            <Typography className={classes.title} variant="h6" noWrap>
              IGA Buddy
            </Typography>
            <Tooltip title="Home">
              <IconButton
                className={classes.iconButton}
                color="inherit"
                aria-label="home"
                component={Link}
                to={`/`}
              >
                <HomeIcon />
              </IconButton>
            </Tooltip>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search for Patient…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
                onChange={this.handleSearchInput}
                onKeyDown={this.onSearchEnter}
              />
            </div>
            <RecordInput match={this.props.match} />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(NavBar));

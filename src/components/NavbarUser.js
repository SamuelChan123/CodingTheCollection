import React from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  makeStyles,
  Toolbar,
  Typography,
  Button
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link
              to="/welcome"
              style={{ textDecoration: "none", color: "white" }}
            >
              CodingTheCollection
            </Link>{" "}
          </Typography>
          {/* <Button color="inherit">Login</Button> */}
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            <Button color="inherit">Home</Button>
          </Link>
          <Link
            to="/signin/"
            style={{ textDecoration: "none", color: "white" }}
          >
            <Button color="inherit">Logout</Button>
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}

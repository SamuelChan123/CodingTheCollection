import React from "react";
import { Link } from "react-router-dom";
import {
  makeStyles,
  AppBar,
  Toolbar,
  Typography,
  Button
} from "@material-ui/core";
import SignOutButton from './SignOut';
import { AuthUserContext } from './Session';

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

const Navbar = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavbarAuth /> : <NavbarNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

function NavbarNonAuth() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ backgroundColor: "#9ACD32" }}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link
              to="/welcome"
              style={{ textDecoration: "none", color: "white" }}
            >
              CodingTheCollection
            </Link>
          </Typography>
          <Link
            to="/signin/"
            style={{ textDecoration: "none", color: "white" }}
          >
            <Button color="inherit">Sign In</Button>
          </Link>
          <Link
            to="/register/"
            style={{ textDecoration: "none", color: "white" }}
          >
            <Button color="inherit">Register</Button>
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  )
}

function NavbarAuth() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ backgroundColor: '#9ACD32' }}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link
              to="/welcome"
              style={{ textDecoration: 'none', color: 'white' }}
            >
              CodingTheCollection
            </Link>{' '}
          </Typography>
          {/* <Button color="inherit">Login</Button> */}
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            <Button color="inherit">Home</Button>
          </Link>
          <Link
            to="/welcome"
            style={{ textDecoration: 'none', color: 'white' }}
          >
            <SignOutButton />
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Navbar;
import React, { Component } from "react";
import { withFirebase } from "./Firebase";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  makeStyles,
  Container
} from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/styles";
import { LockOutlined as LockOutlinedIcon } from "@material-ui/icons";
import Copyright from "./Copyright";


/*
Authors: Edward Zhuang
This is a registration page which allows a user to create a new account with their name, email, and a password.
*/


const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function RegisterPage() {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Register />
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

const INITIAL_STATE = {
  firstname: '',
  lastname: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class RegisterBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { firstname, lastname, email, passwordOne } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        return this.props.firebase
          .user(authUser.user.uid)
          .set({
            firstname,
            lastname,
            email,
          });
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push("/allprojects");
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() { 
    const {
      firstname,
      lastname,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const { classes } = this.props;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      firstname === '' ||
      lastname === '';

    return (
      <form className={classes.form} onSubmit={this.onSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          autoFocus
          name="firstname"
          value={firstname}
          onChange={this.onChange}
          type="text"
          placeholder="First Name"
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="lastname"
          value={lastname}
          onChange={this.onChange}
          type="text"
          placeholder="Last Name"
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm Password"
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          disabled={isInvalid}
          type="submit"
        >
          Sign Up
        </Button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const theme = createMuiTheme();

const styles = {
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
};

const Register = compose(
  withRouter,
  withFirebase
)(withStyles(styles)(RegisterBase));

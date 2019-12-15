import React from "react";
import {
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  makeStyles,
  Container
} from "@material-ui/core";
import ImageUploader from "react-images-upload";
import Copyright from "./Copyright";
import { withAuthorization } from "./Session";
import BackButton from "./BackButton";

/* New Project page
 * Authors: Sam Chan
 * This page allows users to create a new project/exhibition
 */

class NewProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectName: "",
      projectImage: null,
      projectImageURL: null,
      noError: true
    };
    this.projects = this.props.firebase.projects(); // get projects ref
    this.storage = this.props.firebase.storage(); // get storage bucket for images
    this.artworks = this.props.firebase.artworks();
  }

  useStyles() {
    return makeStyles(theme => ({
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
  }

  uuidv4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  onDrop = (pictureFiles, pictureDataURLs) => {
    this.setState({
      projectImage: pictureFiles[pictureFiles.length - 1],
      projectImageURL: pictureDataURLs[pictureDataURLs.length - 1]
    });
  };

  onCreate = e => {
    this.setState({
      noError: this.state.projectName
    });
    e.preventDefault();
    if (this.state.projectName) {
      var data = {
        name: this.state.projectName,
        image: "",
        artworks: []
      };
      var history = this.props.history;
      var fb = this.props.firebase;
      if (this.state.projectImage) {
        let uuid = this.uuidv4();
        data.image = `projects/${uuid}`;
        this.storage
          .child(`projects/${uuid}`)
          .put(this.state.projectImage)
          .then(function(snapshot) {
            fb.setProject(data);
            history.push("/allprojects");
          });
      } else {
        fb.setProject(data);
        history.push("/allprojects");
      }
    } else {
      console.log("The project name must be filled in");
    }
  };

  handleName = event => {
    this.setState({ projectName: event.target.value });
  };

  render() {
    const classes = this.useStyles();
    let noError = this.state.noError;

    return (
      <React.Fragment>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Typography component="h1" variant="h5">
              New Project
            </Typography>
          </div>
          <div className={classes.paper}>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Project Name"
                name="name"
                autoComplete="Project Name"
                onChange={this.handleName}
                autoFocus
              />
              <ImageUploader
                withIcon={true}
                buttonText="Choose Cover Photo"
                onChange={this.onDrop}
                imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                maxFileSize={5242880}
              />
              <div>
                {this.state.projectImage === null ? (
                  <p></p>
                ) : (
                  <img
                    src={this.state.projectImageURL}
                    alt="Cannot be displayed"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%"
                    }}
                  />
                )}
              </div>
              <div>
                {!noError && (
                  <p style={{ color: "red" }}>
                    The project name must be filled in!
                  </p>
                )}
              </div>
              <div style={{ paddingBottom: 10 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={this.onCreate}
                  className={classes.submit}
                >
                  Create New Project
                </Button>
              </div>
              <BackButton history={this.props.history} />
            </form>
          </div>
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      </React.Fragment>
    );
  }
}

export default withAuthorization(NewProject);

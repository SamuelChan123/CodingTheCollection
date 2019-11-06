import React from "react";
import { Link } from "react-router-dom";
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
import Navbar from "./Navbar";
import { withAuthorization } from "./Session";

class EditProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectName: "",
      projectImage: null,
      projectImageURL: null,
      oldProject: null,
      noError: false
    };
    this.projects = this.props.firebase.projects(); // get projects ref
    this.storage = this.props.firebase.storage(); // get storage bucket for images
    this.artworks = this.props.firebase.artworks();
    this.projectId = this.props.match.params.projectId;
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

  componentDidMount() {
    var setState = this.setState.bind(this);
    this.projects
      .child(this.projectId)
      .once("value")
      .then(project => {
        setState({ oldProject: project.val().image });
      });
  }

  onUpdate = e => {
    e.preventDefault();
    var fb = this.props.firebase;
    var id = this.projectId;
    var history = this.props.history;
    this.setState({
      noError: this.state.projectName || this.state.projectImage
    });
    if (this.state.projectName && this.state.projectImage) {
      var data = {
        name: this.state.projectName
      };
      let updatedProjectImage = this.state.projectImage;
      this.projects
        .child(this.projectId)
        .once("value")
        .then(project => {
          var imageUrl = project.val().image;
          this.storage
            .child(`${imageUrl}`)
            .put(updatedProjectImage)
            .then(function(snapshot) {
              console.log(`projects/${imageUrl}`);
              console.log(updatedProjectImage);
              fb.updateProjectWithId(id, data);
              history.push("/allprojects");
            });
        });
    } else if (this.state.projectName) {
      const updated = {
        name: this.state.projectName
      };
      fb.updateProjectWithId(this.projectId, updated);
      history.push("/allprojects");
    } else if (this.state.projectImage) {
      let updatedProjectImage = this.state.projectImage;
      this.projects
        .child(this.projectId)
        .once("value")
        .then(project => {
          var imageUrl = project.val().image;
          this.storage
            .child(`${imageUrl}`)
            .put(updatedProjectImage)
            .then(function(snapshot) {
              history.push("/allprojects");
            });
        });
    } else {
      console.log("Either the image or the project name must be updated!");
    }
  };

  onDelete = e => {
    var history = this.props.history;
    var storage = this.storage;
    this.projects
      .child(this.projectId)
      .once("value")
      .then(project => {
        var imageUrl = project.val().image;
        this.projects
          .child(this.projectId)
          .remove()
          .then(function(snapshot) {
            var storageRef = storage.child(imageUrl);
            storageRef
              .delete()
              .then(function() {
                history.push("/allprojects");
              })
              .catch(function(error) {
                console.log("Image deletion failed!");
              });
          })
          .catch(function(snapshot) {
            console.log("Project Deletion failed!");
          });
      });
    e.preventDefault();
  };

  handleName = event => {
    this.setState({ projectName: event.target.value });
  };

  onDrop = (pictureFiles, pictureDataURLs) => {
    this.setState({
      projectImage: pictureFiles[pictureFiles.length - 1],
      projectImageURL: pictureDataURLs[pictureDataURLs.length - 1]
    });
  };

  render() {
    console.log(this.state);
    const classes = this.useStyles();
    const noError = this.state.noError;

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
              Edit Project
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
                buttonText="Choose Images"
                onChange={this.onDrop}
                imgExtension={[".jpg", ".gif", ".png", ".gif"]}
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
                    Either the image or the project name must be updated!
                  </p>
                )}
              </div>
              <br />
              <div style={{ paddingBottom: 10 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={e => this.onUpdate(e)}
                  className={classes.submit}
                >
                  Update Project
                </Button>
              </div>
              <div style={{ paddingBottom: 10 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={e => this.onDelete(e)}
                  className={classes.submit}
                >
                  Delete Project
                </Button>
              </div>
            </form>
          </div>
          <br />
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      </React.Fragment>
    );
  }
}

export default withAuthorization(EditProject);

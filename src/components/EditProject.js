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
import BackButton from "./BackButton";
import { withAuthorization } from "./Session";

/*
 * Edit Project page
 * Author: Sam Chan
 * This page allows users to edit their project information
 */

class EditProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectName: "",
      projectImage: null,
      projectImageURL: null,
      oldProjectName: "",
      oldProjectImage: null,
      noError: true
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
    var projectId = this.projectId;
    var storage = this.storage;

    // get project info
    this.projects
      .child(projectId)
      .once("value")
      .then(project => {
        setState({
          oldProjectName: project.val().name,
          oldProjectImage: ""
        });
        if (project.val().image) {
          // get image info
          storage
            .child(project.val().image)
            .getDownloadURL()
            .then(url => {
              setState({
                oldProjectImage: url
              });
            });
        }
      });
  }

  // on submit button hit...
  onUpdate = e => {
    e.preventDefault();
    var fb = this.props.firebase;
    var id = this.projectId;
    var history = this.props.history;
    this.setState({
      noError: this.state.projectName || this.state.projectImage
    });
    // update project info in firebase
    if (this.state.projectName && this.state.projectImage) {
      var data = {
        name: this.state.projectName
      };
      let updatedProjectImage = this.state.projectImage;
      this.projects
        .child(this.projectId)
        .once("value")
        .then(project => {
          if (project.val().image) {
            var imageUrl = project.val().image;
            this.storage
              .child(`${imageUrl}`)
              .put(updatedProjectImage)
              .then(function(snapshot) {
                fb.updateProjectWithId(id, data);
                history.push("/allprojects");
              });
          } else {
            let uuid = this.uuidv4();
            data.image = `projects/${uuid}`;
            this.storage
              .child(`projects/${uuid}`)
              .put(this.state.projectImage)
              .then(function(snapshot) {
                fb.setProject(data);
                history.push("/allprojects");
              });
          }
        });
    } else if (this.state.projectName) {
      const updated = {
        name: this.state.projectName
      };
      fb.updateProjectWithId(this.projectId, updated);
      history.push("/allprojects");
    } else if (this.state.projectImage) {
      var data = {};
      let updatedProjectImage = this.state.projectImage;
      this.projects
        .child(this.projectId)
        .once("value")
        .then(project => {
          if (imageUrl) {
            var imageUrl = project.val().image;
            this.storage
              .child(`${imageUrl}`)
              .put(updatedProjectImage)
              .then(function(snapshot) {
                history.push("/allprojects");
              });
          } else {
            let uuid = this.uuidv4();
            data.image = `projects/${uuid}`;
            this.storage
              .child(`projects/${uuid}`)
              .put(this.state.projectImage)
              .then(function(snapshot) {
                fb.updateProjectWithId(id, data);
                history.push("/allprojects");
              });
          }
        });
    } else {
      console.log("Either the image or the project name must be updated!");
    }
  };

  uuidv4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
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
            if (imageUrl) {
              var storageRef = storage.child(imageUrl);
              storageRef
                .delete()
                .then(function() {
                  history.push("/allprojects");
                })
                .catch(function(error) {
                  console.log("Image deletion failed!");
                });
            } else {
              history.push("/allprojects");
            }
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
    const classes = this.useStyles();
    const noError = this.state.noError;
    const oldName = this.state.oldProjectName;

    return (
      <React.Fragment>
        {oldName && (
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
                  defaultValue={oldName}
                  name="name"
                  autoComplete="Project Name"
                  onChange={this.handleName}
                  autoFocus
                />
                {this.state.oldProjectImage != null &&
                  this.state.oldProjectImage !== "" && (
                    <img
                      src={this.state.oldProjectImage}
                      alt="Cannot be displayed"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%"
                      }}
                    />
                  )}
                <ImageUploader
                  withIcon={true}
                  buttonText="Choose Cover Photo"
                  onChange={this.onDrop}
                  imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                  maxFileSize={5242880}
                />
                <div>
                  {this.state.projectImage != null && (
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
                      Either the project image or the project name must be
                      updated!
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
                <BackButton history={this.props.history} />
              </form>
            </div>
            <br />
            <Box mt={8}>
              <Copyright />
            </Box>
          </Container>
        )}
      </React.Fragment>
    );
  }
}

export default withAuthorization(EditProject);

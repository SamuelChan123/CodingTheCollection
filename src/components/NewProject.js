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
import { withAuthorization } from "./Session";

class NewProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = { projectName: "", projectImage: null, projectImageURL: null };
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

  onDrop = (pictureFiles, pictureDataURLs) => {
    this.setState({
      projectImage: pictureFiles[pictureFiles.length - 1],
      projectImageURL: pictureDataURLs[pictureDataURLs.length - 1]
    });
  };

  onCreate = e => {
    if (this.state.projectName && this.state.projectImage) {
      var data = {
        name: this.state.projectName,
        image: `projects/${this.state.projectImage.name}`,
        artworks: []
      };
      var fb = this.props.firebase;
      var history = this.props.history;
      this.storage
        .child(`projects/${this.state.projectImage.name}`)
        .put(this.state.projectImage)
        .then(function(snapshot) {
          fb.setProject(data);
          history.push("/allprojects");
        });
      e.preventDefault();
    } else {
      console.log("Both name and image must be filled in");
    }
  };

  handleName = event => {
    this.setState({ projectName: event.target.value });
  };

  render() {
    console.log(this.state);
    const classes = this.useStyles();

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
              <br />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={this.onCreate}
                className={classes.submit}
              >
                Create New Project
              </Button>
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

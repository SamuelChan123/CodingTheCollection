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

class EditArtwork extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = { pictures: [], pictureURLs: [] };
  //   this.onDrop = this.onDrop.bind(this);

  constructor(props) {
    super(props);
    this.state = {
      artworkName: "",
      artworkImage: null,
      artworkImageURL: null,
      artworkDescription: null,
      oldArtwork: null,
      noError: true
    };
    this.storage = this.props.firebase.storage(); // get storage bucket for images
    this.artworks = this.props.firebase.artworks(); // get artworks ref
    this.artworkId = this.props.match.params.artworkId;
  }

  componentDidMount() {
    var setState = this.setState.bind(this);
    this.artworks
      .child(this.artworkId)
      .once("value")
      .then(artwork => {
        setState({
          oldArtwork: artwork.val().image,
          artworkDescription: artwork.val().description
        });
      });
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

  onUpdate = e => {
    e.preventDefault();

    var fb = this.props.firebase;
    var id = this.artworkId;
    var history = this.props.history;
    this.setState({
      noError: this.state.artworkName || this.state.artworkImage
    });
    if (this.state.artworkName && this.state.artworkImage) {
      var data = {
        name: this.state.artworkName
      };
      let updatedArtworkImage = this.state.artworkImage;
      console.log(updatedArtworkImage);
      console.log(id);
      console.log(data);
      this.artworks
        .child(this.artworkId)
        .once("value")
        .then(artwork => {
          var imageUrl = artwork.val().image;
          this.storage
            .child(`${imageUrl}`)
            .put(updatedArtworkImage)
            .then(function(snapshot) {
              fb.updateArtworkWithId(id, data);
              history.push("/allprojects");
            });
        });
    } else if (this.state.artworkName) {
      const updated = {
        name: this.state.artworkName
      };
      fb.updateArtworkWithId(this.artworkId, updated);
      history.push("/allprojects");
    } else if (this.state.artworkImage) {
      let updatedArtworkImage = this.state.artworkImage;
      this.artworks
        .child(this.artworkId)
        .once("value")
        .then(project => {
          var imageUrl = project.val().image;
          this.storage
            .child(`${imageUrl}`)
            .put(updatedArtworkImage)
            .then(function(snapshot) {
              history.push("/allprojects");
            });
        });
    } else {
      console.log("Either the image or the artwork name must be updated!");
    }
  };

  onDelete = e => {
    var history = this.props.history;
    var storage = this.storage;
    this.artworks
      .child(this.artworkId)
      .once("value")
      .then(artwork => {
        var imageUrl = artwork.val().image;
        this.artworks
          .child(this.artworkId)
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
            console.log("Artwork Deletion failed!");
          });
      });
    e.preventDefault();
  };

  handleName = event => {
    this.setState({ artworkName: event.target.value });
  };

  handleDescription = event => {
    this.setState({ artworkDescription: event.target.value });
  };

  onDrop = (pictureFiles, pictureDataURLs) => {
    this.setState({
      artworkImage: pictureFiles[pictureFiles.length - 1],
      artworkImageURL: pictureDataURLs[pictureDataURLs.length - 1]
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
              Edit Artwork
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
                label="Name"
                name="name"
                onChange={this.handleName}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="desc"
                label="Description"
                onChange={this.handleName}
                name="desc"
              />
              <ImageUploader
                withIcon={true}
                buttonText="Choose Images"
                onChange={this.onDrop}
                imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                maxFileSize={5242880}
              />
              <div>
                {this.state.artworkImage === null ? (
                  <p></p>
                ) : (
                  <img
                    src={this.state.artworkImageURL}
                    alt="Cannot be displayed"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%"
                    }}
                  />
                )}
              </div>
              <br />
              <div>
                {!noError && (
                  <p style={{ color: "red" }}>
                    Either the image or the project name must be updated!
                  </p>
                )}
              </div>
              <div style={{ paddingBottom: 10 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={e => this.onUpdate(e)}
                  className={classes.submit}
                >
                  Update Artwork
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
                  Delete Artwork
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

export default withAuthorization(EditArtwork);

import React from "react";
import {
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  makeStyles,
  GridListTile,
  Container
} from "@material-ui/core";
import ImageUploader from "react-images-upload";

import Copyright from "./Copyright";
import { withAuthorization } from "./Session";
import BackButton from "./BackButton";

class EditArtwork extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldArtwork: null,
      name: "",
      description: "",
      year: "",
      artist: "",
      materials: "",
      dimensions: "",
      objectNumber: "",
      creditLine: "",
      noError: true,
      artworkImage: null,
      artworkUrl: null,
      oldContextuals: [],
      contextImages: [],
      contextUrls: [],
      uploadText: "Update Artwork"
    };
    this.storage = this.props.firebase.storage(); // get storage bucket for images
    this.artworks = this.props.firebase.artworks(); // get artworks ref
    this.contextualMedia = this.props.firebase.contextualMedia(); // get contexual media ref
    this.projects = this.props.firebase.projects(); // get projects ref
    this.projectId = this.props.match.params.projectId; // get project id;
    this.artworkId = this.props.match.params.artworkId;
  }

  getState = () => {
    return this.state;
  };

  componentDidMount() {
    var setState = this.setState.bind(this);
    var getState = this.getState.bind(this);
    var storage = this.storage;
    this.artworks
      .child(this.artworkId)
      .once("value")
      .then(artwork => {
        storage
          .child(artwork.val().image)
          .getDownloadURL()
          .then(url => {
            setState({
              oldArtwork: url,
              name: artwork.val().name,
              description: artwork.val().description || "",
              year: artwork.val().year || "",
              artist: artwork.val().artist || "",
              materials: artwork.val().materials || "",
              dimensions: artwork.val().dimensions || "",
              objectNumber: artwork.val().objectNumber || "",
              creditLine: artwork.val().creditLine || ""
            });

            artwork.child("contextualmedia").forEach(mediaRef => {
              let contextId = mediaRef.val().contextualMediaId;
              console.log(contextId);
              this.contextualMedia
                .child(contextId)
                .once("value")
                .then(media => {
                  let description = media.val().description;
                  let contextualMediaImage = media.val().image;
                  console.log(contextualMediaImage);
                  console.log(description);
                  storage
                    .child(contextualMediaImage)
                    .getDownloadURL()
                    .then(contextualUrl => {
                      var newContextuals = getState().oldContextuals.slice();
                      newContextuals.push({
                        image: contextualUrl,
                        description: description,
                        id: contextId
                      });
                      setState({ oldContextuals: newContextuals });
                    });
                });
            });
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
    var projectId = this.projectId;
    var history = this.props.history;
    var data = {
      name: this.state.name,
      description: this.state.description,
      artist: this.state.artist,
      year: this.state.year,
      materials: this.state.materials,
      dimensions: this.state.dimensions,
      objectNumber: this.state.objectNumber,
      creditLine: this.state.creditLine
    };
    var storage = this.storage;
    var contextImages = this.state.contextImages;
    var uuidv4 = this.uuidv4;
    var artworkId = this.artworkId;

    if (contextImages.length > 0) {
      this.setState({
        uploadText: `Uploading ${this.state.contextImages.length} images...`
      });
      let promises = [];
      contextImages.forEach((data, i) => {
        // for every contextual image...
        let imageUrl = `contextualmedia/${uuidv4()}`;
        promises.push(
          new Promise((resolve, reject) => {
            storage
              .child(imageUrl)
              .put(data.image)
              .then(() => {
                // upload curr image to firebase
                data.image = imageUrl; // replace the actual image with its URL
                fb.addContextualMediaToArtwork(
                  // link contextual media -> artwork
                  artworkId,
                  fb.setContextualMedia(data)
                );
                resolve();
              });
          })
        );
        console.log("waiting for all promises to finish...");
      });
      Promise.all(promises).then(() => {
        history.push(`/project/${projectId}`);
      });
    }

    if (this.state.name && this.state.artworkImage) {
      this.setState({
        uploadText: `Uploading ${this.state.contextImages.length + 1} images...`
      });
      let updatedArtworkImage = this.state.artworkImage;
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
              history.push(`/project/${projectId}`);
            });
        });
    } else if (this.state.name) {
      if (this.state.contextImages.length > 0) {
        this.setState({
          uploadText: `Uploading ${this.state.contextImages.length} images...`
        });
      }
      fb.updateArtworkWithId(this.artworkId, data);
      history.push(`/project/${projectId}`);
    } else if (this.state.artworkImage) {
      this.setState({
        uploadText: `Uploading ${this.state.contextImages.length + 1} images...`
      });
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
              history.push(`/project/${projectId}`);
            });
        });
    } else {
      this.setState({ noError: false });
      console.log(
        "At least one of the artwork image, contexual images, or artwork name must be updated!"
      );
    }
  };

  onDelete = e => {
    var history = this.props.history;
    var fb = this.props.firebase;
    var storage = this.storage;
    let projectId = this.projectId;
    let projects = this.projects;
    let artworkId = this.artworkId;

    this.artworks
      .child(this.artworkId)
      .once("value")
      .then(artwork => {
        var imageUrl = artwork.val().image;
        this.artworks
          .child(artworkId)
          .remove()
          .then(function(snapshot) {
            var storageRef = storage.child(imageUrl);
            storageRef
              .delete()
              .then(function() {
                projects
                  .child(projectId)
                  .once("value")
                  .then(project => {
                    let newProjectData = project.val();
                    for (var art in newProjectData.artworks) {
                      if (newProjectData.artworks[art].artId === artworkId) {
                        newProjectData.artworks[art].artId = null;
                      }
                    }
                    fb.setProjectWithId(projectId, newProjectData);
                    history.push(`/project/${projectId}`);
                  });
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

  uuidv4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  deleteContextual = i => {
    let contexts = this.state.oldContextuals;
    let removingId = contexts[i].id;
    contexts.splice(i, 1);
    this.setState({ oldContextuals: contexts });

    var history = this.props.history;
    var fb = this.props.firebase;
    var storage = this.storage;
    let artworks = this.artworks;
    let artworkId = this.artworkId;

    this.contextualMedia
      .child(removingId)
      .once("value")
      .then(contextual => {
        let imageUrl = contextual.val().image;
        this.contextualMedia
          .child(removingId)
          .remove()
          .then(value => {
            let storageRef = storage.child(imageUrl);
            storageRef.delete().then(() => {
              artworks
                .child(artworkId)
                .once("value")
                .then(artwork => {
                  let artworkData = artwork.val();
                  console.log(
                    "artworkdata before" + JSON.stringify(artworkData)
                  );
                  let conMedias = artworkData.contextualmedia;
                  for (var cm in conMedias) {
                    console.log(cm);
                    if (conMedias[cm].contextualMediaId === removingId) {
                      console.log("hello");
                      conMedias[cm].contextualMediaId = null;
                    }
                  }
                  artworkData.contextualmedia = conMedias;
                  fb.setArtworkWithId(artworkId, artworkData);
                  console.log(
                    "artworkdata after" + JSON.stringify(artworkData)
                  );
                });
            });
          });
      });
  };

  updateContextualDescription = (i, description) => {
    let contexts = this.state.oldContextuals;
    let modifying = contexts[i];
    modifying.description = description;
    contexts[i] = modifying;
    this.setState({ oldContextuals: contexts });
    console.log(this.state.oldContextuals);
  };

  handleName = event => {
    this.setState({ artworkName: event.target.value });
  };

  handleDescription = event => {
    this.setState({ artworkDescription: event.target.value });
  };

  handleForm = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onArtworkImageDrop = (images, urls) => {
    this.setState({
      artworkImage: images[images.length - 1],
      artworkUrl: urls[urls.length - 1]
    });
  };

  onContextImagesDrop = (images, urls) => {
    this.setState({
      contextImages: images.map(img => ({
        desc: "",
        image: img
      })),
      contextUrls: urls
    });
  };

  handleContextForm = e => {
    const {
      target: { name, value }
    } = e;
    const nameArr = name.split(" ");
    const index = parseInt(nameArr[0]);
    const nameVal = nameArr.slice(1).toString();

    console.log(index);
    console.log(nameVal);
    let contextImages = [...this.state.contextImages];
    contextImages[index][nameVal] = value; // the contextual media image we want to update
    this.setState({ contextImages });
  };

  render() {
    const classes = this.useStyles();
    const noError = this.state.noError;
    console.log(this.state.oldArtwork);
    return (
      <React.Fragment>
        <CssBaseline />
        <br />

        <Container maxWidth="xs">
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
          <br />
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
                onChange={this.handleForm}
                autoFocus
                value={this.state.name}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="desc"
                label="Description"
                multiline
                onChange={this.handleForm}
                name="description"
                value={this.state.description}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="artist"
                label="Artist"
                onChange={this.handleForm}
                name="artist"
                value={this.state.artist}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="year"
                label="Year"
                onChange={this.handleForm}
                name="year"
                value={this.state.year}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="materials"
                label="Materials"
                onChange={this.handleForm}
                name="materials"
                value={this.state.materials}
              />

              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="dimensions"
                label="Dimensions"
                name="dimensions"
                value={this.state.dimensions}
                onChange={this.handleForm}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="objectNumber"
                label="Object Number"
                name="objectNumber"
                value={this.state.objectNumber}
                onChange={this.handleForm}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                multiline
                id="creditLine"
                label="Credit Line"
                name="creditLine"
                value={this.state.creditLine}
                onChange={this.handleForm}
              />
            </form>
          </div>
        </Container>
        <br />
        <Container maxWidth="sm">
          <div className={classes.paper}>
            <form>
              {this.state.oldArtwork != null && (
                <img
                  src={this.state.oldArtwork}
                  alt="Cannot be displayed"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%"
                  }}
                />
              )}

              <div>
                {this.state.oldContextuals.length === 0 ? (
                  <p></p>
                ) : (
                  this.state.oldContextuals.map((obj, i) => (
                    <div key={i}>
                      <img
                        src={obj.image}
                        alt={`contextual media ${i}`}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%"
                        }}
                      />
                      <TextField
                        variant="outlined"
                        margin="dense"
                        required
                        label="Description"
                        value={obj.description}
                        name={`${i} desc`}
                        // onChange={this.handleContextForm}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.deleteContextual(i)}
                      >
                        Delete Artwork
                      </Button>
                      <Box p={2}></Box>
                    </div>
                  ))
                )}
              </div>
            </form>
          </div>
        </Container>
        <Container maxWidth="sm">
          <div className={classes.paper}>
            <form>
              <ImageUploader
                label="Artwork Image"
                buttonText="Choose Image"
                onChange={this.onArtworkImageDrop}
                imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                maxFileSize={5242880}
                singleImage={true}
              />
              <div>
                {!this.state.artworkImage ? (
                  <p></p>
                ) : (
                  <img
                    src={this.state.artworkUrl}
                    alt="Cannot be displayed"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%"
                    }}
                  />
                )}
              </div>
              <ImageUploader
                label="Contextual Media Images"
                buttonText="Choose Images"
                onChange={this.onContextImagesDrop}
                imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                maxFileSize={5242880}
              />
              <div>
                {this.state.contextImages.length === 0 ? (
                  <p></p>
                ) : (
                  this.state.contextUrls.map((url, i) => (
                    <div key={i}>
                      <img
                        src={url}
                        alt={`contextual media ${i}`}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%"
                        }}
                      />
                      <TextField
                        variant="outlined"
                        margin="dense"
                        required
                        fullWidth
                        label="Description"
                        name={`${i} desc`}
                        onChange={this.handleContextForm}
                      />
                      <Box p={2}></Box>
                    </div>
                  ))
                )}
              </div>
              <br />
              <div>
                {!noError && (
                  <p style={{ color: "red" }}>
                    Either the artwork image or the artwork name must be
                    updated!
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
                  {this.state.uploadText}
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
              <BackButton history={this.props.history} />
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

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

class NewArtwork extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artworkImage: null,
      artworkUrl: null,
      contextImages: [],
      contextUrls: [],
      noError: true,
      uploadText: "Submit"
    };
    this.onArtworkImageDrop = this.onArtworkImageDrop.bind(this);
    this.onContextImagesDrop = this.onContextImagesDrop.bind(this);
    this.storage = this.props.firebase.storage();
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

  uuidv4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  onArtworkImageDrop(images, urls) {
    this.setState({
      artworkImage: images[images.length-1],
      artworkUrl: urls[urls.length-1]
    })
  }

  onContextImagesDrop(images, urls) {
    this.setState({
      contextImages: images.map((img) => ({
        desc: '',
        image: img,
      })),
      contextUrls: urls
    });
  }

  onCreate = e => {
    const noError = this.state.artworkImage && this.state.name
    this.setState({
      noError: noError
    });
    if (noError) {
      this.setState({
        uploadText: `Uploading ${this.state.contextImages.length+1} images...`
      })
      var mainImage = this.state.artworkImage;
      var imageUrl = `artworks/${this.uuidv4()}`;
      var data = {
        name: this.state.name,
        contextualmedia: [],
        description: this.state.description || '',
        artist: this.state.artist || '',
        year: this.state.year || '',
        materials: this.state.materials || '',
        image: imageUrl
      };
      var fb = this.props.firebase;
      var history = this.props.history;
      var projectId = this.projectId;
      var storage = this.storage;
      var contextImages = this.state.contextImages;
      var uuidv4 = this.uuidv4;

      // store in firebase
      storage
        .child(imageUrl)
        .put(mainImage) // upload artwork main image
        .then(function(snapshot) {
          let artworkId = fb.setArtwork(data)
          fb.addArtworkToProject(projectId, artworkId); // link artwork -> project
          let promises = []
          contextImages.forEach((data, i) => { // for every contextual image...
            let imageUrl = `contextualmedia/${uuidv4()}`;
            promises.push(new Promise((resolve, reject) => {
              storage.child(imageUrl).put(data.image).then(() => { // upload curr image to firebase
                data.image = imageUrl // replace the actual image with its URL
                fb.addContextualMediaToArtwork( // link contextual media -> artwork
                  artworkId,
                  fb.setContextualMedia(data)
                )
                resolve()
              })            
            }))

          console.log('waiting for all promises to finish...')
          })
          Promise.all(promises).then(() => {
            history.push(`/project/${projectId}`);
          });
        });
    } else {
      console.log(
        "Both the Artwork Title and the Artwork Image must be uploaded!"
      );
    }
    e.preventDefault();
  };

  handleForm = e => {
    const {
      target: { name, value }
    } = e;
    this.setState({ [name]: value });
  };

  handleContextForm = e => {
    const {
      target: { name, value }
    } = e;
    const nameArr = name.split(' ')
    const index = parseInt(nameArr[0])
    const nameVal = nameArr.slice(1).toString()

    console.log(index)
    console.log(nameVal)
    let contextImages = [...this.state.contextImages]
    contextImages[index][nameVal] = value // the contextual media image we want to update
    this.setState({contextImages})
  }

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
              Add Artwork
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
                autoFocus
                onChange={this.handleForm}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="desc"
                label="Description"
                name="desc"
                onChange={this.handleForm}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="artist"
                label="Artist"
                name="artist"
                onChange={this.handleForm}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="year"
                label="Year"
                name="year"
                onChange={this.handleForm}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="materials"
                label="Materials/Dimensions"
                name="materials"
                onChange={this.handleForm}
              />
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
                    alt="artwork image"
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
              <div>
                {!noError && (
                  <p style={{ color: "red" }}>
                    Either the artwork image or the artwork title must be filled in!
                  </p>
                )}
              </div>
              <div style={{ paddingBottom: 10 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={e => this.onCreate(e)}
                >
                  {this.state.uploadText}
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

export default withAuthorization(NewArtwork);

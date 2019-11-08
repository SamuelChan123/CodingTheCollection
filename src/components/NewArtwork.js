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
      pictures: [],
      pictureURLs: [],
      description: "",
      noError: true
    };
    this.onDrop = this.onDrop.bind(this);
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

  onDrop(pictureFiles, pictureDataURLs) {
    this.setState({
      pictures: pictureFiles,
      pictureURLs: pictureDataURLs
    });
  }

  onCreate = e => {
    this.setState({
      noError: this.state.pictures.length > 0 && this.state.name
    });
    if (this.state.pictures.length > 0 && this.state.name) {
      var mainImage = this.state.pictures[0];
      let uuid = this.uuidv4();

      var imageUrl = `artwork/${uuid}`;
      var data = {
        name: this.state.name,
        contextualmedia: [],
        description: this.state.description,
        image: imageUrl
      };
      var fb = this.props.firebase;
      var history = this.props.history;
      var projectId = this.projectId;
      this.storage
        .child(imageUrl)
        .put(mainImage)
        .then(function(snapshot) {
          fb.addArtworkToProject(projectId, fb.setArtwork(data));
          history.push(`/project/${projectId}`);
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
              <ImageUploader
                withIcon={true}
                buttonText="Choose Images"
                onChange={this.onDrop}
                imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                maxFileSize={5242880}
              />
              <div>
                {this.state.pictures.length === 0 ? (
                  <p></p>
                ) : (
                  this.state.pictureURLs.map(picture => (
                    <img
                      src={picture}
                      alt="Cannot be displayed"
                      key={picture}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%"
                      }}
                    />
                  ))
                )}
              </div>
              <div>
                {!noError && (
                  <p style={{ color: "red" }}>
                    Either the artwork image or the artwork title must be filled
                    in!
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
                  Upload new artwork
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

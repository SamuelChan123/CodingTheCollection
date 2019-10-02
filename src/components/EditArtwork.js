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

class EditArtwork extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pictures: [], pictureURLs: [] };
    this.onDrop = this.onDrop.bind(this);
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

  onDrop(pictureFiles, pictureDataURLs) {
    this.setState({
      pictures: this.state.pictures.concat(pictureFiles),
      pictureURLs: pictureDataURLs
    });
  }

  render() {
    console.log(this.state);
    const classes = this.useStyles();

    console.log(this.state);

    return (
      <React.Fragment>
        <Navbar />
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
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="desc"
                label="Description"
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
                {this.state.pictures.length === 0 ? (
                  <p></p>
                ) : (
                  <img
                    src={this.state.pictureURLs[0]}
                    alt="Cannot be displayed"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%"
                    }}
                  />
                )}
              </div>
              <br />
              <Link
                to="/project"
                style={{ textDecoration: "none", color: "white" }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Edit Artwork
                </Button>
              </Link>
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

export default EditArtwork;
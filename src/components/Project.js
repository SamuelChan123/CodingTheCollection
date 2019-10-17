import React from "react";

import { Link } from "react-router-dom";

import {
  IconButton,
  GridListTileBar,
  GridListTile,
  GridList,
  Button,
  makeStyles
} from "@material-ui/core";
import { Edit as EditIcon, Add as AddIcon } from "@material-ui/icons/";
import Copyright from "./Copyright";

import tileData from "../sample/ArtOfAmericas.js";
import Navbar from "./NavbarUser";
import { withAuthorization, withAuthentication } from "./Session";

const classes = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: 1000,
    height: 500
  },
  button: {
    margin: theme.spacing(0.5)
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)"
  }
}));

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tileData: [], exhibit: "" };
    this.projects = this.props.firebase.projects(); // get projects ref
    this.storage = this.props.firebase.storage(); // get storage bucket for images
    this.artworks = this.props.firebase.artworks();
    this.projectId = this.props.location.state.projectId;
  }

  componentDidMount() {
    var setState = this.setState.bind(this);
    var state = this.state;
    var storage = this.storage;
    var getArtworks = this.artworks;

    this.projects
      .child(this.projectId)
      .once("value")
      .then(project => {
        for (var artworkId in project.val().artworks) {
          var id = project.val().artworks[artworkId];
          console.log(id);
          getArtworks
            .child(id)
            .once("value")
            .then(art => {
              storage
                .child(art.val().image)
                .getDownloadURL()
                .then(function(url) {
                  var artworkTiles = {
                    id: id,
                    image: url,
                    name: art.val().name
                  };
                  setState({
                    tileData: [...state.tileData, artworkTiles]
                  });
                });
            });
        }
        setState({
          exhibit: project.val().name
        });
      })
      .catch(error => ({
        errorCode: error.code,
        errorMessage: error.message
      }));
  }

  render() {
    return (
      <React.Fragment>
        <br />
        <div className={classes.root}>
          <GridList cellHeight={180} cols={4} className={classes.gridList}>
            <GridListTile key="Subheader" cols={4} style={{ height: "auto" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 5
                }}
              >
                <h1
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  {this.state.exhibit}
                </h1>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 10
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  <Link
                    to="/project/presentation"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Present Project
                  </Link>
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  <Link
                    to="/project/edit"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Edit Project
                  </Link>
                </Button>
              </div>
            </GridListTile>
            {this.state.tileData.map(tile => (
              <GridListTile key={tile.image}>
                <img src={tile.image} alt={tile.name} />
                <GridListTileBar
                  title={tile.name}
                  actionIcon={
                    <IconButton
                      aria-label={`info about ${tile.name}`}
                      className={classes.icon}
                    >
                      <Link
                        to="/project/some_id_here/artwork/some_id_here/edit"
                        style={{
                          textDecoration: "none",
                          color: "rgba(255, 255, 255, 0.54)"
                        }}
                      >
                        <EditIcon />
                      </Link>
                    </IconButton>
                  }
                />
              </GridListTile>
            ))}

            <GridListTile>
              {/*<img src={add} />*/}
              <Link
                to="/project/some_id_here/artwork/new"
                style={{
                  textDecoration: "none",
                  color: "rgba(255, 255, 255, 0.54)"
                }}
              >
                <GridListTileBar
                  title="Add New Artwork"
                  actionIcon={
                    <IconButton className={classes.icon}>
                      <AddIcon />
                    </IconButton>
                  }
                />
              </Link>
            </GridListTile>
          </GridList>
        </div>
        <div>
          <Copyright />
        </div>
      </React.Fragment>
    );
  }
}

export default withAuthorization(Project);

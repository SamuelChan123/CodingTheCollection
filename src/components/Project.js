import React from "react";

import { Link } from "react-router-dom";

import {
  IconButton,
  GridListTileBar,
  GridListTile,
  GridList,
  Button
} from "@material-ui/core";
import { Edit as EditIcon, Add as AddIcon } from "@material-ui/icons/";
import Copyright from "./Copyright";
import BackButton from "./BackButton";
import { withAuthorization } from "./Session";
import { createMuiTheme } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#84BD00"
    },
    secondary: {
      main: "#a9a9a9"
    }
  }
});

const styles = {
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: 1000,
    height: "100%"
  },
  button: {
    margin: theme.spacing(0.5)
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)"
  }
};

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tileData: [],
      exhibit: "",
      owner: ""
    };
    this.projects = this.props.firebase.projects(); // get projects ref
    this.storage = this.props.firebase.storage(); // get storage bucket for images
    this.artworks = this.props.firebase.artworks();
    this.projectId = this.props.match.params.projectId;
  }

  getState() {
    return this.state;
  }

  componentDidMount() {
    var setState = this.setState.bind(this);
    var getState = this.getState.bind(this);
    var storage = this.storage;
    var getArtworks = this.artworks;

    this.projects
      .child(this.projectId)
      .once("value")
      .then(project => {
        for (var artwork in project.val().artworks) {
          var id = project.val().artworks[artwork].artId;
          getArtworks
            .child(id)
            .once("value")
            .then(art => {
              storage
                .child(art.val().image)
                .getDownloadURL()
                .then(function(url) {
                  var artworkTiles = {
                    id: art.val().id,
                    image: url,
                    name: art.val().name
                  };
                  // console.log(artworkTiles);
                  setState({
                    tileData: [...getState().tileData, artworkTiles].sort(
                      function(a, b) {
                        var keyA = a.name;
                        var keyB = b.name;
                        if (keyA < keyB) return -1;
                        if (keyA > keyB) return 1;
                        return 0;
                      }
                    )
                  });
                  // console.log(getState().tileData);
                });
            });
        }
        setState({
          exhibit: project.val().name,
          owner: project.val().owner
        });
      })
      .catch(error => ({
        errorCode: error.code,
        errorMessage: error.message
      }));
    console.log(this.state.owner);
  }

  handleTileClick = artId => {
    this.props.history.push(`/project/${this.projectId}/editartwork/${artId}`);
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <br />
        <div className={classes.root}>
          <GridList cellHeight={180} cols={4} className={classes.gridList}>
            <GridListTile key="backButton" cols={1} style={{ height: "auto" }}>
              <BackButton
                history={this.props.history}
                backPage="/allprojects"
              />
            </GridListTile>
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
                  disabled={this.state.tileData.length == 0}
                  className={classes.button}
                >
                  <Link
                    to={{
                      pathname: `/project/${this.projectId}/present`,
                      state: {
                        projectId: this.projectId
                      }
                    }}
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
                    to={{
                      pathname: `/editproject/${this.projectId}`
                    }}
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Edit Project Name/Image
                  </Link>
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  <Link
                    to={{
                      pathname: `/shareproject/${this.projectId}`
                    }}
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Share Project
                  </Link>
                </Button>
              </div>
            </GridListTile>
            {this.state.tileData.map(tile => (
              <GridListTile key={tile.image}>
                <img
                  src={tile.image}
                  alt={tile.name}
                  onClick={() => this.handleTileClick(tile.id)}
                />
                <GridListTileBar
                  title={tile.name}
                  actionIcon={
                    <IconButton
                      aria-label={`info about ${tile.name}`}
                      className={classes.icon}
                    >
                      <Link
                        to={`/project/${this.projectId}/editartwork/${tile.id}`}
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
              <Link
                to={`/project/${this.projectId}/newartwork`}
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

export default withAuthorization(withStyles(styles)(Project));

import React from "react";
import { Link } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Button, IconButton, Divider } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { withStyles, withTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import dummyData from "../sample/DummyProject";
import Copyright from "./Copyright";
import { withAuthorization, withAuthentication } from "./Session";
import { withFirebase } from "./Firebase";
import Fab from "@material-ui/core/Fab";
import BackButton from "./BackButtonSmall";

const drawerWidth = 240;
const iconWidth = 45;

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    overflow: "hidden",
    height: "95vh",
    backgroundColor: "white"
  },
  drawerRight: {
    width: 350,
    flexShrink: 0
  },
  drawerPaperRight: {
    width: 350
  },
  gridListVertical: {
    width: "100%"
  },
  gridListHorizontal: {
    flexWrap: "nowrap"
  },
  artSelection: {
    flex: 2,
    padding: 3,
    background: "white",
    overflowY: "auto"
  },
  mainDisplay: {
    width: "100%",
    height: "100%"
  },
  textField: {
    flex: 3,
    height: "100%",
    paddingRight: "10%"
  },
  appBar: {
    backgroundColor: "white",
    height: "100%",
    width: iconWidth
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
    backgroundColor: "#9ACD32"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth,
    justifyContent: "flex-start",
    display: "flex",
    flexDirection: "row"
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0,
    justifyContent: "flex-start",
    display: "flex",
    flexDirection: "row"
  },
  selected: {
    borderStyle: "solid",
    borderColor: "#9ACD32"
  }
});

class Presentation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tileData: [],
      exhibit: "",
      open: true,
      artId: this.props.match.params.artId
        ? this.props.match.params.artId
        : null,
      artName: "",
      description: "",
      currentArtwork: null,
      currentSlide: 0,
      artInfo: new Map(),
      artTileData: new Map(),
      leftTileData: [],
      open: false,
      openRight: false
    };

    this.projects = this.props.firebase.projects(); // get projects ref
    this.storage = this.props.firebase.storage(); // get storage bucket for images
    this.artworks = this.props.firebase.artworks();
    this.contextualMedia = this.props.firebase.contextualMedia();
    this.projectId = this.props.match.params.projectId;
  }

  getState() {
    return this.state;
  }

  componentDidMount() {
    var setState = this.setState.bind(this);
    var getState = this.getState.bind(this);
    var state = this.state;
    var storage = this.storage;
    var getArtworks = this.artworks;
    var getContextualMedia = this.contextualMedia;

    let artMap = new Map();
    let artInfoMap = new Map();
    let promises = [];

    this.projects
      .child(this.projectId)
      .once("value")
      .then(project => {
        for (var artwork in project.val().artworks) {
          promises.push(
            new Promise((resolve, reject) => {
              let contextualArt = [];
              var id = project.val().artworks[artwork].artId;
              // console.log(id);
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
                      contextualArt.push({
                        image: url,
                        description: art.val().description
                      });
                      if (!getState().artId) {
                        setState({ artId: artworkTiles.id });
                      }
                      if (getState().artId == artworkTiles.id) {
                        setState({ artName: artworkTiles.name });
                      }
                      // console.log(art.val())
                      if (getState().currentArtwork == null) {
                        setState({ currentArtwork: art.val() });
                      }

                      artMap.set(art.val().id, art.val());

                      setState({
                        // tileData: artInfoMap.get(art.val().id),
                        leftTileData: [...getState().leftTileData, artworkTiles]
                      });

                      // console.log(art.val());
                      for (var contextualMedia in art.val().contextualmedia) {
                        let contextualMediaId = art.val().contextualmedia[
                          contextualMedia
                        ].contextualMediaId;
                        console.log(contextualMediaId);
                        getContextualMedia
                          .child(contextualMediaId)
                          .once("value")
                          .then(art1 => {
                            storage
                              .child(art1.val().image)
                              .getDownloadURL()
                              .then(function(url) {
                                console.log("art:");
                                console.log(art1.val());
                                contextualArt.push({
                                  image: url,
                                  description: art1.val().desc
                                });
                              });
                          });
                      }
                      console.log("resolving...");
                      artInfoMap.set(art.val().id, contextualArt);
                      resolve();
                    });
                });
            })
          );
        }
        Promise.all(promises).then(() => {
          this.setState(
            {
              artInfo: artMap,
              artTileData: artInfoMap,
              tileData: artInfoMap.get(getState().currentArtwork.id),
              exhibit: project.val().name
            },
            () => {
              /*
            console.log(this.state)
            this.forceUpdate()
            setTimeout(() => {
              console.log('forcing...')
              console.log(this.state.tileData)
              this.forceUpdate()
            }, 1000)
            */
              this.selectArt(this.state.artId);
            }
          );
        });
      })
      .catch(error => ({
        errorCode: error.code,
        errorMessage: error.message
      }));
  }

  selectArt(tileId) {
    /* this.setState({artId: newArtId}); */
    console.log("Art selected: ", tileId);
    console.log(this.state.artTileData.get(tileId));
    // https://stackoverflow.com/questions/55276560/react-array-in-state-updating-late
    this.setState(
      oldState => {
        let currentArtwork = oldState.artInfo.get(tileId);
        console.log(currentArtwork);
        return {
          artId: tileId,
          artName: currentArtwork.name,
          currentArtwork: currentArtwork,
          tileData: oldState.artTileData.get(tileId),
          description: currentArtwork.description
        };
      },
      () => {
        console.log(this.state.tileData);
        this.forceUpdate();
      }
    );
  }

  render() {
    const { classes } = this.props;
    const { theme } = this.props;

    // console.log(this.state);
    // console.log(this.state.artInfo);
    // console.log(this.state.artTileData);
    // console.log(this.state.tileData);

    const handleDrawerOpen = () => {
      this.setState({ open: true });
    };

    const handleDrawerClose = () => {
      this.setState({ open: false });
    };

    const handleDrawerOpenRight = () => {
      this.setState({ openRight: true });
    };

    const handleDrawerCloseRight = () => {
      this.setState({ openRight: false });
    };

    const onClickThumb = item => {
      this.setState({ description: this.state.tileData[item].description });
    };

    return (
      <React.Fragment>
        <div className={classes.root}>
          {/* Expand Artwork Selection Button */}

          <Fab
            color="primary"
            aria-label="add"
            style={{
              position: "absolute",
              zIndex: "1000",
              top: "80px",
              left: "20px"
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
            >
              <ChevronRightIcon />
            </IconButton>
          </Fab>

          <Fab
            color="primary"
            aria-label="add"
            style={{
              position: "absolute",
              zIndex: "1000",
              top: "80px",
              right: "20px"
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpenRight}
            >
              <ChevronLeftIcon />
            </IconButton>
          </Fab>

          <BackButton
            history={this.props.history}
            backPage={`/project/${this.projectId}`}
            style={{
              position: "absolute",
              zIndex: "0",
              bottom: "20px",
              right: "20px"
            }}
          />

          {/* Artwork Selection Drawer */}

          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={this.state.open}
            classes={{
              paper: classes.drawerPaper
            }}
          >
            <div className={classes.drawerHeader}>
              <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>

            <Divider />

            <GridList
              cellHeight={160}
              className={classes.gridListVertical}
              cols={1}
            >
              {this.state.leftTileData.map(tile => (
                <GridListTile
                  key={tile.id}
                  cols={tile.cols || 1}
                  onClick={e => {
                    this.selectArt(tile.id);
                    this.setState({ currentSlide: 0 });
                  }}
                  className={clsx(
                    this.state.artId == tile.id && classes.selected
                  )}
                >
                  <img src={tile.image} alt={tile.name} />
                </GridListTile>
              ))}
            </GridList>
          </Drawer>

          <main
            style={{
              width: "100%",
              height: "100%"
            }}
          >
            {this.state.tileData.length > 0 &&
              this.state.currentSlide < this.state.tileData.length && (
                <div className={classes.mainDisplay}>
                  <img
                    style={{
                      height: "100%",
                      width: "100%",
                      margin: "0 auto",
                      display: "block",
                      objectFit: "contain"
                    }}
                    src={this.state.tileData[this.state.currentSlide].image}
                  />
                </div>
              )}
          </main>
          <Drawer
            className={classes.drawerRight}
            variant="persistent"
            anchor="right"
            open={this.state.openRight}
            classes={{
              paper: classes.drawerPaperRight
            }}
          >
            <div
              className={classes.drawerHeader}
              style={{ justifyContent: "flex-start" }}
            >
              <IconButton onClick={handleDrawerCloseRight}>
                <ChevronRightIcon />
              </IconButton>
            </div>
            <GridList className={classes.gridListHorizontal} cols={2.5}>
              {this.state.tileData.map((tile, index) => (
                <GridListTile
                  key={tile.image}
                  onClick={() => {
                    this.setState({
                      currentSlide: index,
                      description: tile.description
                    });
                  }}
                >
                  <img src={tile.image} />
                </GridListTile>
              ))}
            </GridList>
            <div className={classes.textField}>
              {this.state.currentArtwork && (
                <div>
                  <h2>
                    {this.state.currentArtwork.artist}
                    <br />
                    {this.state.currentArtwork.name},{" "}
                    {this.state.currentArtwork.year}
                    <br />
                    {this.state.currentArtwork.materials}
                    <br />
                    {this.state.currentArtwork.dimensions}
                    <br />
                    {this.state.currentArtwork.creditLine}
                    <br />
                    {this.state.currentArtwork.objectNumber}
                  </h2>
                  <p>{this.state.description}</p>
                </div>
              )}
            </div>
          </Drawer>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(withAuthorization(Presentation));

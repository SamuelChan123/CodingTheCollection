import React from "react";
import { Link } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import {
  Button,
  IconButton,
  Divider
} from "@material-ui/core";
import Drawer from '@material-ui/core/Drawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { withStyles, withTheme } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import dummyData from "../sample/DummyProject";
import Copyright from "./Copyright";
import { withAuthorization, withAuthentication } from "./Session";
import { withFirebase } from "./Firebase";

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
  gridList: {
    width: "100%"
  },
  artSelection: {
    flex: 2,
    padding: 3,
    background: "white",
    overflowY: "auto"
  },
  mainDisplay: {
    flex: 8,
    padding: 3,
    background: "white",
    float: "right",
    height: "100%",
    justifyContent: "center"
  },
  textField: {
    flex: 3,
    height: "100%",
    paddingRight: "10%"
  },
  carouselTile: {
    height: "75vh",
    background: "white",
    userSelect: "none"
  },
  carouselImage: {
    maxHeight: "100%",
    maxWidth: "100%",
    objectFit: "contain",
    background: "white"
  },
  appBar: {
    backgroundColor: 'white',
    height: '100%',
    width: iconWidth
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
    backgroundColor: "#9ACD32"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
    justifyContent: "flex-start",
    display: 'flex',
    flexDirection: 'row'
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
    justifyContent: "flex-start",
    display: 'flex',
    flexDirection: 'row'
  },
  selected: {
    borderStyle: 'solid',
    borderColor: "#9ACD32"
  }
});

class Presentation extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tileData: [], 
                   exhibit: "",
                   open: true, 
                   artId: (this.props.match.params.artId ? this.props.match.params.artId : null), 
                   artName: "",
                   currentArtwork: null,
                   currentSlide: 0,
                   artInfo: new Map(),
                   artTileData: new Map(),
                   leftTileData: [],
                   description: "",
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

    this.projects
      .child(this.projectId)
      .once("value")
      .then(project => {
        for (var artwork in project.val().artworks) {
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
                .then(function (url) {
                  var artworkTiles = {
                    id: art.val().id,
                    image: url,
                    name: art.val().name
                  };
                  contextualArt.push({
                    image: url,
                    description: art.val().description
                  });
                  if(!getState().artId) {
                    setState({artId: artworkTiles.id});
                  }
                  if(getState().artId == artworkTiles.id) {
                    setState({artName: artworkTiles.name});
                  }
                  // console.log(art.val())
                  if (getState().currentArtwork == null) {
                    setState({currentArtwork: art.val()})
                  }

                  artMap.set(art.val().id, art.val());
                  

                  setState({
                    // tileData: artInfoMap.get(art.val().id),
                    leftTileData: [...getState().leftTileData, artworkTiles]
                  });

                  // console.log(art.val());
                  for (var contextualMedia in art.val().contextualmedia) {
                    let contextualMediaId = art.val().contextualmedia[contextualMedia].contextualMediaId;
                    console.log(contextualMediaId);
                    getContextualMedia
                      .child(contextualMediaId)
                      .once("value")
                      .then(art1 => {
                        storage
                        .child(art1.val().image)
                        .getDownloadURL()
                        .then(function (url) {
                          contextualArt.push({
                            image: url,
                            description: art1.val().description,
                          });
                        })
                      })
                  }
                  artInfoMap.set(art.val().id, contextualArt);

                });
            });
        }
        setState({artInfo: artMap});
        setState({artTileData: artInfoMap});
        setState({tileData: artInfoMap.get(getState().currentArtwork.id)})

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


    const selectArt = (tile) => {
      /* this.setState({artId: newArtId}); */
      console.log('Art selected: ', tile.id);
      this.setState({artId: tile.id, artName: tile.name});
      this.setState({
        currentArtwork: this.state.artInfo.get(tile.id),
        tileData: this.state.artTileData.get(tile.id),
      });
      this.setState({description: this.state.currentArtwork.description});
      // this.forceUpdate();
      // console.log(this.state.description);
      // console.log(this.state.currentArtwork.description);
  
    }

    const onClickThumb = item => {
        // console.log(item);
        // let newDescription = this.state.artTileData.get(this.state.currentArtwork.id)[item].description;
        // this.setState({description: newDescription});
    };

    return (
      <React.Fragment>
        <div className={classes.root}>

          {/* Expand Artwork Selection Button */}

          <div
            position="fixed"
            className={clsx(classes.appBar, { [classes.hide]: this.state.open })}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, this.state.open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
          </div>

          {/* Artwork Selection Drawer */}

          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={this.state.open}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}>
              <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>

            <Divider />
            
            <GridList cellHeight={160} className={classes.gridList} cols={1}>
              {this.state.leftTileData.map(tile => (
                <GridListTile key={tile.id} cols={tile.cols || 1 }
                  onClick = {function(e) {
                    selectArt(tile);
                  }} 
                className = {clsx(this.state.artId == tile.id && classes.selected)}>
                  <img src={tile.image} alt={tile.name} 
                  />
                </GridListTile>
              ))}
            </GridList>
          </Drawer>

          <main
            className={clsx(classes.content, { [classes.contentShift]: this.state.open, })}
          >
            <div className={classes.mainDisplay} >
              <Carousel showStatus={false} showIndicators={false} emulateTouch onClickThumb={onClickThumb} >
                {this.state.tileData.map(tile => (
                  <div className={classes.carouselTile} key={tile.image}>
                    <img src={tile.image} className={classes.carouselImage} />
                  </div>
                ))}
              </Carousel>
            </div>

            <div className={classes.textField}>

              {this.state.currentArtwork && 
                <div>
                  <h2>
                    {this.state.currentArtwork.artist}
                    <br/>
                    {this.state.currentArtwork.name}, {this.state.currentArtwork.year}
                    <br/>
                    {this.state.currentArtwork.materials}
                  </h2>
                  <p>
                    {this.state.description}
                  </p>
                </div>
              }

            </div>

          </main>
        </div >
      </React.Fragment >
    );
  }
}

export default withStyles(styles)(withAuthorization(Presentation));
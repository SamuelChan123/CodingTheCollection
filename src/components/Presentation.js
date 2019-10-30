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
  }
});

class Presentation extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tileData: [], exhibit: "", open: true };
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
    var state = this.state;
    var storage = this.storage;
    var getArtworks = this.artworks;

    this.projects
      .child(this.projectId)
      .once("value")
      .then(project => {
        for (var artwork in project.val().artworks) {
          var id = project.val().artworks[artwork].artId;
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
                    id: art.val().id,
                    image: url,
                    name: art.val().name
                  };
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
  const { classes } = this.props;
  const { theme } = this.props;

  const handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  const handleDrawerClose = () => {
    this.setState({ open: false });
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
            {console.log(this.state.tileData)}
            {this.state.tileData.map(tile => (
              <GridListTile key={tile.id} cols={tile.cols || 1}>
                <img src={tile.image} alt={tile.name} />
              </GridListTile>
            ))}
          </GridList>
        </Drawer>


        <main
          className={clsx(classes.content, { [classes.contentShift]: this.state.open, })}
        >
          <div className={classes.mainDisplay} >
            <Carousel showStatus={false} showIndicators={false} emulateTouch>
              {this.state.tileData.map(tile => (
                <div className={classes.carouselTile}>
                  <img src={tile.image} className={classes.carouselImage} />
                </div>
              ))}
            </Carousel>
          </div>

          <div className={classes.textField}>
            <h1>Chancay</h1>
            <h1>Double Vessel</h1>
            <Button variant="contained" color="primary">
              <Link
                to="/model"
                style={{
                  textDecoration: "none",
                  color: "white"
                }}
              >
                3D Model
                </Link>
            </Button>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin felis
              felis, volutpat vitae sodales sit amet, posuere sed dolor. Curabitur
              sagittis auctor ultricies. Vestibulum eget condimentum est, id
              dapibus justo. Aliquam pellentesque hendrerit felis et viverra.
              Curabitur non neque id nunc maximus euismod ac et urna. Aliquam
              ullamcorper egestas nisi, vitae pharetra enim lacinia ut. Fusce ac
              dui in nunc sollicitudin porttitor ut vitae ex. Integer ligula nisi,
              ultrices a aliquet a, accumsan nec leo. Morbi velit felis, tempor
              nec risus dignissim, pellentesque convallis ligula. Vivamus enim
              enim, rutrum quis cursus cursus, convallis porta sapien.
              </p>
            <p>
              Sed a urna dapibus, consectetur eros quis, sagittis tortor. Etiam
              malesuada commodo est. Mauris efficitur tincidunt ipsum ut ultrices.
              Vestibulum rhoncus, tortor quis sollicitudin imperdiet, lorem ligula
              congue lectus, mollis volutpat tellus arcu at orci. Phasellus odio
              elit, finibus sed lobortis id, viverra tincidunt ex. Vivamus aliquam
              turpis magna, interdum tempor mi aliquam in. Etiam mattis dapibus
              tempus. Phasellus rutrum enim nisi, et ultricies purus vulputate sit
              amet. Sed ac posuere leo, sed consectetur ex. Quisque sed lorem
              ultrices, bibendum urna vitae, ultricies elit. Vivamus et cursus
              leo. Phasellus non magna et erat eleifend venenatis. Sed at mattis
              turpis. Donec porta, purus eget placerat tempor, augue tortor
              aliquet metus, nec dictum sem est vel ex. Integer eu consectetur
              odio. Proin facilisis congue ex id eleifend.
              </p>
            {/*             <Button variant="contained" color="primary">
              <Link
                to="/model"
                style={{
                  textDecoration: "none",
                  color: "white"
                }}
              >
                3D Model
              </Link>
            </Button> */}
          </div>

        </main>
      </div >
    </React.Fragment >
  );
}
}

export default withStyles(styles)(withAuthorization(Presentation));
import React from "react";
import { Link, withRouter } from "react-router-dom";
import {
  IconButton,
  GridListTileBar,
  GridListTile,
  GridList,
  makeStyles
} from "@material-ui/core";
import { Info as InfoIcon, Add as AddIcon } from "@material-ui/icons/";
import { compose } from "recompose";
import Copyright from "./Copyright";
// import tileData from "../sample/AllProjectsSample";
import { AuthUserContext, withAuthorization } from "./Session";
import { withFirebase } from "./Firebase";

class AllProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      tileData: [],
      sharedTileData: [],
      authUser: null,
      loading: false,
    };
    this.projects = this.props.firebase.projects(); // get projects ref
    this.storage = this.props.firebase.storage(); // get storage bucket for images
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.listener = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        if (authUser) {
          this.setState({ authUser: authUser, });
          // console.log(this.props.firebase.projects().orderByChild("owner").equalTo(authUser.uid))
          console.log(authUser.email)
          this.projects = this.props.firebase.projects().orderByChild("owner").equalTo(authUser.uid)
          let emailKey = (authUser.email).replace(".", ",")
          this.sharedProjects = this.props.firebase.projects().orderByChild("collaborators/" + emailKey).equalTo(true)

          let setState = this.setState.bind(this);
          let { storage } = this;
          let promises = []; // list of project promises
          let sharedPromises = [];
          this.projects.on(
            "value",
            snapshot => {
              snapshot.forEach(project => {
                promises.push(
                  new Promise((resolve, reject) => {
                    // create a new promise for the each project
                    storage
                      .child(project.val().image)
                      .getDownloadURL()
                      .then(url => {
                        resolve({
                          // return the data of the project from the promise
                          projectId: project.key,
                          name: project.val().name,
                          image: url
                        });
                      });
                  })
                );
              });
              Promise.all(promises).then(tileData => {
                // runs once all the project promises are resolved
                setState({
                  tileData: tileData.sort((a, b) =>
                    a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1
                  )
                });
              });
            },
            errorObject => {
              return errorObject.code;
            }
          );
          this.sharedProjects.on(
            "value",
            snapshot => {
              snapshot.forEach(project => {
                sharedPromises.push(
                  new Promise((resolve, reject) => {
                    // create a new promise for the each project
                    storage
                      .child(project.val().image)
                      .getDownloadURL()
                      .then(url => {
                        resolve({
                          // return the data of the project from the promise
                          projectId: project.key,
                          name: project.val().name,
                          image: url
                        });
                      });
                  })
                );
              });
              Promise.all(sharedPromises).then(tileData => {
                // runs once all the project promises are resolved
                setState({
                  sharedTileData: tileData.sort((a, b) =>
                    a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1
                  )
                });
              });
            },
            errorObject => {
              return errorObject.code;
            }
          );
    this.setState({ loading: false });
        } else {
          this.setState({ authUser: null });
        }
      }
    );
  }

  componentWillUnmount() {
    this.listener();
  }

  getState() {
    return this.state;
  }

  useStyles() {
    return makeStyles(theme => ({
      root: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper
      },
      gridList: {
        width: 1000,
        height: 450
      },
      icon: {
        color: "rgba(255, 255, 255, 0.54)"
      }
    }));
  }

  handleTileClick = projectId => {
    this.props.history.push(`project/${projectId}`);
  };

  render() {
    const classes = this.useStyles();
    const { loading } = this.state;

    return (
      <>
        <br />
        <div className={classes.root}>
          <GridList cellHeight={180} cols={4} className={classes.gridList}>
            <GridListTile key="Subheader" cols={4} style={{ height: "auto" }}>
              <h1
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                Your Projects
              </h1>
            </GridListTile>
            {}
            {loading && <div>Loading ...</div>}
            {this.state.tileData.map(tile => (
              <GridListTile key={tile.projectId}>
                <img
                  src={tile.image}
                  alt={tile.name}
                  onClick={() => this.handleTileClick(tile.projectId)}
                />
                <Link
                  key={tile.projectId}
                  to={{
                    pathname: `project/${tile.projectId}`
                  }}
                  style={{
                    textDecoration: "none",
                    color: "rgba(255, 255, 255, 0.54)"
                  }}
                >
                  <GridListTileBar
                    title={tile.name}
                    actionIcon={
                      <IconButton
                        aria-label={`info about ${tile.title}`}
                        className={classes.icon}
                      >
                        <InfoIcon />
                      </IconButton>
                    }
                  />
                </Link>
              </GridListTile>
            ))}
            {
              <GridListTile>
                {/*<img src={add} />*/}
                <Link
                  to="/newproject"
                  style={{
                    textDecoration: "none",
                    color: "rgba(255, 255, 255, 0.54)"
                  }}
                >
                  <GridListTileBar
                    title="Add New Project"
                    actionIcon={
                      <IconButton className={classes.icon}>
                        <AddIcon />
                      </IconButton>
                    }
                  />
                </Link>
              </GridListTile>
            }
          </GridList>
        </div>
        <br />

        <div className={classes.root}>
          <GridList cellHeight={180} cols={4} className={classes.gridList}>
            <GridListTile key="Subheader" cols={4} style={{ height: "auto" }}>
              <h1
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                Projects Shared With You
              </h1>
            {this.state.sharedTileData.length == 0 &&
              <h3 
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}>
                There are currently no projects shared with you.
              </h3>
            }
            </GridListTile>
            {}
            {loading && <div>Loading ...</div>}
            {this.state.sharedTileData.map(tile => (
              <GridListTile key={tile.projectId}>
                <img
                  src={tile.image}
                  alt={tile.name}
                  onClick={() => this.handleTileClick(tile.projectId)}
                />
                <Link
                  key={tile.projectId}
                  to={{
                    pathname: `project/${tile.projectId}`
                  }}
                  style={{
                    textDecoration: "none",
                    color: "rgba(255, 255, 255, 0.54)"
                  }}
                >
                  <GridListTileBar
                    title={tile.name}
                    actionIcon={
                      <IconButton
                        aria-label={`info about ${tile.title}`}
                        className={classes.icon}
                      >
                        <InfoIcon />
                      </IconButton>
                    }
                  />
                </Link>
              </GridListTile>
            ))}
          </GridList>
        </div>

        <div>
          <Copyright />
        </div>
      </>
    );
  }
}

export default withAuthorization(AllProjects);

const AllProjectsPage = compose(
  withRouter,
  withFirebase,
  withAuthorization
)(AllProjects);

export { AllProjectsPage };

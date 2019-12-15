import React from "react";
import { Link, withRouter } from "react-router-dom";
import {
  IconButton,
  GridListTileBar,
  GridListTile,
  GridList
} from "@material-ui/core";
import { Info as InfoIcon, Add as AddIcon } from "@material-ui/icons/";
import { compose } from "recompose";
import Copyright from "./Copyright";
// import tileData from "../sample/AllProjectsSample";
import { AuthUserContext, withAuthorization } from "./Session";
import { withFirebase } from "./Firebase";
import { createMuiTheme } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/styles";

/* All Projects page
 * Authors: Sam Chan, Edward Zhuang, Will Ye
 * This page lets users see the projects they created as well as projects shared with them
 */

const theme = createMuiTheme();

const styles = {
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "visible",
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: 1000,
    height: "100%"
  },
  height: "100%",
  icon: {
    color: "rgba(255, 255, 255, 0.54)"
  }
};

class AllProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tileData: [],
      sharedTileData: [],
      authUser: null,
      loading: false
    };
    this.projects = this.props.firebase.projects(); // get projects ref
    this.storage = this.props.firebase.storage(); // get storage bucket for images
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.setState({ authUser: authUser });
        this.projects = this.props.firebase
          .projects()
          .orderByChild("owner")
          .equalTo(authUser.uid);
        let emailKey = authUser.email.replace(/\./g, ",");
        this.sharedProjects = this.props.firebase
          .projects()
          .orderByChild("collaborators/" + emailKey)
          .equalTo(true);

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
                  if (project.val().image) {
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
                  } else {
                    resolve({
                      // return the data of the project from the promise
                      projectId: project.key,
                      name: project.val().name,
                      image: ""
                    });
                  }
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
                  if (project.val().image) {
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
                  } else {
                    resolve({
                      // return the data of the project from the promise
                      projectId: project.key,
                      name: project.val().name,
                      image: ""
                    });
                  }
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
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  getState() {
    return this.state;
  }

  handleTileClick = projectId => {
    this.props.history.push(`project/${projectId}`);
  };

  render() {
    const { classes } = this.props;

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
              <GridListTile
                key={tile.projectId}
                onClick={() => this.handleTileClick(tile.projectId)}
              >
                {tile.image && <img src={tile.image} alt={tile.name} />}
                <Link
                  key={tile.projectId}
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
              {this.state.sharedTileData.length == 0 && (
                <h3
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  There are currently no projects shared with you.
                </h3>
              )}
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
              </GridListTile>
            ))}
          </GridList>
        </div>

        <br />
        <div>
          <Copyright />
        </div>
      </>
    );
  }
}

export default withAuthorization(withStyles(styles)(AllProjects));

const AllProjectsPage = compose(
  withRouter,
  withFirebase,
  withAuthorization
)(withStyles(styles)(AllProjects));

export { AllProjectsPage };

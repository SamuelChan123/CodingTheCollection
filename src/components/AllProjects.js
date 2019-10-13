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
import Copyright from "./Copyright";
import { compose } from "recompose";
//import tileData from "../sample/AllProjectsSample";
import { withAuthorization } from "./Session";
import { withFirebase } from "./Firebase";

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
    height: 450
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)"
  }
}));

class AllProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tileData: [] };
    this.initalize();
  }

  initalize() {
    console.log(this.props.firebase);
    var projects = this.props.firebase.projects(); // get projects ref
    var storage = this.props.firebase.store(); // get storage bucket for images
    var tileDataTemp = [];
    projects.on(
      "value",
      function(snapshot) {
        // for each project
        snapshot.forEach(function(project) {
          var projectId = project.key;
          var projectImg = storage.child(project.val().image);
          var projectName = project.val().name;
          tileDataTemp.push({
            image: projectImg,
            name: projectName
          });
        });
      },
      function(errorObject) {
        return errorObject.code;
      }
    );
    this.setState({ tileData: tileDataTemp });
    console.log(this.state.tileData);
  }

  componentDidMount() {}

  render() {
    return (
      <React.Fragment>
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
                All Projects
              </h1>
            </GridListTile>
            {}
            {this.state.tileData.map(tile => (
              <GridListTile key={tile.image}>
                <img src={tile.img} alt={tile.name} />
                <Link
                  to="/project"
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
                  to="/project/new"
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

        <div>
          <Copyright />
        </div>
      </React.Fragment>
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

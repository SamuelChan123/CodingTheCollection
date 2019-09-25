import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import Button from "@material-ui/core/Button";
import GridListTile from "@material-ui/core/GridListTile";
import { Link } from "react-router-dom";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import AddCircle from "@material-ui/icons/AddCircle";
import tileData from "./tileData";
import add from "../images/add-24px.svg";

const useStyles = makeStyles(theme => ({
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

export default function AllProjects() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Button variant="contained" color="primary">
        Present Project
      </Button>
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
          {tileData.map(tile => (
            <GridListTile key={tile.img}>
              <img src={tile.img} alt={tile.title} />
              <GridListTileBar
                title={tile.title}
                subtitle={<span>by: {tile.author}</span>}
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
          {
            <GridListTile>
              {/*<img src={add} />*/}
              <GridListTileBar
                title="Add New Project"
                actionIcon={
                  <IconButton className={classes.icon}>
                    <Link
                      to="/project"
                      style={{
                        textDecoration: "none",
                        color: "rgba(255, 255, 255, 0.54)"
                      }}
                    >
                      <AddCircle />
                    </Link>
                  </IconButton>
                }
              />
            </GridListTile>
          }
        </GridList>
      </div>
    </React.Fragment>
  );
}

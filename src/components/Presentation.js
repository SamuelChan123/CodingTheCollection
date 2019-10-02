import React from "react";
import { Link } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import {
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  makeStyles,
  Container
} from "@material-ui/core";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import dummyData from "../sample/DummyProject";
import Navbar from "./NavbarUser";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    overflow: "hidden",
    height: "100vh",
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: "100%"
  },
  artSelection: {
    flex: 2,
    padding: 3,
    background: theme.palette.background.paper,
    overflowY: "auto"
  },
  mainDisplay: {
    flex: 8,
    padding: 3,
    background: theme.palette.background.paper,
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
    height: "85vh",
    background: theme.palette.background.paper,
    userSelect: "none"
  },
  carouselImage: {
    maxHeight: "100%",
    maxWidth: "100%",
    objectFit: "contain",
    background: theme.palette.background.paper
  }
}));

export default function Presentation() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Navbar />

      <div className={classes.root}>
        <div className={classes.artSelection}>
          <GridList cellHeight={160} className={classes.gridList} cols={2}>
            {dummyData.map(tile => (
              <GridListTile key={tile.img} cols={tile.cols || 1}>
                <img src={tile.img} alt={tile.title} />
              </GridListTile>
            ))}
          </GridList>
        </div>
        <div className={classes.mainDisplay}>
          <Carousel showStatus={false} showIndicators={false} emulateTouch>
            {dummyData.map(tile => (
              <div className={classes.carouselTile}>
                <img src={tile.img} className={classes.carouselImage} />
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
        </div>
      </div>
    </React.Fragment>
  );
}

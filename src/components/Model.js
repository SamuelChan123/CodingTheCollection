import React from "react";
import { Link } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

import {
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  makeStyles,
  Container
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        height: '100vh',
        backgroundColor: theme.palette.background.paper,
      },
      mainDisplay: {
          flex: 10,
          padding: 3,
          background: 'black',
          float: 'right',
          height: '100%',
          justifyContent: 'center',   
      },
      textField: {
          flex: 3,
          height: '100%',
          paddingRight: '10%',
          paddingLeft: '2%',
      },

  }));

export default function Model() {

    const classes = useStyles();
  
    return (
        <React.Fragment>
            <div className={classes.root}>
            <div className={classes.mainDisplay} >
            </div>

            <div className={classes.textField}>
                <h1>
                    Chancay
                </h1>
                <h1>
                    Double Vessel
                </h1>
                <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin felis felis, volutpat vitae sodales sit amet, posuere sed dolor. Curabitur sagittis auctor ultricies. Vestibulum eget condimentum est, id dapibus justo. Aliquam pellentesque hendrerit felis et viverra. Curabitur non neque id nunc maximus euismod ac et urna. Aliquam ullamcorper egestas nisi, vitae pharetra enim lacinia ut. Fusce ac dui in nunc sollicitudin porttitor ut vitae ex. Integer ligula nisi, ultrices a aliquet a, accumsan nec leo. Morbi velit felis, tempor nec risus dignissim, pellentesque convallis ligula. Vivamus enim enim, rutrum quis cursus cursus, convallis porta sapien.
                </p>
                <p>
                Sed a urna dapibus, consectetur eros quis, sagittis tortor. Etiam malesuada commodo est. Mauris efficitur tincidunt ipsum ut ultrices. Vestibulum rhoncus, tortor quis sollicitudin imperdiet, lorem ligula congue lectus, mollis volutpat tellus arcu at orci. Phasellus odio elit, finibus sed lobortis id, viverra tincidunt ex. Vivamus aliquam turpis magna, interdum tempor mi aliquam in. Etiam mattis dapibus tempus. Phasellus rutrum enim nisi, et ultricies purus vulputate sit amet. Sed ac posuere leo, sed consectetur ex. Quisque sed lorem ultrices, bibendum urna vitae, ultricies elit. Vivamus et cursus leo. Phasellus non magna et erat eleifend venenatis. Sed at mattis turpis. Donec porta, purus eget placerat tempor, augue tortor aliquet metus, nec dictum sem est vel ex. Integer eu consectetur odio. Proin facilisis congue ex id eleifend.
                </p>
                <Button variant="contained" color="primary">
                <Link
                  to="/project/presentation"
                  style={{
                    textDecoration: "none",
                    color: "rgba(255, 255, 255, 0.54)"
                  }}
                >
                  Return
                </Link>
              </Button>
            </div>
            </div>
        </React.Fragment>
  );
}
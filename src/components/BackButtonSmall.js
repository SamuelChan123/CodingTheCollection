import React from "react";
import { Button, Container } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { createMuiTheme } from "@material-ui/core/styles";

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

class BackButton extends React.Component {
  goBack = () => {
    if (this.props.backPage == null) {
      this.props.history.goBack();
    } else {
      this.props.history.push(this.props.backPage);
    }
  };

  render() {
    console.log(this.props);
    return (
      <div style={{ paddingBottom: 10 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={this.goBack}
          style={{ ...this.props.style, color: "white", opacity: 0.9 }}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
      </div>
    );
  }
}

export default BackButton;
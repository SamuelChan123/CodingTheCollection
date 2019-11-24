import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import AppRouter from "./App";
import Firebase, { FirebaseContext } from "./components/Firebase";
import * as serviceWorker from "./serviceWorker";

import { ThemeProvider } from "@material-ui/styles";
import green from "@material-ui/core/colors/green";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

function App() {
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#84BD00"
      },
      secondary: {
        main: "#a9a9a9"
      }
    },
    typography: {
      fontFamily: ["Neue Helvetica", "Helvetica", "Arial", "sans-serif"].join(
        ","
      )
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <FirebaseContext.Provider value={new Firebase()}>
        <AppRouter />
      </FirebaseContext.Provider>
    </ThemeProvider>
  );
}
ReactDOM.render(
  <App />,
  // ,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

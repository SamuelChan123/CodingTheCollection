import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Register from './components/Register';
import Signin from './components/Signin';
import Navbar from './components/Navbar';
import './App.css';

function Index() {
  return <h2>Home</h2>;
}

function AppRouter() {
  return (
    <Router>
      <div>
        <Navbar />
        <Route path="/" exact component={Index} />
        <Route path="/signin/" component={Signin} />
        <Route path="/register/" component={Register} />
      </div>
    </Router>
  );
}

export default AppRouter;

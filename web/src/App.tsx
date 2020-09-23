import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Feed } from "./pages/Feed";
import { Login } from "./pages/Login";
import Profile from "./pages/Profile";
import { Register } from "./pages/Register";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/profile" component={Profile} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/" component={Feed} />
      </Switch>
    </Router>
  );
};

export default App;

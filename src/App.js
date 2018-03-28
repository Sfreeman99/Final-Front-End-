import React, { Component } from "react";
import logo from "./logo.svg";
import AccountSummary from "./AccountSummary";
import Login from "./Login";
import Signup from "./Signup";
import { Route, Redirect, BrowserRouter as Router } from "react-router-dom";
import { bake_cookie, read_cookie, delete_cookie } from "sfcookies";
import "./App.css";
import { getToken } from "./CookieInformation";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route
            exact
            path="/"
            render={() => {
              return getToken() === true ? (
                <Redirect to="/accountSummary" />
              ) : (
                // <Redirect to="/login" />
                <Redirect to="/signup" />
              );
            }}
          />
          <Route path="/login" component={Login} />
          <Route path="/accountSummary" component={AccountSummary} />
          <Route path="/signup" component={Signup} />
        </div>
      </Router>
    );
  }
}

export default App;

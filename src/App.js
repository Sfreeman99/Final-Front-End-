import React, { Component } from "react";
import logo from "./logo.svg";
import AccountSummary from "./AccountSummary";
import { bake_cookie, read_cookie, delete_cookie } from "sfcookies";
import "./App.css";

class App extends Component {
  render() {
    return <AccountSummary />;
  }
}

export default App;

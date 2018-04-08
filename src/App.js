import React, { Component } from "react";
import AccountSummary from "./AccountSummary";
import Login from "./Login";
import Signup from "./Signup";
import { Route, Redirect, BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import { getToken } from "./CookieInformation";
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      getToken() === true ? <Component {...props} /> : <Redirect to="/signup" />
    }
  />
);
// const LoggedIn = ({ component: Component, ...rest }) => (
//   <Route
//     {...rest}
//     render={props =>
//       getToken() === true ? <Component {...props} /> : <Redirect to="/accountSummary" />
//     }
//   />
// );
class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route
            path="/"
            component={() => {
              return <Redirect to="/signup" />;
            }}
          />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/accountSummary" component={AccountSummary} />
          <Route path="/signup" component={Signup} />
        </div>
      </Router>
    );
  }
}

export default App;

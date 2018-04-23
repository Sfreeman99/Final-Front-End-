import React, { Component } from "react";
import { Home } from "./AccountSummary";
import Login from "./Login";
import { Signup, BusinessSignup } from "./Signup";
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
          <Route exact path="/" component={Signup} />
          <Route path="/business/signup" component={BusinessSignup} />
          <Route path="/login" component={Login} />
          {/* <Route path="/business/login" component={BusinessLogin} /> */}
          <PrivateRoute path="/home" component={Home} />
          {/* <PrivateRoute path="/accountSummary" component={AccountSummary} />
          <PrivateRoute path="/requests" component={Requests} /> */}
          <Route path="/signup" component={Signup} />
        </div>
      </Router>
    );
  }
}

export default App;

import React, { Component } from "react";
import { bake_cookie, read_cookie } from "sfcookies";
import { getToken } from "./CookieInformation";
import { Redirect } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      error: false,
      password: "",
      username: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    if (getToken() === true) {
      this.setState({ redirect: true });
    }
  }
  PasswordValidation(password) {
    if (password.length < 10) {
      this.setState({
        error: true,
        passworderrors: "Password not long enough",
        passwordInvalid: "is-invalid"
      });
      return true;
    } else {
      this.setState({
        error: false,
        passworderrors: "",
        passwordInvalid: ""
      });
      return false;
    }
  }
  handleSubmit(event) {
    fetch("http://localhost:8080/login", {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
      .then(response => {
        return response.text();
      })
      .then(key => {
        bake_cookie("CUser", key);
      })
      .catch(error => {
        console.log(error);
      });
    console.log(read_cookie("CUser"));
    this.setState({ redirect: true });
    event.preventDefault();
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/accountSummary" />;
    }
    return (
      <form className="container needs-validation" onSubmit={this.handleSubmit}>
        <div className="form-group row">
          <label htmlFor="Username" className="col-sm-2 col-form-label">
            Username
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="Username"
              placeholder="Username"
              name="username"
              value={this.state.username}
              onChange={event =>
                this.setState({ username: event.target.value })
              }
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
            Password
          </label>
          <div className="col-sm-10">
            <input
              type="password"
              className={"form-control " + this.state.passwordInvalid}
              id="inputPassword3"
              placeholder="Password"
              value={this.state.password}
              name="password"
              onChange={event =>
                this.setState({ password: event.target.value })
              }
            />
            <div className="invalid-feedback">{this.state.passworderrors}</div>
          </div>

          <button type="submit">Submit </button>
        </div>
      </form>
    );
  }
}
export default Login;

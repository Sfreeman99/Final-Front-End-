import React, { Component } from "react";
import { bake_cookie, read_cookie } from "sfcookies";
import { getToken } from "./CookieInformation";
import { Redirect, Link } from "react-router-dom";

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

  Validation = () => {
    return fetch("http://localhost:8080/loginAuthentication", {
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
        return response.json();
      })
      .then(isValid => {
        return isValid;
      });
  };

  login() {
    return fetch("http://localhost:8080/login", {
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
        this.setState({ redirect: true });
      })
      .catch(error => {
        console.log(error);
        this.setState({ error: true });
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.Validation().then(isValid => {
      if (isValid) {
        this.login();
      } else {
        this.setState({ error: true });
      }
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/accountSummary" />;
    }
    return (
      <form
        className="needs-validation login-form-margin-top"
        onSubmit={this.handleSubmit}
      >
        <div className="form-group col-lg-4 offset-lg-4">
          <label htmlFor="Username" className="col-lg-2 col-form-label">
            Username
          </label>
          <div className="col-lg-12">
            <input
              type="text"
              className={
                "form-control input-form " +
                (this.state.error ? "is-invalid" : "")
              }
              id="Username "
              placeholder="Username"
              name="username"
              value={this.state.username}
              onChange={event =>
                this.setState({
                  username: event.target.value,
                  error: false
                })
              }
            />
          </div>
        </div>
        <div className="form-group col-lg-4 offset-lg-4">
          <label htmlFor="inputPassword3" className="col-lg-2 col-form-label">
            Password
          </label>
          <div className="col-lg-12">
            <input
              type="password"
              className={
                "form-control input-form " +
                (this.state.error ? "is-invalid" : "")
              }
              id="inputPassword3"
              placeholder="Password"
              value={this.state.password}
              name="password"
              onChange={event =>
                this.setState({
                  password: event.target.value,
                  error: false
                })
              }
            />
            <div className="invalid-feedback">Username/Password is invalid</div>
          </div>
        </div>
        <div className="col-lg-4 offset-lg-4 signup-submit-button-width">
          <Link className="btn btn-danger btn-lg" to="/signup">
            Back
          </Link>
          <button className="btn btn-primary btn-lg center" type="submit">
            Submit
          </button>
        </div>
      </form>
    );
  }
}

export default Login;

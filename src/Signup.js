import React, { Component } from "react";
import { bake_cookie, read_cookie } from "sfcookies";
import { getToken } from "./CookieInformation";
import { Redirect } from "react-router-dom";
import { isBoolean } from "util";

const UsernameTaken = username => {
  return fetch("http://localhost:8080/usernameexists", {
    method: "post",
    mode: "cors",
    body: username
  })
    .then(response => {
      // returns a response which is a boolean
      return response.json();
    })
    .then(boolean => {
      return boolean;
    })
    .catch(error => {
      console.log(error);
    });
};

const passwordsMatch = (password1, password2) => {
  if (password1 !== password2) {
    return false;
  }
  return true;
};
const passwordMustBeAtLeast10Char = password1 => {
  if (password1.length < 10) {
    return false;
  }
  return true;
};
const showPasswordErrors = errorlist => {
  return errorlist.map(error => <li> {error} </li>);
};
class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      email: "",
      first_name: "",
      last_name: "",
      username: "",
      password1: "",
      password2: "",
      errors: {
        has_error: false,
        email_errors: "",
        email_bool: false,
        first_name_errors: "",
        last_name_errors: "",
        username_errors: "",
        username_bool: false,
        passworderrors: [],
        passworderrorsbool: false
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  Validation = () => {
    var invalidbool = false;
    var newerrors = {
      has_error: false,
      email_errors: "",
      email_bool: false,
      first_name_errors: "",
      first_name_bool: false,
      last_name_errors: "",
      last_name_bool: false,
      username_errors: "",
      username_bool: false,
      passworderrors: [],
      passworderrorsbool: false
    };
    if (this.state.first_name === "") {
      newerrors.has_error = true;
      newerrors.first_name_bool = true;
      newerrors.first_name_errors = "You must provide your First Name";
      invalidbool = true;
    }
    if (this.state.last_name === "") {
      newerrors.has_error = true;
      newerrors.last_name_bool = true;
      newerrors.last_name_errors = "You must provide your Last Name";
      invalidbool = true;
    }
    if (this.state.email.indexOf("@") === -1) {
      newerrors.has_error = true;
      newerrors.email_bool = true;
      newerrors.email_errors = "You must provide your Email";
      invalidbool = true;
    }
    if (this.state.username === "") {
      newerrors.has_error = true;
      newerrors.username_bool = true;
      newerrors.username_errors = "Please provide a username";
      invalidbool = true;
    } else {
      UsernameTaken(this.state.username).then(bool => {
        if (bool) {
          var newerrors = { ...this.state.errors };
          newerrors.has_error = true;
          newerrors.username_bool = true;
          newerrors.username_errors = "Username is already taken";
          invalidbool = true;
          this.setState({ errors: newerrors });
        }
      });
    }

    if (!passwordsMatch(this.state.password1, this.state.password2)) {
      newerrors.has_error = true;
      newerrors.passworderrorsbool = true;
      newerrors.passworderrors.push("Passwords do not match");
      invalidbool = true;
    }
    if (!passwordMustBeAtLeast10Char(this.state.password1)) {
      newerrors.has_error = true;
      newerrors.passworderrorsbool = true;
      newerrors.passworderrors.push("Password must be at least 10 Characters");
      invalidbool = true;
    }
    this.setState({ errors: newerrors });
    return invalidbool;
  };
  handleSubmit(event) {
    event.preventDefault();
    if (this.Validation()) {
      event.preventDefault();
    } else {
      fetch("http://localhost:8080/signup", {
        method: "post",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          Username: this.state.username,
          FirstName: this.state.first_name,
          LastName: this.state.last_name,
          Email: this.state.email,
          Password: this.state.password1
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
      this.setState({ redirect: true });
    }
  }

  // if (this.state.passworderrors.length > 0 || this.state.usernameerrorbool) {
  //     event.preventDefault();

  // }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/accountSummary" />;
    } else {
      return (
        <form className="needs-validation" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label for="FirstName">First Name</label>
            <input
              type="text"
              className={
                "form-control " +
                (this.state.errors.first_name_bool ? "is-invalid" : "")
              }
              id="FirstName"
              placeholder="First Name"
              onChange={event => {
                this.setState({ first_name: event.currentTarget.value });
              }}
            />
            <div className="invalid-feedback">
              {this.state.errors.first_name_errors}
            </div>
          </div>
          <div className="form-group">
            <label for="LastName">Last Name</label>
            <input
              type="text"
              className={
                "form-control " +
                (this.state.errors.last_name_bool ? "is-invalid" : "")
              }
              id="LastName"
              placeholder="Last Name"
              onChange={event => {
                this.setState({ last_name: event.currentTarget.value });
              }}
            />
            <div className="invalid-feedback">
              {this.state.errors.last_name_errors}
            </div>
          </div>
          <div className="form-group">
            <label for="Email">Email address</label>
            <input
              type="email"
              className={
                "form-control " +
                (this.state.errors.email_bool ? "is-invalid" : "")
              }
              id="Email"
              placeholder="Enter email"
              onChange={event => {
                this.setState({ email: event.currentTarget.value });
              }}
            />
            <div className="invalid-feedback">
              {this.state.errors.email_errors}
            </div>

            {/* <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small> */}
          </div>
          <div className="form-group">
            <label for="Username">Username</label>
            <input
              type="text"
              className={
                "form-control " +
                (this.state.errors.username_bool ? "is-invalid" : "")
              }
              id="Username"
              placeholder="Username"
              onChange={event => {
                this.setState({ username: event.currentTarget.value });
              }}
            />
            <div className="invalid-feedback">
              {" "}
              {this.state.errors.username_errors}{" "}
            </div>
          </div>
          <div className="form-group">
            <label for="Password1">Password</label>
            <input
              type="password"
              className={
                "form-control " +
                (this.state.errors.passworderrorsbool ? "is-invalid" : "")
              }
              id="Password1"
              placeholder="Password"
              onChange={event => {
                this.setState({ password1: event.target.value });
              }}
            />
          </div>
          <div className="form-group">
            <label for="Password2">Password Repeat</label>
            <input
              type="password"
              className={
                "form-control " +
                (this.state.errors.passworderrorsbool ? "is-invalid" : "")
              }
              id="Password2"
              placeholder="Repeat Password"
              onChange={event => {
                this.setState({ password2: event.target.value });
              }}
            />
            <div className="invalid-feedback">
              {" "}
              <ul>{showPasswordErrors(this.state.errors.passworderrors)} </ul>
            </div>
          </div>

          <button type="submit"> Submit </button>
        </form>
      );
    }
  }
}
export default Signup;

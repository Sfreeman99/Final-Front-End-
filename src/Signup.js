import React, { Component } from "react";
import { bake_cookie, read_cookie } from "sfcookies";
import { getToken } from "./CookieInformation";
import { Redirect } from "react-router-dom";

const passwordsMatch = (password1, password2) => {
  if (password1 !== password2) {
    return false;
  }
  return true;
};
const isInvalid = bool => {
  if (bool) {
    return "is-invalid";
  } else {
    return "";
  }
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
      email: "",
      first_name: "",
      last_name: "",
      username: "",
      password1: "",
      password2: "",
      passworderrors: []
    };
    this.UsernameAuthentication = this.UsernameAuthentication.bind(this);
    this.PasswordAuthentication = this.PasswordAuthentication.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  UsernameAuthentication = () => {
    // Goes to the backend
    fetch("http://localhost:8080/usernameexists", {
      method: "post",
      mode: "cors",
      body: this.state.username
    })
      .then(response => {
        // returns a response which is a boolean
        return response.json();
      })
      .then(bool => {
        // if it is true then present error else then let it go through
        if (bool) {
          console.log(bool);
          this.setState({
            usernameerrorbool: true,
            usernameerror: "Username Exists"
          });
        }
        if (!bool) {
          console.log(bool);
          this.setState({ usernameerrorbool: false, usernameerror: "" });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  PasswordAuthentication = () => {
    // This method checks password authentication
    const passwordMatches = passwordsMatch(this.password1, this.password2);
    const passwordLength = passwordMustBeAtLeast10Char(this.state.password1);
    if (!passwordMatches) {
      this.setState({
        passworderrors: this.state.passworderrors.concat([
          "Password do not match"
        ])
      });
    } else if (
      passwordMatches &&
      this.state.passworderrors.indexOf("Password do not match") !== undefined
    ) {
      this.state.passworderrors.splice(
        this.state.passworderrors.indexOf("Password do not match"),
        1
      );
    }

    if (!passwordLength) {
      this.setState({
        passworderrors: this.state.passworderrors.concat([
          "Password must be atleast 10 Characters"
        ])
      });
    } else if (
      passwordLength &&
      this.state.passworderrors.indexOf(
        "Password must be atleast 10 Characters"
      ) !== undefined
    ) {
      this.state.passworderrors.splice(
        this.state.passworderrors.indexOf(
          "Password must be atleast 10 Characters"
        ),
        1
      );
    }
  };
  handleSubmit(event) {
    event.preventDefault();
    this.PasswordAuthentication();
    this.UsernameAuthentication();

    // if (this.state.passworderrors.length > 0 || this.state.usernameerrorbool) {
    //     event.preventDefault();

    // }
  }

  render() {
    return (
      <form className="needs-validation" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label for="FirstName">First Name</label>
          <input
            type="text"
            className={"form-control "}
            id="FirstName"
            placeholder="First Name"
            onChange={event => {
              this.setState({ first_name: event.currentTarget.value });
            }}
          />
        </div>
        <div className="form-group">
          <label for="Email">Last Name</label>
          <input
            type="text"
            className="form-control"
            id="LastName"
            placeholder="Last Name"
            onChange={event => {
              this.setState({ last_name: event.currentTarget.value });
            }}
          />
        </div>
        <div className="form-group">
          <label for="Email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="Email"
            placeholder="Enter email"
            onChange={event => {
              this.setState({ email: event.currentTarget.value });
            }}
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label for="Username">Username</label>
          <input
            type="text"
            className={
              "form-control " + isInvalid(this.state.usernameerrorbool)
            }
            id="Username"
            placeholder="Username"
            onChange={event => {
              this.setState({ username: event.currentTarget.value });
            }}
          />
          <div className="invalid-feedback"> {this.state.usernameerror} </div>
        </div>
        <div className="form-group">
          <label for="Password1">Password</label>
          <input
            type="password"
            className="form-control"
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
            className={"form-control" + isInvalid(this.passworderrorsbool)}
            id="Password2"
            placeholder="Repeat Password"
            onChange={event => {
              this.setState({ password2: event.target.value });
            }}
          />
          <div className="invalid-feedback">
            {" "}
            <ul>{showPasswordErrors(this.state.passworderrors)} </ul>
          </div>
        </div>

        <button type="submit"> Submit </button>
      </form>
    );
  }
}
export default Signup;

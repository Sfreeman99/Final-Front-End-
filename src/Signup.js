import React, { Component } from "react";
import { bake_cookie } from "sfcookies";
import { getToken } from "./CookieInformation";
import { Redirect, Link } from "react-router-dom";
import "./Signup.css";

export const Navbar = props => {
  if (!props.isBusiness) {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <a className="navbar-brand" href="">
          Cash It
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav">{props.children}</div>
        </div>
        <span className="navbar-text">{props.username}</span>
      </nav>
    );
  } else {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <a className="navbar-brand" href="">
          Cash It Business
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav">{props.children}</div>
        </div>
        <span className="navbar-text">{props.username}</span>
      </nav>
    );
  }
};
const Input = props => {
  return (
    <div className={"form-group " + (props.hasError ? "has-danger" : "")}>
      <input
        type={props.type}
        className={"form-control " + (props.hasError ? "is-invalid" : null)}
        id={props.id}
        placeholder={props.placeholder}
        onChange={props.onChange}
      />
      <div className="invalid-feedback">{props.errorMessage}</div>
    </div>
  );
};
const Login = () => {
  return (
    <div>
      <p className="lead">
        <Link id="login" to="/login" className="btn btn-sm btn-default">
          Login
        </Link>{" "}
        For existing customers.
      </p>
    </div>
  );
};
const BusinessLogin = () => {
  return (
    <div>
      <p className="lead">
        <Link id="login" to="/businessLogin" className="btn btn-sm btn-default">
          Login
        </Link>{" "}
        For existing business.
      </p>
    </div>
  );
};
const BusinessSignUp = () => {
  return (
    <div>
      <p className="lead">
        <Link
          id="login"
          to="/businessSignup"
          className="btn btn-sm btn-default"
        >
          Click Here
        </Link>{" "}
        For Business Signup or Login.
      </p>
    </div>
  );
};
const SignUpForm = props => {
  return (
    <form className="needs-validation" onSubmit={props.onSubmit}>
      {props.children}
      <div>
        <button id="SignupUser" className="btn btn-primary" type="submit">
          Signup
        </button>
      </div>
    </form>
  );
};
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
  const errors = errorlist.map(error => {
    return <li> {error} </li>;
  });
  return <ul>{errors}</ul>;
};
export class Signup extends Component {
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
  componentDidMount() {
    if (getToken()) {
      this.setState({ redirect: true });
    }
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
          this.setState({ redirect: true });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  // if (this.state.passworderrors.length > 0 || this.state.usernameerrorbool) {
  //     event.preventDefault();

  // }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/home/accountSummary" />;
    } else {
      return (
        <div>
          <Navbar isBusiness={false} />
          <div className="container">
            <div className="row form-padd">
              <div className="offset-lg-3 col-lg-6">
                <div className="card">
                  <div className="card-header">
                    <h3>Signup </h3>
                  </div>
                  <div className="card-body">
                    <SignUpForm onSubmit={this.handleSubmit}>
                      <Input
                        hasError={this.state.errors.first_name_bool}
                        errorMessage={this.state.errors.first_name_errors}
                        type={"text"}
                        id={"FirstName"}
                        placeholder={"First Name"}
                        onChange={event => {
                          this.setState({
                            first_name: event.currentTarget.value
                          });
                        }}
                      />
                      <Input
                        hasError={this.state.errors.last_name_bool}
                        errorMessage={this.state.errors.last_name_errors}
                        type={"text"}
                        id={"LastName"}
                        placeholder={"Last Name"}
                        onChange={event => {
                          this.setState({
                            last_name: event.currentTarget.value
                          });
                        }}
                      />
                      <Input
                        hasError={this.state.errors.email_bool}
                        errorMessage={this.state.errors.email_errors}
                        type={"email"}
                        id={"Email"}
                        placeholder={"Email"}
                        onChange={event => {
                          this.setState({ email: event.currentTarget.value });
                        }}
                      />
                      <Input
                        hasError={this.state.errors.username_bool}
                        errorMessage={this.state.errors.username_errors}
                        type={"text"}
                        id={"Username"}
                        placeholder={"Username"}
                        onChange={event => {
                          this.setState({
                            username: event.currentTarget.value
                          });
                        }}
                      />
                      <Input
                        hasError={this.state.errors.passworderrorsbool}
                        type={"password"}
                        id={"Password1"}
                        placeholder={"Password"}
                        onChange={event => {
                          this.setState({
                            password1: event.currentTarget.value
                          });
                        }}
                      />
                      <Input
                        hasError={this.state.errors.passworderrorsbool}
                        errorMessage={showPasswordErrors(
                          this.state.errors.passworderrors
                        )}
                        type={"password"}
                        id={"Password2"}
                        placeholder={"Repeat Password"}
                        onChange={event => {
                          this.setState({
                            password2: event.currentTarget.value
                          });
                        }}
                      />
                    </SignUpForm>
                    <hr className="my-3" />
                    <Login />
                    {/* <BusinessSignUp /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export class BusinessSignup extends Component {
  constructor() {
    super();
    this.state = {
      redirect: false,
      owner_first_name: "",
      owner_last_name: "",
      business_brand: "",
      email: "",
      password1: "",
      password2: "",
      errors: {
        has_error: false,
        email_errors: "",
        email_bool: false,
        owner_first_name_errors: "",
        owner_first_name_bool: false,
        owner_last_name_errors: "",
        owner_last_name_bool: false,
        business_brand_errors: "",
        business_brand_bool: false,
        passworderrors: [],
        passworderrorsbool: false
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.BusinessValidation = this.BusinessValidation.bind(this);
  }
  componentDidMount() {
    if (getToken()) {
      this.setState({ redirect: true });
    }
  }
  BusinessValidation = () => {
    var invalidbool = false;
    var newerrors = {
      has_error: false,
      email_errors: "",
      email_bool: false,
      owner_first_name_errors: "",
      owner_first_name_bool: false,
      owner_last_name_errors: "",
      owner_last_name_bool: false,
      passworderrors: [],
      passworderrorsbool: false
    };
    if (this.state.owner_first_name === "") {
      newerrors.has_error = true;
      newerrors.owner_first_name_bool = true;
      newerrors.owner_first_name_errors = "You must provide your First Name";
      invalidbool = true;
    }
    if (this.state.owner_last_name === "") {
      newerrors.has_error = true;
      newerrors.owner_last_name_bool = true;
      newerrors.owner_last_name_errors = "You must provide your Last Name";
      invalidbool = true;
    }
    if (this.state.email.indexOf("@") === -1) {
      newerrors.has_error = true;
      newerrors.email_bool = true;
      newerrors.email_errors = "You must provide your Email";
      invalidbool = true;
    }
    // if (this.state.username === "") {
    //   newerrors.has_error = true;
    //   newerrors.username_bool = true;
    //   newerrors.username_errors = "Please provide a username";
    //   invalidbool = true;
    // } else {
    //   UsernameTaken(this.state.username).then(bool => {
    //     if (bool) {
    //       var newerrors = { ...this.state.errors };
    //       newerrors.has_error = true;
    //       newerrors.username_bool = true;
    //       newerrors.username_errors = "Username is already taken";
    //       invalidbool = true;
    //       this.setState({ errors: newerrors });
    //     }
    //   });
    // }

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
    if (!this.BusinessValidation()) {
      fetch("http://localhost:8080/business/signup", {
        method: "post",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          owner_first_name: this.state.owner_first_name,
          owner_last_name: this.state.owner_last_name,
          business_brand: this.state.business_brand,
          password: this.state.password1
        })
      })
        .then(response => {
          return response.text();
        })
        .then(data => {
          bake_cookie("BUser", data);
          this.setState({ redirect: true });
        });
    }
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to="/business/summary" />;
    } else {
      return (
        <div>
          <Navbar isBusiness={true} />
          <div className="container">
            <div className="row form-padd">
              <div className="offset-lg-3 col-lg-6">
                <div className="card">
                  <div className="card-header">
                    <h3>Business Signup </h3>
                  </div>
                  <div className="card-body">
                    <SignUpForm onSubmit={this.handleSubmit}>
                      <Input
                        hasError={this.state.errors.owner_first_name_bool}
                        errorMessage={this.state.errors.owner_first_name_errors}
                        type={"text"}
                        id={"OwnerFirstName"}
                        placeholder={"Owner First Name"}
                        onChange={event => {
                          this.setState({
                            owner_first_name: event.currentTarget.value
                          });
                        }}
                      />
                      <Input
                        hasError={this.state.errors.owner_last_name_bool}
                        errorMessage={this.state.errors.owner_last_name_errors}
                        type={"text"}
                        id={"OwnerLastName"}
                        placeholder={"Owner Last Name"}
                        onChange={event => {
                          this.setState({
                            owner_last_name: event.currentTarget.value
                          });
                        }}
                      />
                      <Input
                        hasError={this.state.errors.email_bool}
                        errorMessage={this.state.errors.email_errors}
                        type={"email"}
                        id={"Email"}
                        placeholder={"Email"}
                        onChange={event => {
                          this.setState({ email: event.currentTarget.value });
                        }}
                      />
                      <Input
                        hasError={this.state.errors.business_brand_bool}
                        errorMessage={this.state.errors.business_brand_errors}
                        type={"text"}
                        id={"BusinessBrand"}
                        placeholder={"Business Name"}
                        onChange={event => {
                          this.setState({
                            business_brand: event.currentTarget.value
                          });
                        }}
                      />
                      <Input
                        hasError={this.state.errors.passworderrorsbool}
                        type={"password"}
                        id={"Password1"}
                        placeholder={"Password"}
                        onChange={event => {
                          this.setState({
                            password1: event.currentTarget.value
                          });
                        }}
                      />
                      <Input
                        hasError={this.state.errors.passworderrorsbool}
                        errorMessage={showPasswordErrors(
                          this.state.errors.passworderrors
                        )}
                        type={"password"}
                        id={"Password2"}
                        placeholder={"Repeat Password"}
                        onChange={event => {
                          this.setState({
                            password2: event.currentTarget.value
                          });
                        }}
                      />
                    </SignUpForm>
                    <hr className="my-3" />
                    <BusinessLogin />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

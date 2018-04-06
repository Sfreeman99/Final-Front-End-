import React, { Component } from "react";
import { bake_cookie, read_cookie, delete_cookie } from "sfcookies";

function Transactions(props) {
  const transactions = props.transactions.map(transaction => (
    <li key={transaction.id.toString()}> Amount: {transaction.amount} </li>
  ));
  return <ul> {transactions} </ul>;
}

class AccountSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      key: "",
      loaded: false
    };
  }
  componentDidMount() {
    fetch("http://localhost:8080/accountSummary", {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(read_cookie("CUser"))
    })
      .then(response => {
        return response.json();
      })
      .then(accountInfo => {
        console.log(accountInfo);
        this.setState({ userInfo: accountInfo, loaded: true });
      });
  }
  Logout = () => {
    fetch("http://localhost:8080/logout", {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: read_cookie("CUser")
    })
      .then(response => {
        delete_cookie("CUser");
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    if (!this.state.loaded) {
      return <div className="alert alert-danger"> key not loaded </div>;
    } else {
      return (
        <div class="jumbotron">
          <h1 class="display-4">Hello, {this.state.userInfo.username}!</h1>
          <p class="lead">
            Your balance is {(this.state.userInfo.balance / 100).toFixed(2)}
          </p>
          <hr class="my-4" />
          <p>
            It uses utility classes for typography and spacing to space content
            out within the larger container.
          </p>
          <p class="lead">
            <a class="btn btn-primary btn-lg" href="#" role="button">
              Learn more
            </a>
          </p>
        </div>
      );
    }
  }
}
export default AccountSummary;

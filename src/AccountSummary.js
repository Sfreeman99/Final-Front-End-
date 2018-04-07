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
      loaded: false,
      tabIsActive: {
        nav_link: "transactions",
        tab: 1
      }
    };
    this.changeActive = this.changeActive.bind(this);
    this.tabIsActive = this.tabIsActive.bind(this);
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
  changeActive = e => {
    e.preventDefault();
    this.setState({ tabIsActive: { nav_link: e.currentTarget.id } });
  };
  tabIsActive = id => {
    if (this.state.tabIsActive.nav_link === id) {
      return "active";
    } else {
      return "";
    }
  };
  render() {
    if (!this.state.loaded) {
      return <div className="alert alert-danger"> key not loaded </div>;
    } else {
      return (
        <div>
          <div className="container">
            <div class="jumbotron">
              <h1 class="display-4">Hello, {this.state.userInfo.username}!</h1>
              <p class="lead">
                Your balance is {(this.state.userInfo.balance / 100).toFixed(2)}
              </p>
              <hr class="my-4" />
            </div>
          </div>
          <div className="container">
            <ul className="nav nav-tabs" role="tablist">
              <li className="nav-item">
                <a
                  id="transactions"
                  className={"nav-link " + this.tabIsActive("transactions")}
                  onClick={e => {
                    this.changeActive(e);
                  }}
                >
                  Transactions
                </a>
              </li>
              <li className="nav-item">
                <a
                  id="deposit"
                  className={"nav-link " + this.tabIsActive("deposit")}
                  onClick={e => {
                    this.changeActive(e);
                  }}
                >
                  Deposit
                </a>
              </li>
              <li className="nav-item">
                <a
                  id="withdraw"
                  className="nav-link"
                  onClick={e => {
                    this.changeActive(e);
                  }}
                >
                  Withdraw
                </a>
              </li>
            </ul>
          </div>
        </div>
      );
    }
  }
}
export default AccountSummary;

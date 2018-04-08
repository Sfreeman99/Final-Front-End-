import React, { Component } from "react";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import { read_cookie, delete_cookie } from "sfcookies";

// function Transactions(props) {
//   const transactions = props.transactions.map(transaction => (
//     <li key={transaction.id.toString()}> Amount: {transaction.amount} </li>
//   ));
//   return <ul> {transactions} </ul>;
// }
const deposit = () => {
  return (
    <div className="tab-padding">
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text">$</span>
        </div>
        <input
          type="text"
          className="form-control"
          aria-label="Amount (to the nearest dollar)"
        />
        <div className="input-group-append">
          <span className="input-group-text">.00</span>
        </div>
      </div>
      <button className="btn btn-primary" type="submit">
        Deposit
      </button>
    </div>
  );
};
const withdraw = () => {
  return (
    <div className="tab-padding">
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text">$</span>
        </div>
        <input
          type="text"
          className="form-control"
          aria-label="Amount (to the nearest dollar)"
        />
        <div className="input-group-append">
          <span className="input-group-text">.00</span>
        </div>
      </div>
      <button className="btn btn-primary" type="submit">
        Withdraw
      </button>
    </div>
  );
};

const Transactions = props => {
  const transaction = props.transactions.map(transaction => {
    return (
      <tr>
        <th scope="row">{transaction.id}</th>
        <td>{transaction.date}</td>
        <td>{transaction.type}</td>
        <td>{(transaction.amount / 100).toFixed(2)}</td>
      </tr>
    );
  });
  return (
    <div className="tab-padding">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Transaction ID</th>
            <th scope="col">Day(Year,Month,Day)</th>
            <th scope="col">Type</th>
            <th scope="col">amount</th>
          </tr>
        </thead>
        <tbody>{transaction}</tbody>
      </table>
    </div>
  );
};
class AccountSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      key: "",
      loaded: false,
      tabIsActive: {
        nav_link: "transactions"
      },
      transactions: []
    };
    this.transactions = this.transactions.bind(this);
    this.Logout = this.Logout.bind(this);
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
        this.transactions(accountInfo.id);
      });
  }
  transactions = id => {
    return fetch(
      "http://localhost:8080/transactions/" + this.state.userInfo.id,
      {
        method: "get",
        mode: "cors",
        headers: {
          "Content-Type": "text/plain"
        }
      }
    )
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        this.setState({ transactions: data });
      });
  };
  Logout = e => {
    e.preventDefault();
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
        window.location.reload(true);
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
        <Router basename={this.state.userInfo.username}>
          <div>
            <div>
              <div className="container">
                <div class="jumbotron">
                  <h1 class="display-4">
                    Hello, {this.state.userInfo.username}!
                  </h1>
                  <p class="lead">
                    Your balance is{" "}
                    {(this.state.userInfo.balance / 100).toFixed(2)}
                  </p>
                  <hr class="my-4" />
                  <button
                    className="btn btn-primary"
                    onClick={e => this.Logout(e)}
                  >
                    Logout
                  </button>
                </div>
              </div>
              <div className="container">
                <ul className="nav nav-tabs" role="tablist">
                  <li className="nav-item">
                    {/* <a
                  id="transactions"
                  className={"nav-link " + this.tabIsActive("transactions")}
                  onClick={e => {
                    this.changeActive(e);
                  }}
                > */}
                    <NavLink
                      exact
                      activeClassName="active"
                      className="nav-link"
                      to="/transactions"
                    >
                      Transactions
                    </NavLink>
                    {/* </a> */}
                  </li>
                  <li className="nav-item">
                    {/* <a
                    id="deposit"
                    className={"nav-link " + this.tabIsActive("deposit")}
                    onClick={e => {
                      this.changeActive(e);
                    }}
                  >
                    Deposit
                  </a> */}
                    <NavLink
                      activeClassName="active"
                      className="nav-link"
                      to="/deposit"
                    >
                      {" "}
                      Deposit{" "}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    {/* <a
                    id="withdrawal"
                    className={"nav-link " + this.tabIsActive("withdrawal")}
                    onClick={e => {
                      this.changeActive(e);
                    }}
                  >
                    Withdraw
                  </a> */}
                    <NavLink
                      activeClassName="active"
                      className="nav-link"
                      to="/withdraw"
                    >
                      {" "}
                      Withdraw{" "}
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
            <Route
              path="/transactions"
              component={() => (
                <Transactions transactions={this.state.transactions} />
              )}
            />
            <Route path="/deposit" component={deposit} />
            <Route path="/withdraw" component={withdraw} />
          </div>
        </Router>
      );
    }
  }
}
export default AccountSummary;

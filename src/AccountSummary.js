import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { read_cookie, delete_cookie } from "sfcookies";
import _ from "lodash";

// function Transactions(props) {
//   const transactions = props.transactions.map(transaction => (
//     <li key={transaction.id.toString()}> Amount: {transaction.amount} </li>
//   ));
//   return <ul> {transactions} </ul>;

const DeleteAccount = props => {
  return (
    <form onSubmit={props.onSubmit}>
      <div
        className="modal fade"
        id="DeleteAccount"
        tabindex="-1"
        role="dialog"
        aria-labelledby="DeleteAccountLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="DeleteAccountLabel">
                Are You Sure?
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              If you click the delete account button all information of your
              account will be permanently removed!
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button type="submit" className="btn btn-danger">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

const Transactions = props => {
  const transaction = props.transactions.map(transaction => {
    return (
      <tr>
        <th scope="row">{transaction.transactionId}</th>
        <td>{transaction.date}</td>
        <td>{transaction.type}</td>
        <td>{(transaction.amount / 100).toFixed(2)}</td>
      </tr>
    );
  });
  return (
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
  );
};
class AccountSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_delete_account: false,
      userInfo: {},
      key: "",
      loaded: false,
      tabIsActive: {
        nav_link: "transactions"
      },
      transactions: [],
      withdraw: 0,
      deposit: 0
    };
    this.handleDeposit = this.handleDeposit.bind(this);
    this.handleWithdraw = this.handleWithdraw.bind(this);
    this.transactions = this.transactions.bind(this);
    this.Logout = this.Logout.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  handleDelete(e) {
    e.preventDefault();
    alert("Delete button was clicked");
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
  handleDeposit(e) {
    e.preventDefault();
    fetch("http://localhost:8080/deposit", {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.userInfo.username,
        amount: this.state.deposit,
        userId: this.state.userInfo.id
      })
    })
      .then(response => response.json())
      .then(transaction => {
        // window.location.reload(true);
        this.setState({
          transactions: _.concat(this.state.transactions, transaction),
          userInfo: _.update(this.state.userInfo, "balance", currentBalance => {
            return currentBalance + transaction.amount;
          })
        });
      })
      .catch(error => {
        console.log(error);
      });
    e.currentTarget.reset();
  }
  handleWithdraw(e) {
    e.preventDefault();
    fetch("http://localhost:8080/withdraw", {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.userInfo.username,
        amount: this.state.withdraw,
        userId: this.state.userInfo.id
      })
    })
      .then(response => {
        return response.json();
      })
      .then(transaction => {
        this.setState({
          transactions: _.concat(this.state.transactions, transaction),
          userInfo: _.update(this.state.userInfo, "balance", currentBalance => {
            return currentBalance - transaction.amount;
          })
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  transactions(id) {
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
  }
  Logout(e) {
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
  }
  render() {
    if (!this.state.loaded) {
      return <div className="alert alert-danger"> key not loaded </div>;
    } else {
      return (
        <div>
          <div className="container">
            <div class="jumbotron">
              <button
                id="logout-button-position"
                className="btn btn-primary"
                onClick={e => this.Logout(e)}
              >
                Logout
              </button>
              {/* <button
                type="button"
                id="logout-button-positon"
                className="btn btn-danger btn-lg"
                data-toggle="modal"
                data-target="#exampleModal"
              >
                Delete Account
              </button> */}
              <button
                id="logout-button-position"
                type="button"
                class="btn btn-danger"
                data-toggle="modal"
                data-target="#DeleteAccount"
              >
                Delete Account
              </button>
              <h1 className="display-4">CashIt</h1>
              <p className="lead">
                Hello {this.state.userInfo.username}! Your balance is{" "}
                {"$" + (this.state.userInfo.balance / 100).toFixed(2)}
              </p>
              <hr className="my-4" />
              <DeleteAccount onSubmit={this.handleDelete} />
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-6">
                <h3>Transactions</h3>
                <Transactions transactions={this.state.transactions} />
              </div>
              <div className="col-6">
                <div className="col-12">
                  <div class="card">
                    <div class="card-header">Deposit</div>
                    <div class="card-body">
                      <div className="card-title">Deposit Amount</div>
                      <form onSubmit={this.handleDeposit}>
                        <p class="card-text">
                          <div className="input-group mb-3">
                            <div className="input-group-prepend">
                              <span className="input-group-text">$</span>
                            </div>
                            <input
                              name="deposit"
                              type="text"
                              className="form-control"
                              aria-label="Amount (to the nearest dollar)"
                              onChange={e =>
                                this.setState({
                                  deposit: e.currentTarget.value * 100
                                })
                              }
                            />
                            <div className="input-group-append">
                              <span className="input-group-text">.00</span>
                            </div>
                          </div>
                        </p>
                        <button type="submit" class="btn btn-primary">
                          Deposit
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div class="card">
                    <div class="card-header">Withdraw</div>
                    <div class="card-body">
                      <div className="card-title">Withdraw Amount</div>
                      <form onSubmit={this.handleWithdraw}>
                        <p class="card-text">
                          <div className="input-group mb-3">
                            <div className="input-group-prepend">
                              <span className="input-group-text">$</span>
                            </div>
                            <input
                              name="withdraw"
                              type="text"
                              className="form-control"
                              aria-label="Amount (to the nearest dollar)"
                              onChange={e =>
                                this.setState({
                                  withdraw: e.currentTarget.value * 100
                                })
                              }
                            />
                            <div className="input-group-append">
                              <span className="input-group-text">.00</span>
                            </div>
                          </div>
                        </p>
                        <button type="submit" class="btn btn-primary">
                          Withdraw
                        </button>
                      </form>
                    </div>
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
export default AccountSummary;

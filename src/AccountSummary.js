import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { read_cookie, delete_cookie } from "sfcookies";
import _ from "lodash";
import { Navbar } from "./Signup";
import { Route, NavLink, BrowserRouter as Router } from "react-router-dom";
import "./AccountSummary.css";

// function Transactions(props) {
//   const transactions = props.transactions.map(transaction => (
//     <li key={transaction.id.toString()}> Amount: {transaction.amount} </li>
//   ));
//   return <ul> {transactions} </ul>;
const Balance = props => {
  return (
    <div className="container">
      <span itemID="boo">
        {"Balance: $" + (props.balance / 100).toFixed(2)}
      </span>
    </div>
  );
};
const DeleteAccount = props => {
  return (
    <form onSubmit={props.onSubmit}>
      <div
        className="modal fade"
        id="DeleteAccount"
        tabIndex="-1"
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
                id="close"
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                id="comfirm_delete"
                type="submit"
                className="btn btn-danger"
              >
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
  if (props.transactions.length > 0) {
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
      <table className="table">
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
  } else {
    return (
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Transaction ID</th>
            <th scope="col">Day(Year,Month,Day)</th>
            <th scope="col">Type</th>
            <th scope="col">amount</th>
          </tr>
        </thead>
        <tbody>There are no transactions</tbody>
      </table>
    );
  }
};
class Requests extends Component {
  render() {
    return <div> Requests </div>;
  }
}
// class BusinessCharge extends Component {
//   constructor() {
//     super();
//     this.state = {
//       amount: 0,
//       customerId: 0,
//       code: ""
//     };
//     this.handleRequest = this.handleRequest.bind(this);
//   }
//   handleRequest(event) {
//     event.preventDefault();
//     fetch("http://localhost:8080/business/transaction", {
//       method: "post",
//       mode: "cors",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         businessId: this.props.businessInfo.id,
//         amount: this.state.amount
//       })
//     })
//       .then(response => {
//         return response.text();
//       })
//       .then(transactionCode => {
//         this.setState({ code: transactionCode });
//       });
//   }

//   render() {
//     return (
//       <div>
//         <div className="container">
//           <div className="col-lg-4 offset-lg-4">
//             <div className="card">
//               <div className="card-header">Request</div>
//               <div className="card-body">
//                 <div className="card-title">Request Amount</div>
//                 <form onSubmit={this.handleRequest}>
//                   <p className="card-text">
//                     <input
//                       placeholder="Customer Id"
//                       className="form-control"
//                       type="number"
//                       onChange={e => {
//                         this.setState({ customerId: e.currentTarget.value });
//                       }}
//                     />
//                     <div className="input-group mb-3">
//                       <div className="input-group-prepend">
//                         <span className="input-group-text">$</span>
//                       </div>
//                       <input
//                         name="deposit"
//                         type="number"
//                         className="form-control"
//                         aria-label="Amount (to the nearest dollar)"
//                         onChange={e =>
//                           this.setState({
//                             amount: Number(e.currentTarget.value) * 100
//                           })
//                         }
//                         placeholder="Total Due"
//                         min="1"
//                         max="9999"
//                       />
//                       <div className="input-group-append">
//                         <span className="input-group-text">.00</span>
//                       </div>
//                     </div>
//                   </p>
//                   <button
//                     id="deposit"
//                     type="submit"
//                     className="btn btn-primary"
//                   >
//                     Send
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="container">Code: {this.state.code}</div>
//       </div>
//     );
//   }
// }
// class BusinessSummary extends Component {
//   render() {
//     return (
//       <div>
//         <Balance balance={this.props.businessInfo.balance} />
//         <div className="container">
//           <Transactions transactions={this.props.transactions} />
//         </div>
//       </div>
//     );
//   }
// }
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
      transactions: [],
      withdraw: 0,
      deposit: 0
    };
    this.handleDeposit = this.handleDeposit.bind(this);
    this.handleWithdraw = this.handleWithdraw.bind(this);
    this.transactions = this.transactions.bind(this);
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
        console.log(transaction);
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
    e.currentTarget.reset();
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
  render() {
    if (!this.state.loaded) {
      return null;
    } else {
      return (
        <div>
          <Balance balance={this.state.userInfo.balance} />
          {/* <div className="container">
            <span itemID="boo">
              {"Balance: $" + (this.state.userInfo.balance / 100).toFixed(2)}
            </span>
          </div> */}
          <div className="container">
            <div className="row">
              <div className="col-6">
                <h3>Transactions</h3>
                <Transactions transactions={this.state.transactions} />
              </div>
              <div className="col-6">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">Deposit</div>
                    <div className="card-body">
                      <div className="card-title">Deposit Amount</div>
                      <form onSubmit={this.handleDeposit}>
                        <p className="card-text">
                          <div className="input-group mb-3">
                            <div className="input-group-prepend">
                              <span className="input-group-text">$</span>
                            </div>
                            <input
                              name="deposit"
                              type="number"
                              className="form-control"
                              aria-label="Amount (to the nearest dollar)"
                              onChange={e =>
                                this.setState({
                                  deposit: Number(e.currentTarget.value) * 100
                                })
                              }
                              min="1"
                              max="9999"
                            />
                            <div className="input-group-append">
                              <span className="input-group-text">.00</span>
                            </div>
                          </div>
                        </p>
                        <button
                          id="deposit"
                          type="submit"
                          className="btn btn-primary"
                        >
                          Deposit
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="card">
                    <div class="card-header">Withdraw</div>
                    <div className="card-body">
                      <div className="card-title">Withdraw Amount</div>
                      <form onSubmit={this.handleWithdraw}>
                        <p className="card-text">
                          <div className="input-group mb-3">
                            <div className="input-group-prepend">
                              <span className="input-group-text">$</span>
                            </div>
                            <input
                              name="withdraw"
                              type="number"
                              className="form-control"
                              aria-label="Amount (to the nearest dollar)"
                              onChange={e =>
                                this.setState({
                                  withdraw: Number(e.currentTarget.value) * 100
                                })
                              }
                              min="1"
                              max={this.state.userInfo.balance / 100}
                            />
                            <div className="input-group-append">
                              <span className="input-group-text">.00</span>
                            </div>
                          </div>
                        </p>
                        <button
                          id="withdraw"
                          type="submit"
                          className="btn btn-primary"
                        >
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
export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cookieDeleted: false,
      userInfo: {}
    };
    this.Logout = this.Logout.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
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
        this.setState({ cookieDeleted: true });
        // window.location.reload(true);
      })
      .catch(error => {
        console.log(error);
      });
  }
  handleDelete(e) {
    e.preventDefault();
    document.getElementById("close").click();
    fetch(`http://localhost:8080/delete/${this.state.userInfo.id}`, {
      method: "delete",
      mode: "cors"
    }).then(() => {
      delete_cookie("CUser");
      this.setState({ cookieDeleted: true });
    });
  }
  render() {
    if (this.state.cookieDeleted) {
      return <Redirect to="/signup" />;
    } else {
      return (
        <div>
          <Navbar isBusiness={false} username={this.state.userInfo.username}>
            <NavLink
              exact
              to="accountSummary"
              className="nav-item nav-link"
              activeClassName="active"
            >
              Account Summary <span class="sr-only">(current)</span>
            </NavLink>
            {/* <NavLink to="requests" className="nav-item nav-link">
            Requests
          </NavLink> */}
            <a
              id="logout"
              className="nav-item nav-link"
              onClick={e => this.Logout(e)}
              href=""
            >
              Logout
            </a>
            <a
              id="delete_account"
              className="nav-item nav-link"
              data-toggle="modal"
              data-target="#DeleteAccount"
              href=""
            >
              Delete Account
            </a>
            <DeleteAccount onSubmit={this.handleDelete} />
          </Navbar>
          <Route path="/home/accountSummary" component={AccountSummary} />
          {/* <Route path="/home/requests" component={Requests} /> */}
        </div>
      );
    }
  }
}
// export class BusinessHome extends Component {
//   constructor() {
//     super();
//     this.state = {
//       businessInfo: {},
//       transactions: []
//     };
//     this.Logout = this.Logout.bind(this);
//   }
//   componentDidMount() {
//     fetch("http://localhost:8080/businessSummary", {
//       method: "post",
//       mode: "cors",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ sessionKey: read_cookie("BUser") })
//     })
//       .then(response => {
//         return response.json();
//       })
//       .then(data => {
//         this.setState({ businessInfo: data });
//       });
//   }
//   Logout(e) {
//     e.preventDefault();
//     fetch("http://localhost:8080/business/logout", {
//       method: "post",
//       mode: "cors",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: read_cookie("BUser")
//     })
//       .then(response => {
//         delete_cookie("BUser");
//         window.location.reload(true);
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   }
//   render() {
//     return (
//       <div>
//         <Navbar isBusiness={true}>
//           <NavLink exact to="/business/summary" className="nav-item nav-link">
//             Summary
//           </NavLink>
//           <NavLink to="/business/charge" className="nav-item nav-link">
//             Charge
//           </NavLink>
//           <a
//             id="logout"
//             className="nav-item nav-link"
//             onClick={e => this.Logout(e)}
//             href=""
//           >
//             Logout
//           </a>
//         </Navbar>
//         <Route
//           path="/business/charge"
//           render={() => (
//             <BusinessCharge businessInfo={this.state.businessInfo} />
//           )}
//         />
//         <Route
//           path="/business/summary"
//           render={() => (
//             <BusinessSummary
//               businessInfo={this.state.businessInfo}
//               transactions={this.state.transactions}
//             />
//           )}
//         />
//       </div>
//     );
//   }
// }

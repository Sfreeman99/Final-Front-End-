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
      loaded: false
    };
  }

  render() {
    if (!this.state.loaded) {
      return <div className="alert alert-danger"> key not loaded </div>;
    } else {
      return <div className="alert alert-success"> It was loaded </div>;
    }
  }
}
export default AccountSummary;

import React, { Component } from "react";
import { bake_cookie, read_cookie, delete_cookie } from "sfcookies";

var dummyUser = {
  id: 1999,
  username: "shedliaf",
  firstName: "Shedlia",
  LastName: "Freeman",
  balance: 20,
  transactions: [
    // id
    // day
    // what was given or received
    // to or from the company
    {
      id: 1,
      day: "11-2-2017",
      amount: 5,
      from: "Jo"
    },
    {
      id: 2,
      day: "11-5-2017",
      amount: 5,
      from: "Bill"
    },
    {
      id: 3,
      day: "11-25-2017",
      amount: 15,
      from: "Kell"
    },
    {
      id: 4,
      day: "12-2-2017",
      amount: -5,
      from: "Jo"
    }
  ]
};
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
      userInfo: {}
    };
  }
  componentDidMount() {
    fetch("http://localhost:8080/login", {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Username: "shedliafreeman",
        FirstName: "Shedlia",
        LastName: "Freeman",
        Password: "1234",
        Email: "shedliaf@gmail.com"
      })
    })
      .then(function(response) {
        return response.json();
      })
      .catch(function(error) {
        console.log(error);
      })
      .then(function(key) {
        bake_cookie("CUser", key);
      });
  }

  render() {
    if (!this.state.loaded) {
      return <div> not loaded </div>;
    } else {
      return (
        <div className="jumbotron">
          <h1 className="display-4">Hello, {this.state.userInfo.username}!</h1>
          <p className="lead">
            Your name:{" "}
            {this.state.userInfo.firstName + this.state.userInfo.LastName}
            id: {this.state.userInfo.id}
          </p>
          <p />
          <Transactions transactions={this.state.userInfo.transactions} />
        </div>
      );
    }
  }
}
export default AccountSummary;

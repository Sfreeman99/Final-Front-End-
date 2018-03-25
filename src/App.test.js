import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ReactTestUtils from "react-dom/test-utils";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
it("has header", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
  const test = ReactTestUtils.findRenderedDOMComponentWithClass(
    "App-Title"
  ).textContent();
  expect(test).toBe("Welcome to React");
});

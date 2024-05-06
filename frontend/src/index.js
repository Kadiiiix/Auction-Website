import React from "react";
import ReactDOM from "react-dom";
import "./index.css"; // Assuming you have global styles defined
import App from "./App"; // Importing App component from App.js

// ReactDOM.render is the function that instructs React to attach your App component to a specific DOM element.
ReactDOM.render(
  <React.StrictMode>
    <App /> // Your App component is being rendered here
  </React.StrictMode>,
  document.getElementById("root") // This 'root' ID matches the div ID in your index.html
);

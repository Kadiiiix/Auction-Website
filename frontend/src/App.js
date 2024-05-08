// App.js
import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ItemListingsPage from "./components/ItemListingsPage";
import AuctionItem from "./components/AuctionItem"; // Import the IndividualItemPage component
import "../src/design/MainHeader.css";

function App() {
  const items = [
    {
      id: 1,
      title: "Antique Dresser",
      highestBid: 100,
      daysRemaining: 2,
      image: "dresser.png",
    },
    {
      id: 2,
      title: "Antique Dresser",
      highestBid: 100,
      daysRemaining: 2,
      image: "dresser.png",
    },
    {
      id: 3,
      title: "Antique Dresser",
      highestBid: 100,
      daysRemaining: 2,
      image: "dresser.png",
    },
  ];

  return (
    <Router>
      <div className="App">
        <div className = "UpperHeader">

          <ul>
            <li><a href="/login">Log In</a></li>
            <li><a href="/register">Register</a></li>
          </ul>

        </div>

        <div className="LowerHeader">

          <div className="Title">
            <h2>IzložBa</h2>
          </div>

          <div className="List">

            <ul>
              <li><a href="/login">Home</a></li>
              <li><a href="/register">Categories</a></li>
            </ul>
            
          </div>

          <div className="SearchBar">

           <form>
            <input type="text" placeholder="" />
            <button type="submit">Search</button>
           </form>
            
          </div>
        </div>

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/items"
            element={<ItemListingsPage items={items} />}
          />
          <Route path="/items/:id" element={<AuctionItem items={items} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import RegisterPage from "./components/RegisterPage";
import ItemListingsPage from "./components/ItemListingsPage";
import AuctionItem from "./components/AuctionItem";
import "../src/design/MainHeader.css";
import AuctionPage from "./components/AuctionPage";
import CreateAuction from "./components/CreateAuction";


function App() {

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    // Update search query here
    setSearchQuery(e.target.elements.search.value);
  };

  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogout = () => {
    // Clear token and log out
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setLoggedIn(false);
  };

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
      }
  }, []);

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
        <div className="UpperHeader">

          <ul>
            {!loggedIn && (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
            {loggedIn && (
              <>
                <li>
                  <Link to="/create">New</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
            <li>
              <Link to="/items">Items</Link>
            </li>
          </ul>
        </div>

        <div className="LowerHeader">
          <div className="Title">
            <h2>IzložBa</h2>
          </div>
          <div className="List">
            <ul>
              <li><Link to="/homepage">Home</Link></li>
              <li><Link to="/register">Categories</Link></li>
            </ul>
          </div>
          <div className="SearchBar">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search..."
                name="search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button type="submit">Search</button>
            </form>
          </div>
        </div>
        <Routes>
          <Route path="/homepage" element={<HomePage searchQuery={searchQuery} />} />
          <Route path="/login" element={<LoginPage setLoggedIn={setLoggedIn} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/items" element={<ItemListingsPage items={items} />} />
          <Route path="/items/:id" element={<AuctionItem items={items} />} />
          {loggedIn ? (
            <Route path="/create" element={<CreateAuction />} />
          ) : <Route path="/login" element={<LoginPage setLoggedIn={setLoggedIn} />} />}
          <Route path="/auction/:id" element={<AuctionPage setLoggedIn={loggedIn} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

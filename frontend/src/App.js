import React, { useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import RegisterPage from "./components/RegisterPage";
import ItemListingsPage from "./components/ItemListingsPage";
import AuctionItem from "./components/AuctionItem";
import "../src/design/MainHeader.css";

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

  return (
    <Router>
      <div className="App">
        <div className="UpperHeader">
          <ul>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/items">Items</Link>
            </li>
            <li>
              <Link to="/create">New</Link>
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/homepage" element={<HomePage searchQuery={searchQuery} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/items" element={<ItemListingsPage />} />
          <Route path="/items/:id" element={<AuctionItem />} />
          <Route path="/create" element={<CreateAuction />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

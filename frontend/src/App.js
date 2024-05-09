// App.js
import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ItemListingsPage from "./components/ItemListingsPage";
import AuctionItem from "./components/AuctionItem"; // Import the IndividualItemPage component
import CreateAuction from "./components/CreateAuction";
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
        <h1>IzložBa</h1>
        <nav>
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
        </nav>

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/items" element={<ItemListingsPage items={items} />} />
          <Route path="/items/:id" element={<AuctionItem items={items} />} />
          <Route path="/create" element={<CreateAuction />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate,
  useParams,
} from "react-router-dom";
import { notification } from "antd";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import RegisterPage from "./components/RegisterPage";
import ItemListingsPage from "./components/ItemListingsPage";
import AuctionItem from "./components/AuctionItem";
import AuctionPage from "./components/AuctionPage";
import CreateAuction from "./components/CreateAuction";
import FavoritesPage from "./components/FavoritesPage";
import CategoriesPage from "./components/CategoriesPage";
import NotLoggedIn from "./components/NotLoggedIn";
import UserProfile from "./components/UserProfile";
import SearchAuctions from "./components/SearchAuctions";
import CategoryPage from "./components/CategoryPage";
import "../src/design/MainHeader.css";

function App() {

  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState("");
  const { query } = useParams();

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
  
    // Display logout notification
    notification.success({
      message: 'Logout Successful',
      description: 'You have successfully logged out.',
    });
  };

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    if (token && storedUserId) {
      setLoggedIn(true);
      setUserId(storedUserId);
      }
  }, []);

  const items = [

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
                  <Link onClick={handleLogout}>Logout</Link>
                </li>
                <li>
                  <Link to="/yourprofile">Profile</Link>
                </li>
                <li>
                  <Link to="/favorites">My Favorites</Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="LowerHeader">
          <div className="Title">
            <h2>IzložBa</h2>
          </div>
          <div className="List">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/categories">Categories</Link>
              </li>
            </ul>
          </div>
          <div className="SearchBar">
            <form>
              <input
                type="text"
                placeholder="Search..."
                name="search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Link to={`/search?query=${searchQuery}`}>
                <button>Search</button>
              </Link>
            </form>
          </div>
        </div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={<LoginPage setLoggedIn={setLoggedIn} />}
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/items" element={<ItemListingsPage items={items} />} />
          <Route path="/items/:id" element={<AuctionItem items={items} />} />
          <Route
            path="/create"
            element={
              loggedIn ? (
                <CreateAuction userId={userId} />
              ) : (
                <Navigate to="/notlogged" />
              )
            }
          />
          <Route path="/search" element={<SearchAuctions />} />
          <Route
            path="/favorites"
            element={
              loggedIn ? (
                <FavoritesPage userId={userId} setLoggedIn={loggedIn} />
              ) : (
                <Navigate to="/notlogged" />
              )
            }
          />

          <Route
            path="/yourprofile"
            element={loggedIn ? <UserProfile userId={userId} loggedIn={loggedIn}/> : <Navigate to="/notlogged" />}
          />

          <Route
            path="/auction/:id"
            element={<AuctionPage setLoggedIn={loggedIn} />}
          />
          <Route
            path="/categories"
            element={<CategoriesPage setLoggedIn={loggedIn} />}
          />
          <Route
            path="/category/:query"
            element={<CategoryPage query={query} setLoggedIn={loggedIn} />}
          />
          <Route path="/notlogged" element={<NotLoggedIn />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

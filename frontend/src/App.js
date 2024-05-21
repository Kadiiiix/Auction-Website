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
import { notification, Menu, Dropdown, Button} from "antd";
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
import NavigationMenu from "./components/NavigationMenu";
import NotificationPage from "./components/NotificationPage";
import { UserOutlined } from "@ant-design/icons";
import "../src/design/MainHeader.css";
import UsersAuctionsPage from "./components/UsersAuctions";
import UsersComments from "./components/UsersComments";
import Messages from "./components/Messages";
import MessageFull from "./components/MessageFull";
import ResetPassword from "./components/ResetPassword";
import ForgotPassword from "./components/ForgotPassword";

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

  const [showMenu, setShowMenu] = useState(false);

 const toggleMenu = () => {
  setShowMenu(!showMenu);
};

const closeMenu = () => {
  setShowMenu(false);
};
  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    if (token && storedUserId) {
      setLoggedIn(true);
      setUserId(storedUserId);
      console.log(userId)
      }
  });

  const items = [

  ];

  const menu = (
    <Menu className="account-menu">
      <Menu.Item>
        <Link to={`/profile/${userId}`}>Profile</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={`/notifications/${userId}`}>Notifications</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={`/messages/user`}>Messages</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={`/favorites/${userId}`}>Favorites</Link>
      </Menu.Item>
      <Menu.Item onClick={handleLogout}>Logout</Menu.Item>
    </Menu>
  );

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
                  <Link to="/create">Create Auction</Link>
                </li>
                <Dropdown overlay={menu} trigger={['hover']}>
                  <li>
                  <Link icon={<UserOutlined />} onClick={e => e.preventDefault()}>Account</Link>
                  </li>
                </Dropdown>
              </>
            )}
          </ul>
        </div>

        <div className="LowerHeader">
          <div className="Title">
            <div style={{ position: "relative" }}>
              <a href="/" class="no-underline">
                <h2 style={{ display: "inline-block" }}>IzložBa</h2>
              </a>
            </div>
          </div>
          <div class="List">
          <div onClick={toggleMenu} style={{ cursor: "pointer" }}>
                <h2>Categories</h2>
                {showMenu && <NavigationMenu />}
              </div>
            <div>
              <h2>New Auctions</h2>
              </div>
            <div>
              <h2>Popular Auctions</h2>
              </div>
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
          <Route
            path="/notifications/:id"
            element={
              loggedIn ? (
                <NotificationPage setLoggedIn={loggedIn} />
              ) : (
                <Navigate to="/notlogged" />
              )
            }
          />
          <Route path="/items" element={<ItemListingsPage items={items} />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
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
            path="/favorites/:id"
            element={
              loggedIn ? (
                <FavoritesPage setLoggedIn={loggedIn} />
              ) : (
                <Navigate to="/notlogged" />
              )
            }
          />

          <Route
            path="/auctions/:id"
            element={
              loggedIn ? (
                <UsersAuctionsPage setLoggedIn={loggedIn} />
              ) : (
                <Navigate to="/notlogged" />
              )
            }
          />

          <Route
            path="/comments/:id"
            element={
              loggedIn ? (
                <UsersComments setLoggedIn={loggedIn} />
              ) : (
                <Navigate to="/notlogged" />
              )
            }
          />

          <Route
            path="/profile/:id"
            element={
              loggedIn ? (
                <UserProfile loggedIn={loggedIn} />
              ) : (
                <Navigate to="/notlogged" />
              )
            }
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
          <Route
            path="/messages/:id"
            element={<MessageFull setLoggedIn={loggedIn}/>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Menu, Dropdown, notification } from 'antd';
import NavigationMenu from './NavigationMenu';
import '../design/Navbar.css';

const Navbar = ({ loggedIn, handleLogout, userId, role }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

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
    <div className="navbar">
        <Link to="/" className={({ isActive }) => (isActive ? "active" : "inactive")}>
      <div className="text-with-image">
        <img src={require("../design/Logo Zuti.png")} alt="logo" className="image" />
        <h2 className="text">IzložBa</h2>
      </div>
      </Link>
      <div className="links">
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "inactive")}>
          <p>Home</p>
        </NavLink>
        <NavLink to="/recent" className={({ isActive }) => (isActive ? "active" : "inactive")}>
          <p>New Auctions</p>
        </NavLink>
        <NavLink to="/popular" className={({ isActive }) => (isActive ? "active" : "inactive")}>
          <p>Popular Auctions</p>
        </NavLink>
        <p onClick={toggleMenu} style={{ cursor: "pointer" }}>Categories <DownOutlined style={{ fontSize: "1.5vh" }} /></p>
        {showMenu && <NavigationMenu closeMenu={closeMenu} />}
      </div>
      <div className="auth-links">
        {!loggedIn && (
          <>
            <NavLink to="/login">
                <p>Login</p>
                </NavLink>
            <NavLink to="/register">
                <p>Register</p>
                </NavLink>
          </>
        )}
        {loggedIn && role === "admin" && (
          <>
            <NavLink to="/manage/auctions">
              <p>Manage Auctions</p>
            </NavLink>
            <NavLink to="/manage/users">
              <p>Manage Users</p>
            </NavLink>
            <NavLink to="/manage/comments">
              <p>Manage Comments</p>
            </NavLink>
          </>
        )}
        {loggedIn && (
          <Dropdown overlay={menu} trigger={["hover"]}>
            <NavLink onClick={(e) => e.preventDefault()}>
              <p><UserOutlined /> Account <DownOutlined style={{ fontSize: "1.5vh", marginRight: "10px"}}/></p>
            </NavLink>
          </Dropdown>
        )}
      </div>
    </div>
  );
};

export default Navbar;

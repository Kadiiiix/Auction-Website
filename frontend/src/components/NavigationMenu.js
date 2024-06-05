import React from "react";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "../design/NavigationMenu.css"; // Import the CSS file"
import { Link } from "react-router-dom";
const { SubMenu } = Menu;
const items = [
  {
    key: "sub1",

    label: "Art & Decor",
    children: [
      {
        key: "1",
        label: "Artwork",
      },
      {
        key: "2",
        label: "Collectibles",
      },
      {
        key: "3",
        label: "Antiques",
      },

      {
        key: "4",
        label: "Decorative Items",
      },
      {
        key: "5",
        label: "Furniture",
      },
    ],
  },
  {
    key: "sub2",

    label: "Entertainment",
    children: [
      {
        key: "6",
        label: "Books & Movies",
      },
      {
        key: "7",
        label: "Musical Instruments",
      },
      {
        key: "8",
        label: "Video Games",
      },
    ],
  },
  {
    key: "sub3",
    label: "Clothing & Footwear",

    children: [
      {
        key: "9",
        label: "Health & Beauty",
      },
      {
        key: "10",
        label: "Jewelry",
      },

      {
        key: "11",
        label: "Clothing",
      },
      {
        key: "12",
        label: "Footwear",
      },
    ],
  },
  {
    key: "sub4",
    label: "Gadgets & Vehicles",

    children: [
      {
        key: "13",
        label: "Tools & Equipment",
      },
      {
        key: "14",
        label: "Electronics",
      },
      {
        key: "15",
        label: "Outdoor Gear",
      },
      {
        key: "16",
        label: "Vehicles",
      },
    ],
  },
  {
    key: "sub5",
    label: "Others",

    children: [
      {
        key: "17",
        label: "Pet equipment",
      },
      {
        key: "18",
        label: "Miscellaneous",
      },
    ],
  },
];

const NavigationMenu = ({ closeMenu }) => (
  <div className="menu-container">
    <Menu mode="vertical" className="menu">
      {items.map((item) => (
        <SubMenu key={item.key} title={item.label}>
          {item.children.map((child) => (
            <Menu.Item key={child.key}>
              <Link to={`/category/${child.label}`} className="no-underline" onClick={closeMenu}>
                {child.label}
              </Link>
            </Menu.Item>
          ))}
        </SubMenu>
      ))}
    </Menu>
  </div>
);

export default NavigationMenu;

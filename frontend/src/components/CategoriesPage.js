import React from "react";
import { Link } from "react-router-dom";
import "../design/CategoriesPage.css";
import sedan from "../design/sedan.png";
const CategoriesPage = () => {
  const categories = [
    { id: 1, name: "Vehicles", image: sedan },
    { id: 2, name: "Real Estate", image: sedan },
    { id: 3, name: "Electronics", image: sedan },
    { id: 4, name: "Antiques", image: sedan },
    { id: 5, name: "Artwork", image: sedan },
    { id: 6, name: "Home Appliances", image: sedan },
    { id: 7, name: "Clothing and Footwear", image: sedan },
    { id: 8, name: "Sports Equipment", image: sedan },
    { id: 9, name: "Collectibles", image: sedan },
    { id: 10, name: "Decorative Items", image: sedan },
    { id: 11, name: "Books and Magazines", image: sedan },
    { id: 12, name: "Hobbies and Crafts", image: sedan },
    { id: 13, name: "Health and Beauty", image: sedan },
    { id: 14, name: "Tools and Equipment", image: sedan },
    { id: 15, name: "Musical Instruments", image: sedan },
    { id: 16, name: "Art Supplies", image: sedan },
    { id: 17, name: "Home Furniture", image: sedan },
    { id: 18, name: "Technical Equipment", image: sedan },
    { id: 19, name: "Music & Movies", image: sedan },
    { id: 20, name: "Tools & DIY", image: sedan },
    { id: 21, name: "Computer Accessories", image: sedan },
    { id: 22, name: "Video Games & Consoles", image: sedan },
    { id: 23, name: "Crafts", image: sedan },
    { id: 24, name: "Spare Parts and Accessories", image: sedan },
  ];
  return (
    <div className="page">
      <h1 className="page-title">Categories</h1>
      <div className="categories-grid">
        {categories.map((category) => (
          <Link to={`/category/${category.name}`} key={category.id} class="no-underline">
            <div className="category-item">
              <img
                src={category.image}
                alt={category.name}
                className="category-image"
              />
              <span className="category-name">{category.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;

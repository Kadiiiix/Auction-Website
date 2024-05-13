import React from "react";
import { Link } from "react-router-dom";
import "../design/CategoriesPage.css";
const CategoriesPage = () => {
 const categories = [
   { id: 1, name: "Antiques" },
   { id: 2, name: "Artwork" },
   { id: 3, name: "Books & Movies" },
   { id: 4, name: "Clothes" },
   { id: 5, name: "Collectibles" },
   { id: 6, name: "Decorative Items" },
   { id: 7, name: "Electronics" },
   { id: 8, name: "Footwear" },
   { id: 9, name: "Furniture" },
   { id: 10, name: "Health and Beauty" },
   { id: 11, name: "Jewelry" },
   { id: 12, name: "Misceellaneous" },
   { id: 13, name: "Musical Instruments" },
   { id: 14, name: "Outdoor Gear" },
   { id: 15, name: "Pet Supplies" },
   { id: 16, name: "Tools & Equipment" },
   { id: 17, name: "Vehicles" },
   { id: 18, name: "Video Games" },
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

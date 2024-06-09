import React from "react";
import { Link } from "react-router-dom";
import "../design/RecommendedItem.css"

function RecommendedItem({ item }) {
  const {
    name,
    _id,
    picture,
  } = item; // Destructure item object


  return (
    <div className = "ContainerRecommendedItem">
      <div
        className="ImageRecommendedItem"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL + picture})`,
        }}
      >
      </div>

      <div className="RecommendedItem">
        <div className="InfoRecommendedItem">
        <Link to={`/auction/${_id}`}>
          <p className="auction-title" style={{fontSize:"3vh"}}>{name}</p>
        </Link>
        </div>
      </div>
    </div>
  );
}


export default RecommendedItem;

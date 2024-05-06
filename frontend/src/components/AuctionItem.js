// AuctionItem.js
import React from "react";

function AuctionItem({ item }) {
  const {
    picture,
    name,
    condition,
    category,
    closingDate,
    additionalPhotos,
    startingBid,
    allowInstantPurchase,
    description,
    location,
    age,
  } = item; // Destructure item object

  return (
    <div style={styles.container}>
      {/* Render auction listing details */}
      <p>Picture: {picture}</p>
      <p>Name: {name}</p>
      <p>Condition: {condition}</p>
      <p>Category: {category}</p>
      <p>Closing Date: {closingDate}</p>
      {/* Render other properties as needed */}
    </div>
  );
}


const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid #ccc",
    marginBottom: "20px",
    padding: "10px",
    maxWidth: "300px",
  },
  image: {
    width: "100%",
    height: "auto",
  },
  info: {
    textAlign: "center",
  },
  button: {
    backgroundColor: "yellow",
    border: "none",
    padding: "10px 20px",
    cursor: "pointer",
  },
};

export default AuctionItem;

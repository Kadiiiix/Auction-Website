// AuctionItem.js
import React from "react";

function AuctionItem({ item }) {
  const { title, highestBid, daysRemaining, image } = item; // Destructure item object

  return (
    <div style={styles.container}>
      <img src={image} alt={title} style={styles.image} />
      <div style={styles.info}>
        <h3>{title}</h3>
        <p>Auction Ending in {daysRemaining} days</p>
        <p>Highest Bid: ${highestBid}</p>
        <button style={styles.button}>Bid Now</button>
      </div>
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

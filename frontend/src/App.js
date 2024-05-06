import React from "react";
import AuctionItem from "./components/AuctionItem.js"; // Ensure the path is correct based on your structure

function App() {
  const items = [
    {
      id: 1,
      title: "Antique Dresser",
      highestBid: 100,
      daysRemaining: 2,
      image: "dresser.png", // Relative path from the public directory
    },
    // Add more items as needed
  ];

  return (
    <div
      className="App"
      style={{
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>IzložBa</h1>
      <h2>Popular Auctions</h2>
      {items.map((item) => (
        <AuctionItem
          key={item.id}
          title={item.title}
          highestBid={item.highestBid}
          daysRemaining={item.daysRemaining}
          image={`/${item.image}`} // This will resolve to http://localhost:3000/dresser.png when running locally
        />
      ))}
    </div>
  );
}

export default App;

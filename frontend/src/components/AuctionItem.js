import React from "react";
import "../design/AuctionItem.css";
import Timer from "./Timer";

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
    <div className = "ContainerAuctionItem">
      <div className="ImageAuctionItem">
      <img
            className="auction-photo"
            src={process.env.PUBLIC_URL + item.picture} // Use item.picture as the image source
            alt="Auction Item"
          />
      </div>

      <div className="InfoAndButton">

        <div className="InfoAuctionItem">

          <h2>{name}</h2>
          <p>Condition: {condition}</p>
          <p>Closing Date: <Timer closingDate={closingDate}/></p>
          <p>Age: {age}</p>

        </div>

        <div className="ButtonAuctionItem">

          <button>BID NOW</button>

        </div>



      </div>


    </div>
  );
}


export default AuctionItem;

import React from "react";
import "../design/AuctionItem.css"

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
      <img src={picture} alt={name}  />
      </div>

      <div className="InfoAndButton">

        <div className="InfoAuctionItem">

          <h2>{name}</h2>
          <p>Condition: {condition}</p>
          <p>Closing Date: {new Date(closingDate).toLocaleDateString()}</p>
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

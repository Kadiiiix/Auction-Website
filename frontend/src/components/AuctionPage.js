import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../design/AuctionPage.css';


const AuctionPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  
  const handleBidChange = (event) => {
    setBidAmount(event.target.value);
  };
  
  const handlePlaceBid = () => {
    // Implement the logic to place bid
    console.log('Placing bid:', bidAmount);
  };

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/auctions/${id}`);
        setItem(response.data);
      } catch (error) {
        console.error("Error fetching an auction");
      }
    };
    fetchAuction();
  }, [id]);

  return (
    <div className="auction-container">
      {item && (
        <>
        <div className = "item-name">
            <h2>{item.name}</h2>
        </div>
        <div className='information'>
            <div className='one-block'>
                <p className='upper-title'>Item ID</p>
                <p className='lower-title'>{item._id}</p>
            </div>
            <div className='one-block'>
                <p className='upper-title'>End date</p>
                <p className='lower-title'>{item.closingDate}</p>
            </div>
            <div className='one-block'>
                <p className='upper-title'>Author</p>
                <p className='lower-title'>bice autor</p>
            </div>
            <div className='one-block'>
                <p className='upper-title'>Likes</p>
                <p className='lower-title'>bice lajk</p>
            </div>
        </div>
        <div className='photo-bidding'>
            <img className='auction-photo' src={item.picture} alt={item.name}/>
            <div className='bidding'>
                <div className='highest'>
                    <p className='bid-title'>Highest Bid</p>
                    <p className='highest-bid'>1000 KM</p>
                </div>
                <hr className='separator' />
                <div className='minimal'>
                    <p className='bid-title'>Minimal Bid</p>
                    <p className='minimal-bid'>{item.startingBid} KM</p>
                </div>
                <div className='placing-bids'>
                        <button className='bid'>Place Bid</button>
                        <input className='input'
                            type="number"
                            value={bidAmount}
                            onChange={handleBidChange}
                            placeholder="Enter bid"
                        />
                    </div>
            </div>
        </div>
        </>
      )}
    </div>
  );
};

export default AuctionPage;

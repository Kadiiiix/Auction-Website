import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import "./../design/AuctionPage.css";

const UsersComments = () => {
    const {id} = useParams();

    const [comments, setComments] = useState([]);
    const [author, setAuthor] = useState("");
    const [auctionName, setAuctionName] = useState("");
    const [auctionId, setAuctionId] = useState("");

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await axios.get(
            `http://localhost:4000/api/users/${id}`
          );
          setAuthor(response.data.username);
        } catch (error) {
          console.error("Error fetching an auction");
        }
      };
      fetchUser();
    }, []);


    const formatDate = (timestamp) => {
      const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
      const formattedDate = new Date(timestamp).toLocaleString('en-US', options);
      return formattedDate.replace(',', '');
    };

    useEffect(() => {
        const fetchComments = async () => {
          try {
            const response = await axios.get(`http://localhost:4000/api/users/comments/${id}`);
            setComments(response.data);
          } catch (error) {
            console.error("Error fetching comments:", error);
          }
        };
        fetchComments();
      }, [id]); // Make sure to include id as a dependency so that the effect re-runs when id changes
      
      useEffect(() => {
        const fetchAuctionName = async (auctionId) => {
          try {
            const response = await axios.get(`http://localhost:4000/api/auctions/${auctionId}`);
            return response.data.name;
          } catch (error) {
            console.error("Error fetching auction:", error);
            return null;
          }
        };
      
        // Fetch auction name for each comment
        const fetchAuctionNames = async () => {
          const names = await Promise.all(comments.map(comment => fetchAuctionName(comment.auctionId)));
          setAuctionName(names);
        };
      
        fetchAuctionNames();
      }, [comments]); // Make sure to include comments as a dependency so that the effect re-runs when comments change
      
  
      return (
        <>
          <div>
            <h2>{author}'s Comments ({comments.length})</h2>
            {comments.map((comment, index) => (
              <div className='full-comment' key={index}>
                <p>
                  On Auction:{" "}
                  <Link to={`/auction/${comment.auctionId}`}>{auctionName[index]}</Link>
                </p>
                <div className='single-comment'>
                  <div className='username-time'>
                    <Link to={`/profile/${id}`} className="lower-title">{author}</Link>
                    <p className='time'>{formatDate(comment.timePosted)}</p>
                  </div>
                  <p className="comment-text">{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      );      
};

export default UsersComments;

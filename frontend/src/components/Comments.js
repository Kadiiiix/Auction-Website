import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CommentSection = ({ auctionId }) => {
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
  
    const handleChange = (e) => {
      setNewComment(e.target.value);
    };
  
    const fetchAuction = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/auctions/${auctionId}/comments`);
          setComments(response.data);
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
          const userId = localStorage.getItem('userId');
  
          if (!userId) {
              console.error("User ID not found in local storage");
              return;
          }
  
          const response = await axios.post("http://localhost:4000/api/auctions/comments", {
              comment: newComment,
              userId: userId,
              auctionId: auctionId
          });
          
          if (response.status === 201) {
              console.log("Comment posted successfully");
              // Fetch comments again to get updated comments with usernames
              fetchAuction();
              setNewComment(''); // Clear the input field after posting
          } else {
              console.log("Failed to post comment");
          }
      } catch (error) {
          console.error("Error posting comment:", error);
      }
  };
  
    return (
      <>
      <div>
            <h2>Comments ({comments.length})</h2>
            {comments.map((comment, index) => (
                <div key={index}>
                    <p>{comment.userId.username}: {comment.comment}</p>
                    <p>{comment.timePosted}</p>
                </div>
            ))}
        </div>
        <div>
                {/* Box to add a new comment */}
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={newComment}
                        onChange={handleChange}
                        placeholder="Add a comment..."
                        rows={4}
                        cols={50} />
                    <br />
                    <button type="submit">Post Comment</button>
                </form>
            </div>
      </>
    );
  };
  
  export default CommentSection;
  
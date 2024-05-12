import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button } from 'antd';
import "./../design/AuctionPage.css";

const CommentSection = ({ auctionId }) => {
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [form] = Form.useForm();
    const [author, setAuthor] = useState("");

    const handleChange = (e) => {
      setNewComment(e.target.value);
    };

    const userId = localStorage.getItem("userId");

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await axios.get(
            `http://localhost:4000/api/users/${userId}`
          );
          setAuthor(response.data);
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
          const response = await axios.get(`http://localhost:4000/api/auctions/${auctionId}/comments`);
          setComments(response.data);
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      };
      fetchComments();
    }, );
  
    const handleSubmit = async (e) => {
  
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
              setNewComment('');
              form.resetFields(); // Clear the input field after posting
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
              <div className='single-comment' key={index}>
                <div className='username-time'>
                  <p className='username'>{comment.userId.username}:</p>
                  <p className='time'>{formatDate(comment.timePosted)}</p>
                </div>
                <p className="comment-text">{comment.comment}</p>
              </div>
            ))}
        </div>
        {userId ? (
          <>
            <div className='adding-comment'>
          <h2>Add your comment {author}:</h2>
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            name="newComment"
            rules={[
              {
                required: true,
                message: 'Please enter your comment!',
              },
            ]}
          >
            <Input.TextArea 
              value={newComment} 
              onChange={handleChange} 
              showCount 
              maxLength={100} 
              placeholder='Add a comment...'
            />
          </Form.Item>
          
          <Button type="primary" htmlType='submit' className='button'>Post Comment</Button>
        </Form>
        </div>
          </>
        ) : (
          <h2><a href="http://localhost:3000/login">Log In</a> or <a href="http://localhost:3000/register">Register</a> to post a comment!</h2>
        )}
      </>
    );
};

export default CommentSection;

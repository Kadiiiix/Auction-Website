import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Avatar, Modal, Select, notification } from 'antd';
import { UserOutlined, WarningOutlined } from '@ant-design/icons';
import "./../design/AuctionPage.css";

const { TextArea } = Input;
const { Option } = Select;

const CommentSection = ({ auctionId }) => {
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [form] = Form.useForm();
    const [author, setAuthor] = useState("");
    const [photo, setPhoto] = useState("");
    const [reportModalVisible, setReportModalVisible] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportDescription, setReportDescription] = useState('');
    const [commentToReport, setCommentToReport] = useState(null);
    const [commentId, setCommentId] = useState("");

    const handleChange = (e) => {
      setNewComment(e.target.value);
    };

    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await axios.get(
            `http://localhost:4000/api/users/${userId}`
          );
          setAuthor(response.data.username);
          setPhoto(response.data.photo);
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

    const handleReportButtonClick = (comment) => {
      setCommentToReport(comment);
      setCommentId(comment._id);
      setReportModalVisible(true);
    };

    const handleReportSubmit = async () => {
      try {
        const response = await axios.post(`http://localhost:4000/api/report/report`, {
        reporter: userId,
        comment: commentId,
        reason: reportReason,
        description: reportDescription,
        });
        notification.success({
          message: 'Report Submitted',
          description: 'Your report has been submitted successfully.',
        });
        setReportModalVisible(false);
        setReportReason('');
        setReportDescription('');
      } catch (error) {
        console.error("Error reporting comment:", error);
        notification.error({
          message: 'Report Failed',
          description: 'There was an error submitting your report.',
        });
      }
    };
  
    return (
      <>
      <div>
            <h2>Comments ({comments.length})</h2>
            {comments.map((comment, index) => (
              <div className='single-comment' key={index}>
                <Avatar shape="square" size={100} src={comment.userId.photo} icon={<UserOutlined />} />
                <div className='username-time'>
                  <Link to={`/profile/${comment.userId._id}`} className="lower-title">{comment.userId.username}</Link>
                  <p className='time'>{formatDate(comment.timePosted)}</p>
                </div>
                <p className="comment-text">{comment.comment}</p>
                <div className='reporting'>
                {(userId && userId !== comment.userId._id && role !== 'admin') ? (
                  <Button onClick={() => handleReportButtonClick(comment)} className="reportButton">
                    <WarningOutlined /> Report Comment
                  </Button>
                ) : (
                  <Button className="reportButton" disabled>
                    <WarningOutlined /> Report Comment
                  </Button>
                )}
                </div>
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
        
        <Modal
          title="Report Comment"
          visible={reportModalVisible}
          onCancel={() => setReportModalVisible(false)}
          onOk={handleReportSubmit}
        >
          <Form>
            <Form.Item
              label="Reason"
              rules={[{ required: true, message: 'Please select a reason' }]}
            >
              <Select
                value={reportReason}
                onChange={(value) => setReportReason(value)}
              >
                <Option value="hate_speech">Hate Speech</Option>
                <Option value="spam">Spam</Option>
                <Option value="false_information">False Information</Option>
                <Option value="inappropriate_content">Inappropriate Content</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Description"
              rules={[{ required: true, message: 'Please enter a description' }]}
            >
              <TextArea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                rows={4}
              />
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
};

export default CommentSection;

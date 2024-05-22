import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal, message } from 'antd';
import axios from 'axios';

const CommentsTable = () => {
    const [dataSource, setDataSource] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const commentsResponse = await axios.get("http://localhost:4000/api/users/all-comments");
                const comments = commentsResponse.data;

                // Fetch additional data for each comment
                const transformedData = await Promise.all(comments.map(async comment => {
                    // Fetch user data for the user who posted the comment
                    const userResponse = await axios.get(`http://localhost:4000/api/users/${comment.userId}`);
                    const userData = userResponse.data;

                    // Fetch auction data for the auction associated with the comment
                    const auctionResponse = await axios.get(`http://localhost:4000/api/auctions/${comment.auctionId}`);
                    const auctionData = auctionResponse.data;

                    return {
                        key: comment._id,
                        commentId: comment._id,
                        timePosted: new Date(comment.timePosted).toLocaleString(), // Convert UTC to local time
                        username: userData.username,
                        auctionName: auctionData.name,
                        comment: comment.comment,
                    };
                }));

                setDataSource(transformedData);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, []);

    const showModal = (comment) => {
        setSelectedComment(comment);
        setOpen(true);
    };

    const handleOk = () => {
        setOpen(false);
        setSelectedComment(null);
    };

    const handleCancel = () => {
        setOpen(false);
        setSelectedComment(null);
    };

    const handleDelete = async () => {
        try {
            // Delete the comment
            await axios.delete(`http://localhost:4000/api/auctions/comments/${selectedComment.commentId}`);
            message.success('Comment deleted successfully.');

            // Close the modal and clear selected comment
            setOpen(false);
            setSelectedComment(null);

            // Fetch updated comment data
            const commentsResponse = await axios.get("http://localhost:4000/api/users/all-comments");
            const comments = commentsResponse.data;

            // Fetch additional data for each comment
            const transformedData = await Promise.all(comments.map(async comment => {
                // Fetch user data for the user who posted the comment
                const userResponse = await axios.get(`http://localhost:4000/api/users/${comment.userId}`);
                const userData = userResponse.data;

                // Fetch auction data for the auction associated with the comment
                const auctionResponse = await axios.get(`http://localhost:4000/api/auctions/${comment.auctionId}`);
                const auctionData = auctionResponse.data;

                return {
                    key: comment._id,
                    commentId: comment._id,
                    timePosted: new Date(comment.timePosted).toLocaleString(), // Convert UTC to local time
                    username: userData.username,
                    auctionName: auctionData.name,
                    comment: comment.comment,
                };
            }));

            setDataSource(transformedData);
        } catch (error) {
            console.error('Error deleting comment:', error);
            message.error('Failed to delete comment.');
        }
    };

    const columns = [
        {
            title: 'Comment ID',
            dataIndex: 'commentId',
            key: 'commentId',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'On Auction',
            dataIndex: 'auctionName',
            key: 'auctionName',
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment',
            width: '300px',
        },
        {
            title: 'Time Posted',
            dataIndex: 'timePosted',
            key: 'timePosted',
        },

        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Button type="primary" onClick={() => showModal(record)} className='button'>
                    View Details
                </Button>
            ),
            align: 'center',
        },
    ];

    return (
        <>
            <Table dataSource={dataSource} columns={columns} />

            {selectedComment && (
                <Modal
                    visible={open}
                    title="Comment Details"
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="delete" type="primary" danger onClick={handleDelete}>
                            Delete Comment
                        </Button>,
                        <Button key="cancel" onClick={handleCancel}>
                            Cancel
                        </Button>,
                    ]}
                >
                    <p><strong>Comment ID:</strong> {selectedComment.commentId}</p>
                    <p><strong>Username:</strong> {selectedComment.username}</p>
                    <p><strong>Auction Name:</strong> {selectedComment.auctionName}</p>
                    <p><strong>Comment:</strong> {selectedComment.comment}</p>
                    <p><strong>Time Posted:</strong> {selectedComment.timePosted}</p>
                    
                    {/* Add other fields as needed */}
                </Modal>
            )}
        </>
    );
};

export default CommentsTable;

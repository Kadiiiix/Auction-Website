import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Input, Space, Modal, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import axios from 'axios';

const CommentsTable = () => {
    const [dataSource, setDataSource] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);
    const searchInput = useRef(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const commentsResponse = await axios.get("http://localhost:4000/api/users/all-comments");
                const comments = commentsResponse.data;

                const transformedData = await Promise.all(comments.map(async comment => {
                    const userResponse = await axios.get(`http://localhost:4000/api/users/${comment.userId}`);
                    const userData = userResponse.data;

                    const auctionResponse = await axios.get(`http://localhost:4000/api/auctions/${comment.auctionId}`);
                    const auctionData = auctionResponse.data;

                    return {
                        key: comment._id,
                        commentId: comment._id,
                        timePosted: new Date(comment.timePosted).toLocaleString(),
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
            await axios.delete(`http://localhost:4000/api/auctions/comments/${selectedComment.commentId}`);
            message.success('Comment deleted successfully.');

            setOpen(false);
            setSelectedComment(null);

            const commentsResponse = await axios.get("http://localhost:4000/api/users/all-comments");
            const comments = commentsResponse.data;

            const transformedData = await Promise.all(comments.map(async comment => {
                const userResponse = await axios.get(`http://localhost:4000/api/users/${comment.userId}`);
                const userData = userResponse.data;

                const auctionResponse = await axios.get(`http://localhost:4000/api/auctions/${comment.auctionId}`);
                const auctionData = auctionResponse.data;

                return {
                    key: comment._id,
                    commentId: comment._id,
                    timePosted: new Date(comment.timePosted).toLocaleString(),
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

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

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
            ...getColumnSearchProps('username'),
        },
        {
            title: 'On Auction',
            dataIndex: 'auctionName',
            key: 'auctionName',
            ...getColumnSearchProps('auctionName'),
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
                </Modal>
            )}
        </>
    );
};

export default CommentsTable;

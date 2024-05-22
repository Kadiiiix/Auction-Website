import React, { useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Space, Modal, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
import "../design/LoginPage.css"

const UsersTable = () => {
    const [dataSource, setDataSource] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const searchInput = useRef(null);

    useEffect(() => {
        const fetchUsersAndAuctions = async () => {
            try {
                const usersResponse = await axios.get("http://localhost:4000/api/users/all-users");
                const users = usersResponse.data;

                const auctionsResponse = await axios.get("http://localhost:4000/api/auctions");
                const auctions = auctionsResponse.data;

                const transformedData = users.map(user => {
                    const userAuctions = auctions.filter(auction => auction.createdBy === user._id);
                    return {
                        key: user._id,
                        userId: user._id,
                        username: user.username,
                        fullname: user.fullname,
                        email: user.email,
                        auctions: userAuctions.map(auction => auction.name).join(', ')
                    };
                });

                setDataSource(transformedData);
            } catch (error) {
                console.error('Error fetching user or auction data:', error);
            }
        };

        fetchUsersAndAuctions();
    }, []);

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
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
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
                    <Button
                        type="link"
                        size="small"
                        onClick={() => close()}
                    >
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
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

    const showModal = (user) => {
        setSelectedUser(user);
        setOpen(true);
    };

    const handleOk = () => {
        setOpen(false);
        setSelectedUser(null);
    };

    const handleCancel = () => {
        setOpen(false);
        setSelectedUser(null);
    };

    const handleDelete = async () => {
        try {
            // Delete the user
            await axios.delete(`http://localhost:4000/api/users/delete/${selectedUser.userId}`);
            message.success('User deleted successfully.');
            
            // Close the modal and clear selected user
            setOpen(false);
            setSelectedUser(null);
    
            const usersResponse = await axios.get("http://localhost:4000/api/users/all-users");
                const users = usersResponse.data;

                const auctionsResponse = await axios.get("http://localhost:4000/api/auctions");
                const auctions = auctionsResponse.data;

                const transformedData = users.map(user => {
                    const userAuctions = auctions.filter(auction => auction.createdBy === user._id);
                    return {
                        key: user._id,
                        userId: user._id,
                        username: user.username,
                        fullname: user.fullname,
                        email: user.email,
                        auctions: userAuctions.map(auction => auction.name).join(', ')
                    };
                });

            setDataSource(transformedData);
        } catch (error) {
            console.error('Error deleting user:', error);
            message.error('Failed to delete user.');
        }
    };
    

    const columns = [
        {
            title: 'User ID',
            dataIndex: 'userId',
            key: 'userId',
            ...getColumnSearchProps('userId'),
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            ...getColumnSearchProps('username'),
        },
        {
            title: 'Full name',
            dataIndex: 'fullname',
            key: 'fullname',
            ...getColumnSearchProps('fullname'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Auctions',
            dataIndex: 'auctions',
            key: 'auctions',
            ...getColumnSearchProps('auctions'),
            width: '200px',
        },
        {
            title: 'Details and Delete',
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

            {selectedUser && (
                <Modal
                    open={open}
                    title="User Details"
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="delete" type="primary" danger onClick={handleDelete}>
                            Delete User
                        </Button>,
                        <Button key="cancel" onClick={handleCancel}>
                            Cancel
                        </Button>,
                    ]}
                >
                    <p><strong>Username:</strong> {selectedUser.username}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Full name:</strong>{selectedUser.fullname}</p>
                    <p><strong>Phone number:</strong> {selectedUser.phone_number}</p>
                    <p><strong>City:</strong> {selectedUser.city}</p>
                    <p><strong>Auctions:</strong> {selectedUser.auctions}</p>
                </Modal>
            )}
        </>
    );
};

export default UsersTable;

import React, { useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Space, Modal, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
import "../design/LoginPage.css";

const UsersTable = () => {
    const [dataSource, setDataSource] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [reportDetails, setReportDetails] = useState(null);
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

    const showModal = async (user) => {
        setSelectedUser(user);
        try {
            const response = await axios.get(`http://localhost:4000/api/report/reports/aggregated/${user.userId}`);
            setReportDetails(response.data);
            setOpen(true);
        } catch (error) {
            console.error('Error fetching user reports:', error);
            message.error('Failed to fetch user reports.');
        }
    };

    const handleOk = () => {
        setOpen(false);
        setSelectedUser(null);
        setReportDetails(null);
    };

    const handleCancel = () => {
        setOpen(false);
        setSelectedUser(null);
        setReportDetails(null);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:4000/api/users/delete/${selectedUser.userId}`);
            message.success('User deleted successfully.');
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
            title: 'Total Reports',
            key: 'totalReports',
            render: (text, record) => (
                <Button type="link" onClick={() => showModal(record)}>
                    View Reports
                </Button>
            ),
            align: 'center',
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

            {selectedUser && reportDetails && (
                <Modal
                    open={open}
                    title="User Reports"
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
                    <p><strong>Profile Reports:</strong> {reportDetails.profileReports.length}</p>
                    <p><strong>Auction Reports:</strong> {reportDetails.auctionReports.length}</p>
                    <p><strong>Comment Reports:</strong> {reportDetails.commentReports.length}</p>
                    <p><strong>Total Reports:</strong> {reportDetails.totalReports}</p>
                    <h3>Detailed Reports</h3>
                    <p><strong>Profile Reports:</strong> {JSON.stringify(reportDetails.profileReports, null, 2)}</p>
                    <p><strong>Auction Reports:</strong> {JSON.stringify(reportDetails.auctionReports, null, 2)}</p>
                    <p><strong>Comment Reports:</strong> {JSON.stringify(reportDetails.commentReports, null, 2)}</p>
                </Modal>
            )}
        </>
    );
};

export default UsersTable;

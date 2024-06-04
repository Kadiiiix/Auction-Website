import React, { useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Space, Modal, message, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
import "../design/LoginPage.css";

const UsersTable = () => {
    const [dataSource, setDataSource] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [open, setOpen] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [reportDetails, setReportDetails] = useState(null);
    const searchInput = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        const fetchUsersAndAuctions = async () => {
            try {
                const usersResponse = await axios.get("http://localhost:4000/api/users/all-users");
                const users = usersResponse.data;
    
                const auctionsResponse = await axios.get("http://localhost:4000/api/auctions");
                const auctions = auctionsResponse.data;
    
                const transformedData = await Promise.all(users.map(async (user) => {
                    const userAuctions = auctions.filter(auction => auction.createdBy === user._id);
    
                    try {
                        const reportsResponse = await axios.get(`http://localhost:4000/api/report/reports/aggregated/${user._id}`);
                        const totalReports = reportsResponse.data.totalReports || 0;
                        
                        return {
                            key: user._id,
                            userId: user._id,
                            username: user.username,
                            fullname: user.fullname,
                            email: user.email,
                            auctions: userAuctions.map(auction => auction.name).join(', '),
                            totalReports: totalReports,
                        };
                    } catch (error) {
                        console.error(`Error fetching reports for user ${user._id}:`, error);
                        return {
                            key: user._id,
                            userId: user._id,
                            username: user.username,
                            fullname: user.fullname,
                            email: user.email,
                            auctions: userAuctions.map(auction => auction.name).join(', '),
                            totalReports: 0,
                        };
                    }
                }));
    
                setDataSource(transformedData);
                setTotalItems(transformedData.length)
            } catch (error) {
                console.error('Error fetching user or auction data:', error);
            }
        };
    
        fetchUsersAndAuctions();
    }, []);

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const currentPageData = dataSource.slice(startIndex, endIndex);
    
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
            if (response.data) {
                setReportDetails(response.data);
            } else {
                setReportDetails(null);
            }
            setOpen(true);
        } catch (error) {
            console.error('Error fetching user reports:', error);
            message.error('Failed to fetch user reports.');
        }
    };
    

    const showDetailsModal = (user) => {
        setSelectedUser(user);
        setOpenDetails(true);
    };

    const handleOk = () => {
        setOpen(false);
        setSelectedUser(null);
        setReportDetails(null);
    };

    const handleDetailsOk = () => {
        setOpenDetails(false);
        setSelectedUser(null);
    };

    const handleCancel = () => {
        setOpen(false);
        setSelectedUser(null);
        setReportDetails(null);
    };

    const handleDetailsCancel = () => {
        setOpenDetails(false);
        setSelectedUser(null);
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
            dataIndex: 'totalReports',
            key: 'totalReports',
            render: (text, record) => (
                <Button type="link" onClick={() => showModal(record)}>
                    <p>({record.totalReports ? <>{record.totalReports}</> : <>0</>}) View Reports</p> 
                </Button>
            ),
            align: 'center',
        },
        {
            title: 'Details and Delete',
            key: 'actions',
            render: (text, record) => (
                <>
                    <Button type="primary" onClick={() => showDetailsModal(record)} className='button'>
                        View Details
                    </Button>
                </>
            ),
            align: 'center',
        },
    ];

    return (
        <>
            <Table dataSource={currentPageData}  pagination={false} columns={columns}/> 
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalItems}
                    onChange={handlePageChange}
                    showSizeChanger={true}
                    pageSizeOptions={['5', '10', '20', '50']}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                />
            </div>

            {selectedUser && (
                <Modal
                    open={openDetails}
                    title="User Details"
                    onOk={handleDetailsOk}
                    onCancel={handleDetailsCancel}
                    footer={[
                        <Button key="delete" type="primary" danger onClick={handleDelete}>
                            Delete User
                        </Button>,
                        <Button key="close" onClick={handleDetailsCancel}>
                            Close
                        </Button>,
                    ]}
                >
                    <p><strong>Username:</strong> {selectedUser.username}</p>
                    <p><strong>Full name:</strong> {selectedUser.fullname}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Auctions:</strong> {selectedUser.auctions}</p>
                </Modal>
            )}

{selectedUser && (
    <Modal
        open={open}
        title="User Reports"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
            <Button key="ok" onClick={handleOk}>
                OK
            </Button>,
        ]}
    >
        {reportDetails ? (
            <div>
                <p><strong>Total Reports:</strong> {reportDetails.totalReports}</p>
                {reportDetails.profileReports && reportDetails.profileReports.length > 0 ? (
                    <div>
                        <h3>Profile Reports</h3>
                        {reportDetails.profileReports.map((report) => (
                            <div key={report._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                                <p><strong>Report ID:</strong> {report._id}</p>
                                <p><strong>Reporter:</strong> {report.reporter.username}</p>
                                <p><strong>Reason:</strong> {report.reason}</p>
                                <p><strong>Description:</strong> {report.description}</p>
                                <p><strong>Created At:</strong> {new Date(report.createdAt).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No profile reports available.</p>
                )}
                {reportDetails.auctionReports && reportDetails.auctionReports.length > 0 ? (
                    <div>
                        <h3>Auction Reports</h3>
                        {reportDetails.auctionReports.map((report) => (
                            <div key={report._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                                <p><strong>Report ID:</strong> {report._id}</p>
                                <p><strong>Reporter:</strong> {report.reporter.username}</p>
                                <p><strong>Auction Name:</strong> {report.auction.name}</p>
                                <p><strong>Reason:</strong> {report.reason}</p>
                                <p><strong>Description:</strong> {report.description}</p>
                                <p><strong>Created At:</strong> {new Date(report.createdAt).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No auction reports available.</p>
                )}
                {reportDetails.commentReports && reportDetails.commentReports.length > 0 ? (
                    <div>
                        <h3>Comment Reports</h3>
                        {reportDetails.commentReports.map((report) => (
                            <div key={report._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                                <p><strong>Report ID:</strong> {report._id}</p>
                                <p><strong>Reporter:</strong> {report.reporter.username}</p>
                                <p><strong>Comment:</strong> {report.comment.comment}</p>
                                <p><strong>Reason:</strong> {report.reason}</p>
                                <p><strong>Description:</strong> {report.description}</p>
                                <p><strong>Created At:</strong> {new Date(report.createdAt).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No comment reports available.</p>
                )}
            </div>
        ) : (
            <p>No report details available.</p>
        )}
    </Modal>
)}

        </>
    );
};

export default UsersTable;

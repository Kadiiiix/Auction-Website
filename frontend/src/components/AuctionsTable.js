import React, { useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Space, Modal, Pagination, message, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import axios from 'axios';

const AuctionsTable = () => {
    const [dataSource, setDataSource] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [open, setOpen] = useState(false);
    const [selectedAuction, setSelectedAuction] = useState(null);
    const searchInput = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [openReportsModal, setOpenReportsModal] = useState(false);


useEffect (() => {
    const fetchAuctions = async () => {
        try {
            const auctionsResponse = await axios.get("http://localhost:4000/api/auctions");
            const auctions = auctionsResponse.data;
    
            // Fetch user data for each auction
            const transformedData = await Promise.all(auctions.map(async auction => {
                // Fetch user data
                const userResponse = await axios.get(`http://localhost:4000/api/users/${auction.createdBy}`);
                const userData = userResponse.data;
    
                // Fetch auction reports
                const auctionReportsResponse = await axios.get(`http://localhost:4000/api/report/reports/auction/all/${auction._id}`);
                const totalAuctionReports = auctionReportsResponse.data.totalReports;
    
                return {
                    key: auction._id,
                    auctionId: auction._id,
                    name: auction.name,
                    createdBy: userData.username, // Use username from user data
                    closingDate: auction.closingDate,
                    condition: auction.condition,
                    category: auction.category,
                    additionalPhotos: auction.additionalPhotos,
                    startingBid: auction.startingBid,
                    description: auction.description,
                    location: auction.location,
                    age: auction.age,
                    likedBy: auction.likedBy,
                    highestBid: auction.highestBid,
                    highestBidder: auction.highestBidder,
                    bidderIds: auction.bidderIds,
                    createdAt: auction.createdAt,
                    totalAuctionReports: totalAuctionReports, // Add total auction reports
                    auctionReports: auctionReportsResponse.data.auctionReports // Add auction reports
                };
            }));
    
            setDataSource(transformedData);
            setTotalItems(transformedData.length);
        } catch (error) {
            console.error('Error fetching auction data:', error);
        }
    };
    fetchAuctions();
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

    const showModal = (auction) => {
        setSelectedAuction(auction);
        setOpen(true);
    };

    const handleOk = () => {
        setOpen(false);
        setSelectedAuction(null);
    };

    const handleCancel = () => {
        setOpen(false);
        setSelectedAuction(null);
    };

    const handleReportsModalOk = () => {
        setOpenReportsModal(false);
        setSelectedAuction(null);
    };
    
    const handleReportsModalCancel = () => {
        setOpenReportsModal(false);
        setSelectedAuction(null);
    };
    

    const handleDelete = async () => {
        try {
            // Delete the auction
            await axios.delete(`http://localhost:4000/api/auctions/${selectedAuction.auctionId}`);
            message.success('Auction deleted successfully.');
            
            // Close the modal and clear selected auction
            setOpen(false);
            setSelectedAuction(null);
    
            // Fetch updated auction data
            const auctionsResponse = await axios.get("http://localhost:4000/api/auctions");
            const auctions = auctionsResponse.data;
    
            // Fetch user data for each auction
            const transformedData = await Promise.all(auctions.map(async auction => {
                // Fetch user data
                const userResponse = await axios.get(`http://localhost:4000/api/users/${auction.createdBy}`);
                const userData = userResponse.data;

                return {
                    key: auction._id,
                    auctionId: auction._id,
                    name: auction.name,
                    createdBy: userData.username, // Use username from user data
                    closingDate: auction.closingDate,
                    condition: auction.condition,
                    category: auction.category,
                    additionalPhotos: auction.additionalPhotos,
                    startingBid: auction.startingBid,
                    description: auction.description,
                    location: auction.location,
                    age: auction.age,
                    likedBy: auction.likedBy,
                    highestBid: auction.highestBid,
                    highestBidder: auction.highestBidder,
                    bidderIds: auction.bidderIds,
                    createdAt: auction.createdAt
                };
            }));
    
            setDataSource(transformedData);
        } catch (error) {
            console.error('Error deleting auction:', error);
            message.error('Failed to delete auction.');
        }
    };

    const showAuctionReportsModal = (auction) => {
        setSelectedAuction(auction);
        setOpenReportsModal(true);
    };
    
    
    const columns = [
        {
            title: 'Auction ID',
            dataIndex: 'auctionId',
            key: 'auctionId',
            ...getColumnSearchProps('auctionId'),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Created By',
            dataIndex: 'createdBy',
            key: 'createdBy',
            ...getColumnSearchProps('createdBy'),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Status',
            dataIndex: 'closingDate',
            key: 'closingDate',
            render: (closingDate) => {
                const isPast = new Date(closingDate) < new Date();
                return (
                    <Tag color={isPast ? 'red' : 'green'}>
                        {isPast ? 'Closed' : 'Ongoing'}
                    </Tag>
                );
            },
            align: 'center',
        },
        {
            title: 'Closing Date',
            dataIndex: 'closingDate',
            key: 'closingDate',
            render: (closingDate) => {
                const formattedClosingDate = new Date(closingDate).toLocaleString(); // Convert UTC to local time
                return (
                     <p>{formattedClosingDate}</p>
                    
                );
            },
            

        },
        {
            title: 'Highest Bid',
            dataIndex: 'highestBid',
            key: 'highestBid',
        },
        {
            title: 'Number of bidders',
            dataIndex: 'bidderIds',
            key: 'bidderIds',
            render: (bidderIds) => {
                return (
                    <p>{bidderIds.length}</p>
                );
            },
        },
        {
            title: 'Total Reports',
            dataIndex: 'totalReports',
            key: 'totalReports',
            render: (text, record) => (
                <Button type="link" onClick={() => showAuctionReportsModal(record)}>
                    <p>({record.totalAuctionReports}) View Reports</p>
                </Button>
            ),
            align: 'center',
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
        
                {selectedAuction && (
                    <Modal
                        visible={open}
                        title="Auction Details"
                        onOk={handleOk}
                        onCancel={handleCancel}
                        footer={[
                            <Button key="delete" type="primary" danger onClick={handleDelete}>
                                Delete Auction
                            </Button>,
                            <Button key="cancel" onClick={handleCancel}>
                                Cancel
                            </Button>,
                        ]}
                    >
                        <p><strong>Name:</strong> {selectedAuction.name}</p>
                        <p><strong>Created By:</strong> {selectedAuction.createdBy}</p>
                        <p><strong>Created At:</strong> {Date(selectedAuction.createdAt).toLocaleString()}</p>
                        <p><strong>Closing Date:</strong> {Date(selectedAuction.closingDate).toLocaleString()}</p>
                        <p><strong>Condition:</strong> {selectedAuction.condition}</p>
                        <p><strong>Category:</strong> {selectedAuction.category}</p>
                        <p><strong>Description:</strong> {selectedAuction.description}</p>
                        <p><strong>Starting Bid:</strong> {selectedAuction.startingBid}</p>
                        <p><strong>Highest Bid:</strong> {selectedAuction.highestBid}</p>
                        <p><strong>Location:</strong> {selectedAuction.location}</p>
                        <p><strong>Number of likes:</strong> {selectedAuction.likedBy.length}</p>
                        <p><strong>Number of bidders:</strong> {selectedAuction.bidderIds.length}</p>
                        {/* Add other fields as needed */}
                    </Modal>
                )}

{selectedAuction && (
    <Modal
        visible={openReportsModal}
        title="Auction Reports"
        onOk={handleReportsModalOk}
        onCancel={handleReportsModalCancel}
        footer={[
            <Button key="ok" onClick={handleReportsModalOk}>
                OK
            </Button>,
        ]}
    >
        {selectedAuction.auctionReports && selectedAuction.auctionReports.length > 0 ? (
            <div>
                <p><strong>Total Reports:</strong> {selectedAuction.totalAuctionReports}</p>
                {selectedAuction.auctionReports.map((report) => (
                    <div key={report._id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #f0f0f0', borderRadius: '5px', backgroundColor: '#fafafa' }}>
                        <p><strong>Report ID:</strong> {report._id}</p>
                        <p><strong>Reporter:</strong> {report.reporter.username}</p>
                        <p><strong>Reason:</strong> {report.reason}</p>
                        <p><strong>Description:</strong> {report.description}</p>
                        <p><strong>Created At:</strong> {new Date(report.createdAt).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        ) : (
            <p>No report details available.</p>
        )}
    </Modal>
)}

            </>
        );
    };
    
    export default AuctionsTable;
    
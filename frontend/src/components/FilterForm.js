import React, { useState, useEffect } from "react"; // Added useEffect here
import { PlusOutlined } from "@ant-design/icons";
import {
  Layout,
  theme,
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Checkbox,
  Button,
  InputNumber,
} from "antd";
import "../design/FilterForm.css";
import axios from "axios";
import { useLocation } from "react-router-dom";

const { Sider } = Layout;
const { RangePicker } = DatePicker;
const { Option } = Select;

const AuctionFilterForm = ({ onFilter }) => {

  const categories = [
    { id: 1, name: "Antiques" },
    { id: 2, name: "Artwork" },
    { id: 3, name: "Books & Movies" },
    { id: 4, name: "Clothes" },
    { id: 5, name: "Collectibles" },
    { id: 6, name: "Decorative Items" },
    { id: 7, name: "Electronics" },
    { id: 8, name: "Footwear" },
    { id: 9, name: "Furniture" },
    { id: 10, name: "Health & Beauty" },
    { id: 11, name: "Jewelry" },
    { id: 12, name: "Miscellaneous" },
    { id: 13, name: "Musical Instruments" },
    { id: 14, name: "Outdoor Gear" },
    { id: 15, name: "Pet Supplies" },
    { id: 16, name: "Tools & Equipment" },
    { id: 17, name: "Vehicles" },
    { id: 18, name: "Video Games" },
  ];
  const [filterCriteria, setFilterCriteria] = useState({
    condition: "",
    category: "",
    startDate: "",
    endDate: "",
    location: "",
    maxPrice: "",
  });
  
 const PageLocation = useLocation();

  const handleFilter = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/auctions/filter",
        filterCriteria
      );
      onFilter(response.data);
    } catch (error) {
      console.error("Error filtering auctions:", error);
    }
  };

  const updateFilterCriteria = (name, value) => {
    setFilterCriteria((prevCriteria) => ({
      ...prevCriteria,
      [name]: value,
    }));
  };


  const resetFilters = async () => {
    const emptyCriteria = {
      condition: "",
      category: "",
      startDate: "",
      endDate: "",
      location: "",
      maxPrice: "",
    };
    setFilterCriteria(emptyCriteria);
    try {
      const response = await axios.get("http://localhost:4000/api/auctions");
      onFilter(response.data);
    } catch (error) {
      console.error("Error fetching all auctions:", error);
    }
  };

  return (
    <div className="sidebar-content" style={{ margin: "32px 16px 16px 16px" }}>
      <Form layout="vertical">
        <Form.Item label="Condition">
          <Radio.Group
            onChange={(e) => updateFilterCriteria("condition", e.target.value)}
          >
            <Radio value="new"> New </Radio>
            <Radio value="used"> Used </Radio>
          </Radio.Group>
        </Form.Item>

        {PageLocation.pathname.includes("category") || (
          <Form.Item label="Category">
            <Select
              placeholder="Category"
              onChange={(value) => updateFilterCriteria("category", value)}
            >
              {categories.map((category) => (
                <Option key={category.id} value={category.name}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item label="Date Range">
          <RangePicker
            placeholder={["Start Date", "End Date"]}
            onChange={(dates) => {
              updateFilterCriteria("startDate", dates[0]);
              updateFilterCriteria("endDate", dates[1]);
            }}
          />
        </Form.Item>

        <Form.Item label="Location">
          <Input
            placeholder="Enter location"
            onChange={(e) => updateFilterCriteria("location", e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Maximum price">
          <InputNumber
            defaultValue={0} // Set a default value if needed
            onChange={(value) => updateFilterCriteria("maxPrice", value)}
          />
        </Form.Item>
        <Button
          type="primary"
          className="default-button"
          onClick={handleFilter}
        >
          Apply Filters
        </Button>
        <div>
          <br></br>
        </div>
        <Button danger onClick={resetFilters}>
          Reset Filters
        </Button>
      </Form>
    </div>
  );
};

const FilterForm = ({ onFilter }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.pageYOffset;
      if (currentPosition >= window.innerHeight * 0.05) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <Layout
      className="sidebar"
      style={{
        position: "fixed",
      }}
    >
      <Sider
        width="20%"
        style={{
          background: colorBgContainer,
          top: isScrolled ? "calc(7% - 100px)" : "0%" , // Adjust the top value accordingly
          transition: "top 0.0s ease",
        }}
      >
        {!collapsed && <AuctionFilterForm onFilter={onFilter} />}
      </Sider>
    </Layout>
  );
};

export default FilterForm;

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
    { id: 10, name: "Health and Beauty" },
    { id: 11, name: "Jewelry" },
    { id: 12, name: "Misceellaneous" },
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
    instantPurchase: false,
    location: "",
    maxPrice: "",
  });

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
      instantPurchase: undefined,
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

        <Form.Item label="Date Range">
          <RangePicker
            placeholder={["Start Date", "End Date"]}
            onChange={(dates) => {
              updateFilterCriteria("startDate", dates[0]);
              updateFilterCriteria("endDate", dates[1]);
            }}
          />
        </Form.Item>

        <Form.Item
          label="Instant Purchase"
          name="instantPurchase"
          valuePropName="checked"
        >
          <Checkbox
            onChange={(e) =>
              updateFilterCriteria("instantPurchase", e.target.checked)
            }
          >
            Instant Purchase
          </Checkbox>
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
        <Button onClick={handleFilter}>
          Apply Filters
        </Button>
        <Button onClick={resetFilters}>
          Reset Filters
        </Button>
      </Form>
    </div>
  );
};

const FilterForm = ({ onFilter }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
 

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
        }}
      >
        {!collapsed && <AuctionFilterForm onFilter={onFilter} />}
      </Sider>
    </Layout>
  );
};

export default FilterForm;

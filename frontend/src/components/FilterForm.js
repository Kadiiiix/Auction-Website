import React, { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Layout,
  theme,
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Slider,
  Checkbox,
  Button,
  InputNumber,
} from "antd";
import "../design/FilterForm.css";
import axios from "axios";
const { Sider } = Layout;
const { RangePicker } = DatePicker;
const { Option } = Select;

const AuctionFilterForm = ({ filterHandler }) => {
  const [filterCriteria, setFilterCriteria] = useState({
    condition: "",
    category: "",
    startDate: "",
    endDate: "",
    instantPurchase: undefined,
    location: "",
    maxPrice: "",
  });

  const handleFilter = () => {
    filterHandler(filterCriteria);
  };

  const updateFilterCriteria = (name, value) => {
    setFilterCriteria((prevCriteria) => ({
      ...prevCriteria,
      [name]: value,
    }));
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
            <Select.Option value="category1">Category 1</Select.Option>
            <Select.Option value="category2">Category 2</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Date Range">
          <RangePicker
            placeholder={["Start Date", "End Date"]}
            onChange={(dates) =>
              updateFilterCriteria("startDate", dates[0]) &&
              updateFilterCriteria("endDate", dates[1])
            }
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
        <Button onClick={handleFilter}>Apply Filters</Button>
      </Form>
    </div>
  );
};

const FilterForm = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [scrollToTop, setScrollToTop] = useState(false);
  const handleScroll = () => {
    const upperHeaderHeight =
      document.querySelector(".UpperHeader").offsetHeight;
    const sidebar = document.querySelector(".sidebar");
    const scrollY = window.scrollY || window.pageYOffset;

    if (scrollY > upperHeaderHeight) {
      sidebar.style.top = "17.5%";
      setScrollToTop(false);
    } else {
      sidebar.style.top = "initial";
      setScrollToTop(true);
    }
  };

  window.addEventListener("scroll", handleScroll);

  // Add event listener for scroll events
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Layout
      class="sidebar"
      style={{
        position: "fixed",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width="20%"
        style={{
          background: colorBgContainer,
        }}
      >
        {!collapsed && <AuctionFilterForm />}
      </Sider>
    </Layout>
  );
};

export default FilterForm;

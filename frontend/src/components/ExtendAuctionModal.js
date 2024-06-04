import React from 'react';
import { Modal, Form, Input, Button, notification } from 'antd';
import axios from 'axios';
import { validateExtensionDays } from "../rulesEngine/auctionRules";

const ExtendAuctionModal = ({ auctionId, visible, setVisible }) => {
  const [form] = Form.useForm();

  const handleExtend = async (values) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/auctions/${auctionId}/extend`, {
        days: parseInt(values.days)
      });


      setVisible(false);
        notification.success({
          message: 'Extend Successful',
          description: 'You have successfully extended your auction.',
        });
    } catch (error) {
      console.error("Error extending auction:", error);
      notification.error({
        message: 'Extend Failed',
        description: 'Error extending auction.',
      });
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Modal
      title="Extend Auction"
      visible={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} onFinish={handleExtend}>
        <Form.Item
          label="Number of days to extend"
          name="days"
          rules={[
            {
              required: true,
              message: 'Please input the number of days to extend!',
            },
            {
              validator: validateExtensionDays, 
            },
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Extend
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExtendAuctionModal;

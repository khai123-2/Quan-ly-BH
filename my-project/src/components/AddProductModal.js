import React, { useContext } from "react";
import { Modal, Form, Input, InputNumber, DatePicker } from "antd";
import moment from "moment";
import { v4 as uuid } from "uuid";
import { AppContext } from "../context/AppProvider";
import { useForm } from "antd/lib/form/Form";
import api from "../api/products";
const dateFormat = "YYYY-MM-DD";
// const dateImport = moment().format(dateFormat);
const AddProductModal = () => {
  const {
    isModalVisible,
    setIsModalVisible,
    setProducts,
    products,
    selectedProductId,
    setSelectedProductId,
  } = useContext(AppContext);

  const [form] = useForm();

  let title = "Thêm sản phẩm";
  if (selectedProductId) {
    title = "Sửa sản phấm";
    const product = products.find((product) => {
      return product.id === selectedProductId;
    });

    form.setFieldsValue({
      ...product,
      dateImport: moment(product.date),
    });
  }
  /////
  const handleOk = async () => {
    const { dateImport } = form.getFieldValue();
    const date = dateImport.format(dateFormat);

    ///////
    if (selectedProductId) {
      const request = {
        ...form.getFieldValue(),
        id: selectedProductId,
        key: selectedProductId,
        dateImport: date,
      };
      const response = await api.put(`/products/${selectedProductId}`, request);
      const newProducts = products.map((product) => {
        return product.id === response.data.id ? response.data : product;
      });
      setProducts(newProducts);
      setSelectedProductId("");
      setIsModalVisible(false);
      form.resetFields();
      return;
    }

    const request = {
      ...form.getFieldValue(),
      id: uuid(),
      key: uuid(),
      dateImport: date,
    };
    const response = await api.post("/products", request);
    setProducts([...products, response.data]);
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedProductId("");
    setIsModalVisible(false);
  };

  return (
    <>
      <Modal
        title={title}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Form.Item
            label="Mã sản phẩm"
            name="codeProduct"
            rules={[{ required: true, message: "Nhập mã sản phẩm!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số lô"
            name="quantity"
            rules={[{ required: true, message: "Nhập số lô!" }]}
          >
            <InputNumber min={1} max={99999} />
          </Form.Item>
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Nhập tên sản phẩm!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Ngày nhập" name="dateImport">
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Giá nhập"
            name="cost"
            rules={[{ required: true, message: "Nhập giá nhập!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              addonAfter="VND"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item
            label="Giá bán"
            name="price"
            min={500}
            rules={[{ required: true, message: "Nhập giá bán!" }]}
          >
            <InputNumber
              min={500}
              style={{ width: "100%" }}
              addonAfter="VND"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddProductModal;

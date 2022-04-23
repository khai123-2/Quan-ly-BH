import React, { useContext } from "react";
import { Modal, Form, Input, InputNumber, DatePicker } from "antd";
import moment from "moment";
import { v4 as uuid } from "uuid";
import { AppContext } from "../context/AppProvider";
import { useForm } from "antd/lib/form/Form";
import api from "../api/products";
const dateFormat = "YYYY-MM-DD";
const dateExport = moment().format(dateFormat);

const AddProductModal = () => {
  const {
    selectedProductIdExport,
    setSelectedProductIdExport,
    isModalVisibleExport,
    setIsModalVisibleExport,
    setProducts,
    products,
  } = useContext(AppContext);

  const [form] = useForm();
  let sum = 0;
  if (selectedProductIdExport) {
    const product = products.find((product) => {
      return product.id === selectedProductIdExport;
    });
    sum = product.price * product.quantity;
    form.setFieldsValue({
      ...product,
      dateImport: moment(product.date),
      total: sum,
    });
  }
  /////
  const handleOk = async () => {
    const { dateImport } = form.getFieldValue();
    const date = dateImport.format(dateFormat);

    ///////
    if (selectedProductIdExport) {
      const request = {
        ...form.getFieldValue(),
        id: selectedProductIdExport,
        key: selectedProductIdExport,
        dateImport: date,
        dateOut: dateExport,
      };
      const response = await api.put(
        `/products/${selectedProductIdExport}`,
        request
      );
      const newProducts = products.map((product) => {
        return product.id === response.data.id ? response.data : product;
      });
      setProducts(newProducts);
      setSelectedProductIdExport("");
      setIsModalVisibleExport(false);
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
    setIsModalVisibleExport(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisibleExport(false);
    form.resetFields();
  };

  return (
    <>
      <Modal
        title="Xuất kho"
        visible={isModalVisibleExport}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Form.Item label="Mã sản phẩm" name="codeProduct">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Số lô" name="quantity">
            <InputNumber min={1} max={99999} disabled />
          </Form.Item>
          <Form.Item label="Tên sản phẩm" name="name">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Ngày nhập" name="dateImport">
            <DatePicker disabled />
          </Form.Item>
          <Form.Item label="Giá bán" name="price">
            <InputNumber
              style={{ width: "100%" }}
              addonAfter="VND"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              disabled
            />
          </Form.Item>
          <Form.Item label="Tổng" name="total">
            <InputNumber
              style={{ width: "100%" }}
              addonAfter="VND"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              disabled
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddProductModal;

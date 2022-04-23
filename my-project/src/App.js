import React, { useContext, useEffect, useState } from "react";
import { Table, Space, Button, Form, Input, Slider, Typography } from "antd";
import AddProductModal from "./components/AddProductModal";
import ExportProductModal from "./components/ExportProductModal";
import { PlusOutlined, FilterOutlined } from "@ant-design/icons";
import { AppContext } from "./context/AppProvider";
import api from "./api/products";
import "./App.css";
const App = () => {
  const {
    setSelectedProductIdExport,
    setIsModalVisibleExport,
    setIsModalVisible,
    products,
    setProducts,
    setSelectedProductId,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
  } = useContext(AppContext);

  const [price, setPrice] = useState(0);
  const handleOnChange = (value) => {
    setPrice(value);
  };

  const handleFilter = () => {
    const productsFilter = products.filter((product) => {
      return product.dateOut === undefined;
    });

    const sortProductList = productsFilter.sort((a, b) => {
      return (
        new Date(b.dateImport).valueOf() - new Date(a.dateImport).valueOf()
      );
    });
    setProducts(sortProductList);
  };

  const handleExport = (id) => {
    setSelectedProductIdExport(id);
    setIsModalVisibleExport(true);
  };

  const handleReset = () => {
    const getAllContracts = async () => {
      const allProducts = await retrieveProducts();
      if (allProducts) {
        setProducts(allProducts);

        const sortProduct = allProducts.sort((a, b) => {
          return a.price - b.price;
        });
        setMinPrice(sortProduct[0].price);
        setMaxPrice(sortProduct[sortProduct.length - 1].price);
        setPrice(minPrice);
      }
    };
    getAllContracts();
  };

  const handleSearch = () => {
    const productFilter = products.filter((product) => {
      return product.price >= parseInt(price, 10);
    });
    setProducts(productFilter);
  };
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);

    const newProductList = products.filter((product) => {
      return product.id !== id;
    });
    setProducts(newProductList);
  };

  const handleUpdate = async (id) => {
    setSelectedProductId(id);
    setIsModalVisible(true);
  };

  const retrieveProducts = async () => {
    const response = await api.get("/products");
    return response.data;
  };

  useEffect(() => {
    const getAllContracts = async () => {
      const allProducts = await retrieveProducts();
      if (allProducts) {
        setProducts(allProducts);

        const sortProduct = allProducts.sort((a, b) => {
          return a.price - b.price;
        });
        setMinPrice(sortProduct[0].price);
        setMaxPrice(sortProduct[sortProduct.length - 1].price);
      }
    };
    getAllContracts();
  }, []);

  function formatter(value) {
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  // console.log(test);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Mã",
      dataIndex: "codeProduct",
      key: "codeProduct",
    },
    {
      title: "Số lô",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Tên sản phẩm ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá nhập",
      key: "cost",
      dataIndex: "cost",
    },
    {
      title: "Giá bán",
      key: "price",
      dataIndex: "price",
    },
    {
      title: "Ngày nhập",
      key: "dateImport",
      dataIndex: "dateImport",
    },
    {
      title: "Ngày xuất",
      key: "dateOut",
      dataIndex: "dateOut",
    },
    {
      title: "Acton",
      key: "action",
      dataIndex: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            size="small"
            type="link"
            onClick={() => handleUpdate(record.id)}
          >
            Sửa
          </Button>
          <Button
            danger
            size="small"
            type="link"
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
          <Button
            onClick={() => handleExport(record.id)}
            size="small"
            type="link"
          >
            Bán
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="App">
      <div>
        <ExportProductModal />
      </div>
      <div>
        <AddProductModal />
      </div>
      <div className="header">
        <Typography.Title level={1}>Quản lý kho hàng</Typography.Title>
      </div>
      <div className="table-Seacrh">
        <Form
          className="custom-form"
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
        >
          <Form.Item label="Price" name="price">
            {/* <Input allowClear style={{ width: 300 }} /> */}
            <Slider
              tipFormatter={formatter}
              onChange={handleOnChange}
              min={minPrice}
              max={maxPrice}
              defaultValue={price}
              style={{ width: "400px" }}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={handleReset}>Reset</Button>
              <Button onClick={handleSearch} type="primary">
                Seacrh
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
      <div className="table-content">
        <div className="table-content-add">
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
              {" "}
              Thêm sản phẩm
            </Button>
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={handleFilter}
            >
              {" "}
              Lọc hàng tồn
            </Button>
          </Space>
        </div>
        <div className="table-content-list">
          <Table columns={columns} dataSource={products} scroll={{ y: 300 }} />
        </div>
      </div>
    </div>
  );
};

export default App;

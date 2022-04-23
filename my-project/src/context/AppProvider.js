import React, { useState } from "react";

export const AppContext = React.createContext();

export const AppProvider = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleExport, setIsModalVisibleExport] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProductIdExport, setSelectedProductIdExport] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  return (
    <AppContext.Provider
      value={{
        selectedProductIdExport,
        setSelectedProductIdExport,
        isModalVisibleExport,
        setIsModalVisibleExport,
        isModalVisible,
        setIsModalVisible,
        products,
        setProducts,
        selectedProductId,
        setSelectedProductId,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

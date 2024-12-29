import { useState } from "react";
import { useEth } from "./contexts/EthContext";
import "./styles.css";

function MainComp() {
  const {
    state: { contract, accounts },
  } = useEth();

  const [productData, setProductData] = useState({
    name: "",
    price: "",
    description: "",
    reqtemp: "",
    manufacturing: "",
  });

  const [workerData, setWorkerData] = useState({ name: "" });

  const [statusData, setStatusData] = useState({
    location: "",
    temp: "",
    humidity: "",
    heatindex: "",
    wid: "",
    pid: "",
    total_quantity: "",
    flag: false,
  });

  const [dataInfo, setDataInfo] = useState({
    temp: "",
    humidity: "",
    hindex: "",
    pid: "",
  });

  const [products, setProducts] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const fetchProducts = async () => {
    try {
      const productList = await contract.methods.getProducts().call();
      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchWorkers = async () => {
    try {
      const workerList = await contract.methods.getWorkerssList().call();
      setWorkers(workerList);
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

  const fetchProductStatus = async (productId) => {
    try {
      const productStatuses = await contract.methods.getProductStatus(productId).call();
      setStatuses(productStatuses);
    } catch (error) {
      console.error("Error fetching product statuses:", error);
    }
  };

  const handleAddWorker = async () => {
    try {
      await contract.methods.setWorker(workerData.name).send({ from: accounts[0] });
      alert("Worker added successfully!");
    } catch (error) {
      console.error("Error adding worker:", error);
    }
  };

  const handleAddProduct = async () => {
    const { name, price, description, reqtemp, manufacturing } = productData;
    try {
      await contract.methods
        .AddProduct(name, price, description, reqtemp, manufacturing)
        .send({ from: accounts[0] });
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleAddStatus = async () => {
    const { location, temp, humidity, heatindex, wid, pid, total_quantity, flag } = statusData;
    try {
      await contract.methods
        .AddStatus(location, temp, humidity, heatindex, wid, pid, total_quantity, flag)
        .send({ from: accounts[0] });
      alert("Status added successfully!");
    } catch (error) {
      console.error("Error adding status:", error);
    }
  };

  const handleAddData = async () => {
    const { temp, humidity, hindex, pid } = dataInfo;
    try {
      await contract.methods.AddData(temp, humidity, hindex, pid).send({ from: accounts[0] });
      alert("Data added successfully!");
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  return (
    <div id="App">
      <div className="container">
        <h1>Supply Chain DApp</h1>

        <div className="form-section">
          <h2>Add Worker</h2>
          <input
            placeholder="Name"
            onChange={(e) => setWorkerData({ ...workerData, name: e.target.value })}
          />
          <button onClick={handleAddWorker}>Add Worker</button>
        </div>

        <div className="form-section">
          <h2>Add Product</h2>
          <input
            placeholder="Name"
            onChange={(e) => setProductData({ ...productData, name: e.target.value })}
          />
          <input
            placeholder="Price"
            onChange={(e) => setProductData({ ...productData, price: e.target.value })}
          />
          <input
            placeholder="Description"
            onChange={(e) => setProductData({ ...productData, description: e.target.value })}
          />
          <input
            placeholder="Required Temperature"
            onChange={(e) => setProductData({ ...productData, reqtemp: e.target.value })}
          />
          <input
            placeholder="Manufacturing Date"
            onChange={(e) => setProductData({ ...productData, manufacturing: e.target.value })}
          />
          <button onClick={handleAddProduct}>Add Product</button>
        </div>

        <div className="form-section">
          <h2>Add Status</h2>
          <input
            placeholder="Location"
            onChange={(e) => setStatusData({ ...statusData, location: e.target.value })}
          />
          <input
            placeholder="Temperature"
            onChange={(e) => setStatusData({ ...statusData, temp: e.target.value })}
          />
          <input
            placeholder="Humidity"
            onChange={(e) => setStatusData({ ...statusData, humidity: e.target.value })}
          />
          <input
            placeholder="Heat Index"
            onChange={(e) => setStatusData({ ...statusData, heatindex: e.target.value })}
          />
          <input
            placeholder="Worker ID"
            onChange={(e) => setStatusData({ ...statusData, wid: e.target.value })}
          />
          <input
            placeholder="Product ID"
            onChange={(e) => setStatusData({ ...statusData, pid: e.target.value })}
          />
          <input
            placeholder="Total Quantity"
            onChange={(e) => setStatusData({ ...statusData, total_quantity: e.target.value })}
          />
          <button onClick={handleAddStatus}>Add Status</button>
        </div>

        <div className="form-section">
          <h2>Add Data</h2>
          <input
            placeholder="Temperature"
            onChange={(e) => setDataInfo({ ...dataInfo, temp: e.target.value })}
          />
          <input
            placeholder="Humidity"
            onChange={(e) => setDataInfo({ ...dataInfo, humidity: e.target.value })}
          />
          <input
            placeholder="Heat Index"
            onChange={(e) => setDataInfo({ ...dataInfo, hindex: e.target.value })}
          />
          <input
            placeholder="Product ID"
            onChange={(e) => setDataInfo({ ...dataInfo, pid: e.target.value })}
          />
          <button onClick={handleAddData}>Add Data</button>
        </div>

        <div className="list-section">
          <h2>Products</h2>
          <button onClick={fetchProducts}>View All Products</button>
          <ul>
            {products.map((product, index) => (
              <li key={index}>
                ID: {product.id}, Name: {product.name}, Price: {product.price}, Description: {product.description}
              </li>
            ))}
          </ul>
        </div>

        <div className="list-section">
          <h2>Workers</h2>
          <button onClick={fetchWorkers}>View All Workers</button>
          <ul>
            {workers.map((worker, index) => (
              <li key={index}>
                ID: {worker.id}, Name: {worker.name}, Timestamp: {worker.timestamp}
              </li>
            ))}
          </ul>
        </div>

        <div className="list-section">
          <h2>Statuses</h2>
          <input
            placeholder="Product ID"
            onChange={(e) => fetchProductStatus(e.target.value)}
          />
          <ul>
            {statuses.map((status, index) => (
              <li key={index}>
                Location: {status.location}, Temp: {status.temp}, Humidity: {status.humidity}, Quantity: {status.total_quantity}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MainComp;

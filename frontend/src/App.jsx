import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Pembelian from "./pages/Pembelian";
import Penjualan from "./pages/Penjualan";
import Pengembalian from "./pages/Pengembelian";

function App() {
  const [message, setMessage] = useState("");

    /*
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);
    */

  return (
    <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/pembelian" element={ <Pembelian /> } />
        <Route path="/penjualan" element={ <Penjualan /> } />
        <Route path="/pengembalian" element={ <Pengembalian /> } />
    </Routes>
  );
}

export default App;

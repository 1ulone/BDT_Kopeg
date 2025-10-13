import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Pembelian from "./pages/Pembelian";
import Penjualan from "./pages/Penjualan";
import Pengembalian from "./pages/Pengembelian";
import { AnimatePresence } from "framer-motion";

function App() {

    return (
        <AnimatePresence mode="wait">
            <Routes>
                <Route path="/" element={ <Home /> } />
                <Route path="/pembelian" element={ <Pembelian /> } />
                <Route path="/penjualan" element={ <Penjualan /> } />
                <Route path="/pengembalian" element={ <Pengembalian /> } />
            </Routes>
        </AnimatePresence>
    );
}

export default App;

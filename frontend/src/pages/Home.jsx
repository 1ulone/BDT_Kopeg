import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Table from "../components/Table";

export default function Home() {
  const [data, setData] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/pembelian")
            .then((res) => res.json())
            .then((data) => setData(data.data));
    }, []);

    return (
        <Navbar>
            <div className="bg-white rounded-lg shadow-lg px-8 py-4">
                <p className="text-2xl">Dashboard</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 my-6">
                <div>
                    <p className="text-xl">Transaksi terbaru (5 Bulan)</p>
                    <Table 
                        headData={[ "Kode", "Nama", "Jumlah", "Harga Total", "Bulan" ]}
                        mainData={data}
                    />
                </div>
            </div>
        </Navbar>
    )
}

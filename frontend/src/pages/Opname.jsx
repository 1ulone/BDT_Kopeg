import { useEffect, useMemo, useState } from "react"
import Navbar from "../components/Navbar"
import OpnameTable from "../components/OpnameTable";

export default function Opname() {
    const [data, setData] = useState([]);
    const [file, setFile] = useState(null);
    const [type, setType] = useState(0);

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("http://backend-production-5484.up.railway.app/opname/check", {
                method: "POST",
                body: formData,
            });
            const result = await res.json();
            console.log(result.data);
            setData(result.data);
        } catch (err) {
            console.error("Error:", err);
        }
    }

    const handleCSVFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFile(file);
        }
    }

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/opname?dbase=${0}`)
            .then((res) => res.json())
            .then((data) => setData(data.data));
    }, []);

    const changeType = (e) => {
        fetch(`http://127.0.0.1:8000/opname?dbase=${e}`)
            .then((res) => res.json())
            .then((data) => setData(data.data));

    }

    return (
        <Navbar>
            <div className="flex flex-col justify-between bg-white rounded-lg my-4 px-2 shadow-lg">
                <p className="text-2xl m-4">Check Produk Opname</p>
                <div className="flex gap-4 my-4 p-2 py-4">
                    <button className="button" onClick={() => changeType(0)}>Pembelian</button>
                    <button className="button" onClick={() => changeType(1)}>Penjualan</button>
                </div>
            </div>

            <OpnameTable 
                headData={[ "Kode", "Nama", "Stock", "Stock Fisik", "Selisih", "Bulan" ]}
                mainData={data}
                handleSubmit={handleSubmit}
                handleCSV={handleCSVFile}
                file={file}
            />
        </Navbar>
    )
}

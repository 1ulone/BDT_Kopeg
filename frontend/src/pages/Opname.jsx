import { useEffect, useMemo, useState } from "react"
import Navbar from "../components/Navbar"
import Table from "../components/Table";

export default function Opname() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");

    const filteredData = useMemo(() => {
        if (!data)
            return [];

        return data.filter(d => {
            const matchesNameSearch = d.Nama_Item.toLowerCase().includes(search.toLowerCase());
            const matchesKodeSearch = d.Kode_Item.toString().includes(search.toLowerCase());
            return matchesNameSearch || matchesKodeSearch;
        });
    }, [data, search]);

    const handleCSVFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFile(file);
        }
    }

    useEffect(() => {
        fetch("http://127.0.0.1:8000/pembelian")
            .then((res) => res.json())
            .then((data) => setData(data.data));
    }, []);

    return (
        <Navbar>
            <p className="text-xl">Check Produk Opname</p>
            <div className=" flex items-center text-center justify-between mx-4">
                <input type="text" className="p-4 bg-gray-300 w-3/5 mx-auto m-4 rounded-lg" placeholder="Cari Produk..." onChange={(e)=> { setSearch(e.target.value); }}/>
                <input type="file" className="button" hidden id="csv" onChange={handleCSVFile} accept=".csv" />
                <label className="button" for="csv"> Cek Opname dari .csv </label>
            </div>
            <Table 
                headData={[ "Kode", "Nama", "Jumlah", "Stock Fisik", "Selisih" ]}
                mainData={filteredData.slice(0, 20)}
            />
        </Navbar>
    )
}

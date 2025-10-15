import { useEffect, useMemo, useState } from "react"
import Navbar from "../components/Navbar"
import OpnameTable from "../components/OpnameTable";

export default function Opname() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [file, setFile] = useState(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const pageLimit = 20;

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

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("http://localhost:8000/opname/check", {
                method: "POST",
                body: formData,
            });
            const result = await res.json();
            console.log(result.data);
            setData(result.data);
            setTotal(result.total_produk);
        } catch (err) {
            console.error("Error:", err);
        }
    }

    useEffect(() => {
        fetch("http://127.0.0.1:8000/opname/")
            .then((res) => res.json())
            .then((data) => setData(data.data));
    }, []);

    const totalPages = Math.ceil(filteredData.length / pageLimit);
    const start = (page - 1) * pageLimit;
    const end = start + pageLimit;
    const pageData = filteredData.slice(start, end);

    useEffect(() => setPage(1), [search]);

    return (
        <Navbar>
            <p className="text-xl">Check Produk Opname</p>
            <div className=" flex items-center text-center justify-between mx-4">
                <input type="text" className="p-4 bg-gray-300 w-3/5 mx-auto m-4 rounded-lg" placeholder="Cari Produk..." onChange={(e)=> { setSearch(e.target.value); }}/>
                <div className="flex gap-4">
                    <input type="file" className="button" hidden id="csv" onChange={handleCSVFile} accept=".csv" />
                    <label className="button" htmlFor="csv"> Upload .csv </label>
                    <button className="button" onClick={handleSubmit} disabled={file==null}>Refresh Data</button>
                </div>
            </div>
            <OpnameTable 
                headData={[ "Kode", "Nama", "Jumlah", "Stock Fisik", "Selisih" ]}
                mainData={pageData}
            />

            <div className="flex items-center justify-between mt-4">
                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span> Page {page} of {totalPages} </span>

                <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page >= totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </Navbar>
    )
}

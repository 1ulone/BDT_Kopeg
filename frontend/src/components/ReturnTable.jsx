import { useMemo, useState } from "react";

export default function ReturnTable({ headData, mainData, extraClass }) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [bulan, setBulan] = useState("");
    const pageLimit = 20;

    const contentClass = (i) => {
        return i % 2 === 0 ? "content_odd" : "content_even";
    }

    const formatCurrency = (amt) => {
        if (typeof amt === "string") return amt;
        if (!amt && amt !== 0) return 0;
        if (amt === 0) return 0;
        return `Rp ${new Intl.NumberFormat("id-ID").format(amt)}`
    }

    const filteredData = useMemo(() => {
        if (!mainData)
            return [];

        return mainData.filter(d => {
            const matchesNameSearch = d.Nama_Item.toLowerCase().includes(search.toLowerCase());
            const matchesKodeSearch = d.Kode_Item.toString().includes(search.toLowerCase());
            const matchesBulan = d.Bulan.toLowerCase().includes(bulan.toLowerCase());
            return (matchesNameSearch || matchesKodeSearch) && matchesBulan;
        });
    }, [mainData, search]);

    const totalPages = Math.ceil(filteredData.length / pageLimit);
    const start = (page - 1) * pageLimit;
    const end = start + pageLimit;
    const pageData = filteredData.slice(start, end);

    return (
        <>
            <div className="py-4 w-full flex justify-between">
                <input type="text" className="p-4 bg-gray-300 w-3/5 rounded-full" placeholder="Cari Produk..." onChange={(e)=> { setSearch(e.target.value); }}/>
                <select className="select_option w-fit" onChange={(e) => setBulan(e.target.value)}>
                    <option value="">-- pilih bulan --</option>
                    <option value="januari">Januari</option>
                    <option value="februari">februari</option>
                    <option value="maret">maret</option>
                    <option value="april">april</option>
                    <option value="juni">juni</option>
                    <option value="juli">juli</option>
                    <option value="agustus">agustus</option>
                    <option value="september">september</option>
                    <option value="oktober">oktober</option>
                    <option value="november">november</option>
                    <option value="desember">desember</option>
                </select>
            </div>
            <div className={"flex"+ extraClass}>
                <div className="flex bg-gray-800 rounded-xl my-1">
                    {headData.map((head, index) => (
                        <div key={index} className="w-full px-2 py-4 text-white text-center"> 
                            {head} 
                        </div>
                    ))}
                </div>
                <div className="flex flex-col">
                    {pageData.map((data, index) => (
                        <div key={index} className={contentClass(index)}>
                            <p> {data.Kode_Item} </p>
                            <p> {data.Nama_Item} </p>
                            <p> {data.Jml} {data.Satuan} </p>
                            <p> {formatCurrency(data.Total_Harga)} </p>
                            <p> {data.Potongan} </p>
                            <p> {data.Bulan} {data.Tahun} </p>
                        </div>
                    ))}
                </div>
            </div>

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
        </>
    )
}

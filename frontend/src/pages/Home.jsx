import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import { Bar, Line } from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend);

export default function Home() {
    const [data, setData] = useState({top_items: [], least_items: [], total_per_bulan: [], penjualan: [], pembelian:[], profit:[], profit_per_bulan:[]});
    const [prediction, setPrediction] = useState([]);
    const [month, setMonth] = useState("");
    const [search, setSearch] = useState("");
    const [searchP, setSearchP] = useState("");
    const [bulan, setBulan] = useState("");

    useEffect(() => {
        fetch("http://127.0.0.1:8000/statistik")
            .then((res) => res.json())
            .then((data) => setData({
                top_items: data.top_items,
                least_items: data.least_items,
                total_per_bulan: data.total_per_bulan,
                penjualan: data.penjualan,
                pembelian: data.pembelian,
                profit: data.profit,
                profit_per_bulan: data.profit_per_bulan,
            }));
    }, []);

    const monthOrder = [
        "JANUARI",
        "FEBRUARI",
        "MARET",
        "APRIL",
        "MEI",
        "JUNI",
        "JULI",
        "AGUSTUS",
        "SEPTEMBER",
        "OKTOBER",
        "NOVEMBER",
        "DECEMBER"
    ];

    const sorted = data.total_per_bulan
        .filter(d => monthOrder.includes(d.Bulan.toUpperCase()))
        .sort((a, b) => monthOrder.indexOf(a.Bulan.toUpperCase()) - monthOrder.indexOf(b.Bulan.toUpperCase()));

    const handlePredict = async () => {
        await fetch("http://127.0.0.1:8000/predict/")
            .then((res) => res.json())
            .then((data) => { 
                setPrediction(data.data);
                setMonth(data.nextMonth.predicted_month);
            });

    }

    const filteredPrediction = useMemo(() => {
        if (!prediction)
            return [];

        return prediction.filter(d => {
            const matchesNameSearch = d.Nama_Item.toLowerCase().includes(search.toLowerCase());
            const matchesKodeSearch = d.Kode_Item.toString().includes(search.toLowerCase());
            return matchesNameSearch || matchesKodeSearch;
        }).slice(0,10);
    }, [prediction, search]);

    const filteredPembelian = useMemo(() => {
        if (!data.pembelian)
            return [];

        return data.pembelian.filter(d => {
            const matchesNameSearch = d.Nama_Item.toLowerCase().includes(searchP.toLowerCase());
            return matchesNameSearch;
        });
    }, [data.pembelian, searchP]);

    const filteredPenjualan = useMemo(() => {
        if (!data.penjualan)
            return [];

        return data.penjualan.filter(d => {
            const matchesNameSearch = d.Nama_Item.toLowerCase().includes(searchP.toLowerCase());
            return matchesNameSearch;
        });
    }, [data.penjualan, searchP]);

    const filteredProfit = useMemo(() => {
        return data.profit_per_bulan.filter(d => {
            const matchesNameSearch = d.Bulan.toLowerCase().includes(bulan.toLowerCase());
            return matchesNameSearch;
        });
    }, [data.profit_per_bulan, bulan])

    const revisedPembelian = filteredPembelian.slice(0, 10);
    const revisedPenjualan = filteredPenjualan.slice(0, 10);

    return (
        <Navbar>
            <div className="bg-white rounded-lg shadow-lg px-8 py-4">
                <p className="text-2xl">Dashboard</p>
            </div>

            <div className="w-[90%] bg-white p-8 rounded-xl shadow-lg mx-auto my-12 flex flex-col">
                <div className="flex justify-between">
                    <p>Keuntungan Per bulan</p>

                    <select className="select_option w-fit" onChange={(e) => setBulan(e.target.value)}>
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

                <div className="flex gap-4 my-8">
                    {filteredProfit.map((d, i)=> (
                        <div className="flex flex-col bg-white rounded-xl shadow-md w-1/4 h-1/4 p-4">
                            <p className="text-black text-2xl">{d.Bulan}</p>
                            <p className="text-black text-xl">{d.Profit} %</p>
                        </div>
                    ))}
                </div>
                {console.log(filteredProfit)}
            </div>

            <div className="w-[90%] bg-white p-8 rounded-xl shadow-lg mx-auto my-12 flex flex-col">
                <p>Data Penjualan per bulan</p>
                <Line
                    data={{
                        labels: sorted.map((d) => d.Bulan),
                        datasets: [
                            {
                                label: "Count",
                                data: sorted.map((d) => d.Total_Harga),
                                borderColor: "rgba(54, 162, 235, 1)",
                                backgroundColor: "rgba(54, 162, 235, 0.3)",
                                tension: 0.3,           
                                fill: true,             
                                pointRadius: 5,         
                                pointHoverRadius: 8,   
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: { position: "top" },
                            title: { display: true, text: "Jumlah per Item" },
                        },
                        scales: {
                            x: {
                                title: { display: true, text: "Nama Item" },
                            },
                            y: {
                                title: { display: true, text: "Jumlah" },
                                beginAtZero: true,
                            },
                        },
                    }}
                />
            </div>

            <div className="w-[90%] bg-white p-8 rounded-xl shadow-lg flex flex-col mx-auto my-12">
                <p>Perbandingan Penjualan dan Perbandingan</p>
                <input type="text" className="p-4 bg-gray-300 w-3/5 mx-auto m-4 rounded-lg" placeholder="Cari Produk..." onChange={(e)=> { setSearchP(e.target.value); }}/>
                <Bar
                    data={{
                        labels: revisedPenjualan.map((d) => d.Nama_Item),

                        datasets: [
                            {
                                label: "Penjualan",
                                data: revisedPenjualan.map((d) => d.Jumlah),
                                backgroundColor: "rgba(54, 162, 235, 0.6)",
                                borderRadius: 8,
                            },
                            {
                                label: "Pembelian",
                                data: revisedPembelian.map((d) => d.Jumlah),
                                backgroundColor: "rgba(255, 99, 132, 0.6)",
                                borderRadius: 8,
                            },
                        ],
                    }}
                    options={{
                        maintainAspectRatio: true,
                        responsive: true,
                        plugins: {
                            legend: { position: "top" },
                            title: {
                                display: true,
                                text: "Perbandingan Jumlah Penjualan dan Pembelian",
                                font: { size: 16 },
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: { display: true, text: "Jumlah (PCS)" },
                            },
                        },
                    }}
                    height={128}
                />
            </div>

            <div className="w-[90%] bg-white p-8 rounded-xl shadow-lg mx-auto my-12 flex flex-col">
                <p>Produk Terlaris</p>
                <Table 
                    headData={[ "Kode", "Nama", "Jumlah", "Harga Total", "Bulan" ]}
                    mainData={data.top_items}
                    extraClass="mx-auto"
                    searchFeature={false}
                />

                <p className="mt-12">Produk yang paling Tidak diminati</p>
                <Table 
                    headData={[ "Kode", "Nama", "Jumlah", "Harga Total", "Bulan" ]}
                    mainData={data.least_items}
                    extraClass="mx-auto"
                    searchFeature={false}
                />
            </div>

            <div className="w-[90%] bg-white p-8 rounded-xl shadow-lg mx-auto my-12 flex flex-col gap-12">
                <div className=" flex items-center gap-12">
                    <p>Prediksi Produk Terlaris untuk bulan selanjutnya.</p>
                    <button className="button" onClick={handlePredict}>Mulai Prediksi</button>
                </div>
                {prediction[0]!=null && (
                    <div className="flex justify-start flex-col gap-4">
                        <p className="text-xl">Prediksi penjualan untuk bulan {month}</p>
                        <input type="text" className="p-4 bg-gray-300 w-3/5 m-4 rounded-full" placeholder="Cari Produk..." onChange={(e)=> { setSearch(e.target.value); }}/>
                        <Bar 
                            data={{
                                labels: filteredPrediction.map((d) => d.Nama_Item),
                                datasets: [
                                    {
                                        label: "Prediksi Penjualan",
                                        data: filteredPrediction.map((d) => d.Prediksi_Penjualan),
                                        backgroundColor: "rgba(54, 162, 235, 0.6)",
                                    },
                                ],
                            }} 
                            options= {{
                                indexAxis: "y", 
                                responsive: true,
                                plugins: {
                                    legend: { position: "top" },
                                    title: {
                                        display: true,
                                        text: "Prediksi Penjualan Produk",
                                    },
                                },
                                scales: {
                                    x: {
                                        title: { display: true, text: "Prediksi Penjualan" },
                                    },
                                    y: {
                                        title: { display: true, text: "Nama Item" },
                                    },
                                },
                            }} 
                        />
                    </div>
                )}
            </div>
        </Navbar>
    )
}

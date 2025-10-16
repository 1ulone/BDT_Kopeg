import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import { Bar, Doughnut, Line } from "react-chartjs-2";

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
    const [data, setData] = useState({total_per_jenis: [], jumlah_per_jenis: [], top_items: [], total_per_bulan: [], total_per_tahun: []});
    const [prediction, setPrediction] = useState([]);
    const [month, setMonth] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("http://127.0.0.1:8000/pembelian/statistik")
            .then((res) => res.json())
            .then((data) => setData({
                total_per_jenis: data.total_per_jenis,
                jumlah_per_jenis: data.jumlah_per_jenis,
                top_items: data.top_items,
                total_per_bulan: data.total_per_bulan,
                total_per_tahun: data.total_per_tahun,
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
        });
    }, [prediction, search]);

    return (
        <Navbar>
            <div className="bg-white rounded-lg shadow-lg px-8 py-4">
                <p className="text-2xl">Dashboard</p>
            </div>

            <div className="flex justify-around m-4 mt-12">
                <div className="w-1/2 bg-white p-8 rounded-xl shadow-lg">
                    <p>Pembelian Terbanyak</p>
                    <Bar 
                        data={{
                            labels: data.total_per_jenis.map((d) => d.Jenis),
                            datasets: [
                                {
                                    label:"Jumlah",
                                    data: data.total_per_jenis.map((d) => d.Total_Harga),
                                },
                            ],
                        }}
                        options={{ maintainAspectRatio: true, responsive: true }}
                    />
                </div>

                <div className="w-1/3 h-fit bg-white p-8 rounded-xl shadow-lg">
                    <Doughnut 
                        data={{
                            labels: data.total_per_tahun.map((d) => d.Tahun),
                            datasets: [
                                {
                                    label:"Count",
                                    data: data.total_per_tahun.map((d) => d.Total_Harga),
                                    backgroundColor: [
                                        "#32a852",
                                        "#b526a0",
                                        "#b51235",
                                        "#e0c422",
                                        "#48e8e0",
                                    ],
                                },
                            ]
                        }}
                        options={{ maintainAspectRatio: true, responsive: true }}
                    />
                </div>
            </div>

            <div className="w-[90%] bg-white p-8 rounded-xl shadow-lg mx-auto my-12">
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

            <div className="w-[90%] bg-white p-8 rounded-xl shadow-lg mx-auto my-12 flex flex-col">
                <Table 
                    headData={[ "Kode", "Nama", "Jumlah", "Harga Total", "Bulan" ]}
                    mainData={data.top_items}
                    extraClass="mx-auto"
                />
            </div>

            <div className="w-[90%] bg-white p-8 rounded-xl shadow-lg mx-auto my-12 flex flex-col gap-12">
                <div className=" flex items-center gap-12">
                    <p>Prediksi Produk Terlaris untuk bulan selanjutnya.</p>
                    <button className="button" onClick={handlePredict}>Mulai Prediksi</button>
                </div>
                <div className="flex justify-around flex-col gap-4">
                    {month!=null && (<p className="text-xl">Prediksi penjualan untuk bulan {month}</p>)}
                    <input type="text" className="p-4 bg-gray-300 w-3/5 mx-auto m-4 rounded-lg" placeholder="Cari Produk..." onChange={(e)=> { setSearch(e.target.value); }}/>
                    {prediction[0]!=null && (
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
                    )}
                </div>
            </div>
        </Navbar>
    )
}

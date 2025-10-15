import { useEffect, useState } from "react";
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

    return (
        <Navbar>
        {console.log(data)}
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
        </Navbar>
    )
}

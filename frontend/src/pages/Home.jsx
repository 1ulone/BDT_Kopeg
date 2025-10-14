import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import { Bar, Doughnut, Line } from "react-chartjs-2";

// ✅ Required for Chart.js v3+
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
    const [data, setData] = useState([
        { Kode_Item:0, Nama_Item:"Andre", Jenis:"", Jumlah:8, Satuan:"", Total_Harga:0, Bulan:"", Tahun:2025, },
        { Kode_Item:0, Nama_Item:"Andre", Jenis:"", Jumlah:15, Satuan:"", Total_Harga:0, Bulan:"", Tahun:2025, },
        { Kode_Item:0, Nama_Item:"Andre", Jenis:"", Jumlah:20, Satuan:"", Total_Harga:0, Bulan:"", Tahun:2025, },
        { Kode_Item:0, Nama_Item:"Andre", Jenis:"", Jumlah:32, Satuan:"", Total_Harga:0, Bulan:"", Tahun:2025, },
        { Kode_Item:0, Nama_Item:"Andre", Jenis:"", Jumlah:14, Satuan:"", Total_Harga:0, Bulan:"", Tahun:2025, },
    ]);

        /*
    useEffect(() => {
        fetch("http://127.0.0.1:8000/pembelian")
            .then((res) => res.json())
            .then((data) => setData(data.data));
    }, []);
        */

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
                            labels: data.map((d) => d.Nama_Item),
                            datasets: [
                                {
                                    label:"Count",
                                    data: data.map((d) => d.Jumlah),
                                },
                            ],
                        }}
                        options={{ maintainAspectRatio: true, responsive: true }}
                    />
                </div>

                <div className="w-1/3 h-fit bg-white p-8 rounded-xl shadow-lg">
                    <Doughnut 
                        data={{
                            labels: data.map((d) => d.Nama_Item),
                            datasets: [
                                {
                                    label:"Count",
                                    data: data.map((d) => d.Jumlah),
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
                        labels: data.map((d) => d.Nama_Item),
                        datasets: [
                            {
                                label: "Count",
                                data: data.map((d) => d.Jumlah),
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

            <div className="w-[90%] bg-white p-8 rounded-xl shadow-lg mx-auto my-12">
                <Table 
                    headData={[ "Kode", "Nama", "Jumlah", "Harga Total", "Bulan" ]}
                    mainData={data}
                    extraClass="mx-auto"
                />
            </div>
        </Navbar>
    )
}

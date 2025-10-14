import { useState } from "react";
import Navbar from "../components/Navbar";
import TextInput from "../components/TextInput"
import { useNavigate } from "react-router-dom";
import BulanInput from "../components/BulanInput";

export default function Pengembalian() {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    const [data, setData] = useState({
        No:0,
        Kode_Item:0,
        Nama_Item:"",
        Jml:0,
        Satuan:"",
        Harga:0,
        Potongan:0,
        Total_Harga:0,
        Bulan:"",
        Tahun:currentYear,
    })
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log(data);
            await fetch("http://localhost:8000/pengembalian/", {
            method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            navigate("/");
        } catch (err) {
            console.error("Error:", err);
        }
    }

    return (
        <Navbar>
            <div className="flex justify-between items-center bg-white rounded-lg my-4 p-2 shadow-lg">
                <p className="text-2xl">Input Laporan Pengembalian Barang</p>
                <button className="button">
                    Import dari .csv 
                </button>
            </div>

            <form className="bg-white w-full rounded-lg px-12 py-8 shadow-xl mx-auto" onSubmit={handleSubmit}>
                <div className="w-[75%] mx-auto relative pb-16">
                    <TextInput 
                        title="No"
                        type="number"
                        values={data.No}
                        onChange={(e)=> setData(prev=> ({...prev, No:e.target.value})) }
                    />
                    <TextInput 
                        title="Kode Item"
                        type="number"
                        values={data.Kode_Item}
                        onChange={(e)=> setData(prev=> ({...prev, Kode_Item:e.target.value})) }
                    />
                    <TextInput 
                        title="Nama Item"
                        values={data.Nama_Item}
                        onChange={(e)=> setData(prev=> ({...prev, Nama_Item:e.target.value})) }
                    />
                    <TextInput 
                        title="Jumlah"
                        type="number"
                        values={data.Jml}
                        onChange={(e)=> setData(prev=> ({...prev, Jml:e.target.value})) }
                    />
                    <TextInput 
                        title="Satuan"
                        values={data.Satuan}
                        onChange={(e)=> setData(prev=> ({...prev, Satuan:e.target.value})) }
                    />
                    <TextInput 
                        title="Harga"
                        type="number"
                        values={data.Harga}
                        onChange={(e)=> setData(prev=> ({...prev, Harga:e.target.value})) }
                    />
                    <TextInput 
                        title="Potongan"
                        type="number"
                        values={data.Potongan}
                        onChange={(e)=> setData(prev=> ({...prev, Potongan:e.target.value})) }
                    />
                    <TextInput 
                        title="Total Harga"
                        type="number"
                        values={data.Total_Harga}
                        onChange={(e)=> setData(prev=> ({...prev, Total_Harga:e.target.value})) }
                    />
                    <BulanInput 
                        title="Bulan"
                        values={data.Bulan}
                        onChange={(e)=> setData(prev=> ({...prev, Bulan:e.target.value})) }
                    />
                    <TextInput 
                        title="Tahun"
                        values={data.Tahun}
                        defaultValue={currentYear}
                        onChange={(e)=> setData(prev=> ({...prev, Tahun:e.target.value})) }
                    />

                    <div className="absolute right-2 bottom-0">
                        <button type="submit" className="button w-fit ml-auto">Submit</button>
                    </div>
                </div>

            </form>
        </Navbar>
    )
}

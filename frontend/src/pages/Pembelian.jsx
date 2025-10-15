import { useState } from "react";
import Navbar from "../components/Navbar";
import TextInput from "../components/TextInput"
import { useNavigate } from "react-router-dom";
import BulanInput from "../components/BulanInput";

export default function Pembelian() {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();
    const [file, setFile] = useState(null);

    const [data, setData] = useState({
        Kode_Item:0,
        Nama_Item:"",
        Jenis:"",
        Jumlah:0,
        Satuan:"",
        Total_Harga:0,
        Bulan:"",
        Tahun:currentYear,
    })
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (file == null) 
        {
            try {
                console.log(data);
                await fetch("http://localhost:8000/pembelian/", {
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
        } else {
            try {
                const formData = new FormData();
                formData.append("file", file);

                await fetch("http://localhost:8000/pembelian/upload-csv", {
                    method: "POST",
                    body: formData,
                });
                navigate("/");
            } catch (err) {
                console.error("Error:", err);
            }
        }

    }

    const handleCSVFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFile(file);
        }
    }

    return (
        <Navbar>
            <div className="flex justify-between items-center bg-white rounded-lg my-4 p-2 shadow-lg">
                <p className="text-2xl">Input data Transaksi Pembelian</p>
                <div className="flex flex-col text-center">
                    <input type="file" className="button" hidden id="csv" onChange={handleCSVFile} accept=".csv" />
                    <label className="button" for="csv"> Import dari .csv </label>
                    {file != null && (<p>{file.name}</p>) }
                </div>
            </div>

            <form className="bg-white w-full rounded-lg px-12 py-8 shadow-xl mx-auto" onSubmit={handleSubmit}>
                <div className="w-[75%] mx-auto relative pb-16">
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
                        title="Jenis"
                        values={data.Jenis}
                        onChange={(e)=> setData(prev=> ({...prev, Jenis:e.target.value})) }
                    />
                    <TextInput 
                        title="Jumlah"
                        type="number"
                        values={data.Jumlah}
                        onChange={(e)=> setData(prev=> ({...prev, Jumlah:e.target.value})) }
                    />
                    <TextInput 
                        title="Satuan"
                        values={data.Satuan}
                        onChange={(e)=> setData(prev=> ({...prev, Satuan:e.target.value})) }
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

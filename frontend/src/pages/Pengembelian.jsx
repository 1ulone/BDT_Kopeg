import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TextInput from "../components/TextInput"
import { useNavigate } from "react-router-dom";
import BulanInput from "../components/BulanInput";
import ReturnTable from "../components/ReturnTable";

export default function Pengembalian() {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();
    const [file, setFile] = useState(null);
    const [s, setS] = useState("table");
    const [pdata, setpData] = useState([]);

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
    
    useEffect(()=> {
        if (s=="input") return;

        fetch("http://127.0.0.1:8000/pengembalian")
            .then((res) => res.json())
            .then((data) => setpData(data.data));
    });

    const handleChangeState = async () => {
        if (s=="input") return;
        fetch("http://127.0.0.1:8000/pengembalian")
            .then((res) => res.json())
            .then((data) => setpData(data.data));
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (file == null) 
        {
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
        } else {
            try {
                const formData = new FormData();
                formData.append("file", file);

                await fetch("http://localhost:8000/pengembalian/upload-csv", {
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

    const manualInput = () => {
        return (s=="input" && (
            <div className="bg-white w-full rounded-lg mx-auto shadow-xl">
                <form className="px-12 py-8 " onSubmit={handleSubmit}>
                    <div className="w-full px-8 relative pb-16">

                        <div className="flex flex-col text-center">
                            <input type="file" className="button" hidden id="csv" onChange={handleCSVFile} accept=".csv" />
                            <label className="button" htmlFor="csv"> Import dari .csv </label>
                            {file != null && (<p>{file.name}</p>)}
                        </div>

                        <div className="flex gap-4 my-8 items-center">
                            <BulanInput 
                                title="Bulan"
                                values={data.Bulan}
                                onChange={(e)=> setData(prev=> ({...prev, Bulan:e.target.value})) }
                            />
                            <div className="w-fit flex flex-col my-4">
                                <p className="text-xl">Tahun</p>
                                <input 
                                    type="text"
                                    className={"bg-gray-white border-gray-300 border-2 rounded-full py-2 px-4 w-1/2 text-xl"}
                                    values={data.Tahun}
                                    defaultValue={currentYear}
                                    onChange={(e)=> setData(prev=> ({...prev, Tahun:e.target.value})) }
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 my-8">
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
                        </div>

                        <div className="flex gap-4 my-8">
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
                        </div>

                        <div className="flex gap-4 my-8">
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
                        </div>

                        <div className="flex gap-4 my-8">
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
                        </div>

                        <div className="absolute right-2 bottom-0">
                            <button type="submit" className="button w-fit ml-auto">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    )}

    const tableList = () => {
        return(s=="table" && (
            <>
                <ReturnTable 
                    headData={["Kode", "Nama", "Jumlah", "Harga Total", "Potongan", "Periode"]}
                    mainData={pdata}
                />
           </>
        ))
    }

    const [download, setDownload] = useState(false)
    const [downBulan, setDownBulan] = useState("");
    const bulanOpt = () => {
        return (download && (
            <div className="absolute bg-black/60 flex w-full h-screen top-0 left-0">
                <div className="bg-white w-1/2 h-fit mx-auto mt-48 p-12 rounded-xl">
                    <BulanInput 
                        title="Bulan apa yang ingin di download?"
                        onChange={(e) => setDownBulan(e.target.value)}
                        disabled={downBulan=="year"}
                    />
                    <input type="checkbox" id="checkbox" onChange={(e)=> { if (e.target.checked) { setDownBulan("year") } else { setDownBulan("") } }} />
                    <label htmlFor="checkbox" > Download 1 tahun </label>

                    {downBulan=="" ? (
                        <button className="button" disabled>Download</button>
                    ) : (
                        <a 
                            className="button" 
                            href={`http://127.0.0.1:8000/pengembalian/export?bulan=${downBulan}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Download
                        </a>
                    )}
                    <button className="button" onClick={()=> setDownload(false)}>Kembali</button>
                </div>
            </div>
        ))
    }

    return (
        <Navbar>
            {bulanOpt()}
            <div className="flex flex-col justify-between bg-white rounded-lg my-4 px-2 shadow-lg">
                <p className="text-2xl m-4">Input data Pengembalian Barang</p>
                <div className="flex gap-4 my-4 p-2 py-4">

                    <button className="button" onClick={()=> { setS("table"); handleChangeState(); }}>List</button>
                    <button className="button" onClick={()=> { setS("input"); }}>Input</button>
                    <button className="button" onClick={()=> setDownload(true)} > Download CSV </button>
                </div>
            </div>


            {tableList()}
            {manualInput()}
        </Navbar>
    )
}

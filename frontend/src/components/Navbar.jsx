import { useState } from "react"
import { Link } from "react-router-dom";

export default function Navbar({ children }) {
    const [onShow, setOnShow] = useState(false);
        
    return (
        <>  
            <div className="flex justify-between text-center items-center sticky shadow-md py-2 px-1">
                <button onClick={() => setOnShow(!onShow)}>
                    <i className="bi bi-list text-4xl p-2"></i>
                </button>
                <p className="text-4xl p-2">KOPEG</p>
            </div>
            <>

                {onShow && (
                    <div className="bg-black/25 w-screen z-10 absolute h-full">
                        <div className="bg-white h-full flex flex-col w-1/4 mx-left p-4 gap-3 text-2xl">
                            <Link to="/pembelian" className="border-t-2 border-b-2 border-gray-200 py-4 hover:bg-gray-200 ease-in-out duration-400 text-center">
                                Input Transaksi
                            </Link>
                            <Link to="/penjualan" className="border-t-2 border-b-2 border-gray-200 py-4 hover:bg-gray-200 ease-in-out duration-400 text-center">
                                Input Laporan Re-Stock</Link>
                            <Link to="/pengembalian" className="border-t-2 border-b-2 border-gray-200 py-4 hover:bg-gray-200 ease-in-out duration-400 text-center">
                                Input Laporan Pengembalian Barang
                            </Link>
                        </div>
                    </div>
                )}

                <div className="p-4 bg-gray-50">
                    {children}
                </div>
            </>
        </>
    )
}

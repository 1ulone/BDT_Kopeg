import { useState } from "react"
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar({ children }) {
    const [onShow, setOnShow] = useState(false);

    const anim = {
        visible:{ x:0, opacity: 1, display:"block", duration:0.25, ease: "easeInOut", delay:0.4  },
        hidden: { x:-50, opacity:0, display:"none", duration:0.25, ease: "easeInOut", delay:0.4 },
    }
        
    return (
        <div className="flex bg-green-900 main-font">  
            <motion.div 
                className={`h-screen flex flex-col p-4 gap-12 text-white ${onShow ? "w-1/4 text-start" : "w-fit text-center mx-auto"}`}
                initial={{ width:"7%" }}
                animate={{ width: onShow ? "45%" : "7%" }}
                transition={onShow ? { duration:0.5, ease: ["backOut"] } : { duration:0.5, ease: ["backIn"] } }
            >
                <Link 
                    to="/" 
                    className="p-2 bg-gray-50 rounded-xl flex text-black items-center justify-center w-full"
                >
                    <motion.img src="kopeg.svg" className="w-20"/> 
                    <motion.p 
                        className="mx-4 text-2xl font-bold" 
                        variants={anim} 
                        initial="hidden" 
                        animate={onShow ? "visible" : "hidden"}
                    >
                        KOPEG
                    </motion.p>
                </Link>

                <Link to="/" className="py-2 px-4 hover:bg-green-300/50 ease-in-out duration-400 text-xl rounded-lg flex">
                    <i className="bi bi-diagram-2 ml-2.5" /> 
                    <motion.p variants={anim} initial="hidden" animate={onShow ? "visible" : "hidden"} className="pl-2" >
                        Dashboard
                    </motion.p>
                </Link>

                <Link to="/pembelian" className="py-2 px-4 hover:bg-green-300/50 ease-in-out duration-400 text-xl rounded-lg flex">
                    <i className="bi bi-cart-plus ml-2.5" /> 
                    <motion.p variants={anim} initial="hidden" animate={onShow ? "visible" : "hidden"} className="pl-2">
                        Transaksi Pembelian
                    </motion.p>
                </Link>

                <Link to="/penjualan" className="py-2 px-4 hover:bg-green-300/50 ease-in-out duration-400 text-xl rounded-lg flex">
                    <i className="bi bi-journal-plus ml-2.5" /> 
                    <motion.p variants={anim} initial="hidden" animate={onShow ? "visible" : "hidden"} className="pl-2">
                        Transaksi Penjualan
                    </motion.p>
                </Link>

                <Link to="/pengembalian" className="py-2 px-4 hover:bg-green-300/50 ease-in-out duration-400 text-xl rounded-lg flex">
                    <i className="bi bi-cart-x ml-2.5" /> 
                    <motion.p variants={anim} initial="hidden" animate={onShow ? "visible" : "hidden"} className="pl-2">
                        Pengembalian Barang
                    </motion.p>
                </Link>

                <Link to="/opname" className="py-2 px-4 hover:bg-green-300/50 ease-in-out duration-400 text-xl rounded-lg flex">
                    <i className="bi bi-journal-check ml-2.5" /> 
                    <motion.p variants={anim} initial="hidden" animate={onShow ? "visible" : "hidden"} className="pl-2">
                        Cek Stock of Opname
                    </motion.p>
                </Link>

                <button className="py-2 px-7 hover:bg-green-300/50 ease-in-out duration-400 text-xl rounded-lg w-fit" onClick={()=> setOnShow(!onShow)}>
                    <i className="bi bi-layout-sidebar" />
                </button>
            </motion.div>
            <div className="m-4 p-4 bg-gray-50 rounded-lg w-full">
                {children}
            </div>
        </div>
    )
}

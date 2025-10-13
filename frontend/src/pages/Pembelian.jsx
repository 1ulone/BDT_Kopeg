import Navbar from "../components/Navbar";
import TextInput from "../components/TextInput"

export default function Pembelian() {
    
    const handleSubmit = async => {

    }

    return (
        <Navbar>
            <div className="flex justify-between items-center bg-white rounded-lg my-4 p-2 shadow-lg">
                <p className="text-2xl">Input data Transaksi Pembelian</p>
                <button className="button">
                    Import dari .csv 
                </button>
            </div>

            <form className="bg-white w-full rounded-lg px-12 py-8 shadow-xl mx-auto" onSubmit={handleSubmit}>
                <div className="w-[75%] mx-auto relative pb-16">
                    <TextInput title="Kode Item"/>
                    <TextInput title="Nama Item"/>
                    <TextInput title="Jenis"/>
                    <TextInput title="Satuan"/>
                    <TextInput title="Total Harga"/>
                    <TextInput title="Bulan"/>
                    <TextInput title="Tahun"/>

                    <div className="absolute right-2 bottom-0">
                        <button type="submit" className="button w-fit ml-auto">Submit</button>
                    </div>
                </div>

            </form>
        </Navbar>
    )
}

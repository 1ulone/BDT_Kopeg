export default function Table({ headData, mainData, extraClass }) {
    const contentClass = (i) => {
        return i % 2 === 0 ? "content_odd" : "content_even";
    }

    return (
        <>
            <table className={extraClass}>
                <tr>
                    {headData.map((head, index) => (
                        <td key={index} className="w-1/6 px-2 py-4 border-white border-x-4 bg-gray-800 text-white text-center"> 
                            {head} 
                        </td>
                    ))}
                </tr>
                {mainData.map((data, index) => (
                    <tr key={index}>
                        <td className={contentClass(index)}> {data.Kode_Item} </td>
                        <td className={contentClass(index)}> {data.Nama_Item} </td>
                        <td className={contentClass(index)}> {data.Jumlah} {data.Satuan} </td>
                        <td className={contentClass(index)}> Rp. {data.Total_Harga},00 </td>
                        <td className={contentClass(index)}> {data.Bulan} {data.Tahun} </td>
                    </tr>
                ))}
            </table>
        </>
    )
}

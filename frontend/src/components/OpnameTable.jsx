export default function OpnameTable({ headData, mainData, extraClass }) {
    const contentClass = (i) => {
        return i % 2 === 0 ? "content_odd" : "content_even";
    }

    return (
        <>
            <table className={extraClass}>
                <thead>
                    <tr>
                        {headData.map((head, index) => (
                            <td key={index} className="w-1/6 px-2 py-4 border-white border-x-4 bg-gray-800 text-white text-center"> 
                                {head} 
                            </td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {mainData.map((data, index) => (
                        <tr key={index}>
                            <td className={contentClass(index)}> {data.Kode_Item} </td>
                            <td className={contentClass(index)}> {data.Nama_Item} </td>
                            <td className={contentClass(index)}> {data.Jumlah==null ? data.Jumlah_lama : data.Jumlah} {data.Satuan} </td>
                            <td className={contentClass(index)}> {data.Stock_Fisik ?? 0} {data.Satuan} </td>
                            <td className={contentClass(index)}> {data.Selisih ?? 0} </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

import { forwardRef, useRef } from "react";

export default forwardRef(function BulanInput({ title, ...props }, ref) {
    const input = ref ? ref : useRef();

    return (
        <div className="w-full flex flex-col">
            <p className="text-2xl pb-1">{title}</p>
            <select 
                className="border-2 border-gray-400 rounded-md shadow-md px-2 py-1 w-full text-xl"
                ref={input}
                {...props}
            >
                <option value="Januari">Januari</option>
                <option value="Februari">Februari</option>
                <option value="Maret">Maret</option>
                <option value="April">April</option>
                <option value="Mei">Mei</option>
                <option value="Juni">Juni</option>
                <option value="Juli">Juli</option>
                <option value="Agustus">Agustus</option>
                <option value="September">September</option>
                <option value="Oktober">Oktober</option>
                <option value="November">November</option>
                <option value="December">December</option>
            </select>
        </div>
    )
})

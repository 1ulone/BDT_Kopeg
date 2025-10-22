import { forwardRef, useRef } from "react";

export default forwardRef(function BulanInput({ title, ...props }, ref) {
    const input = ref ? ref : useRef();

    return (
        <div className="w-fit flex flex-col my-4">
            <p className="text-2xl pb-1">{title}</p>
            <select 
                className="text-xl px-12 py-2 text-black bg-white rounded-full hover:text-gray-400 duration-300 ease-in-out disabled:bg-gray-600 disabled:text-gray-400 border-2 border-gray-300"
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

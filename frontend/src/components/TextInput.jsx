import { forwardRef, useRef } from "react";

export default forwardRef(function TextInput({ title, type, ...props }, ref) {
    const input = ref ? ref: useRef();

    return (
        <div className="w-full flex flex-col">
            <p className="text-2xl pb-1">{title}</p>
            <input 
                type={type}
                ref={input}
                className={"border-2 border-gray-400 rounded-md shadow-md px-2 py-1 w-full" + props}
                placeholder=". . ."
            />
        </div>
    )
})

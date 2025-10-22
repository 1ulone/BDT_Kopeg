import { forwardRef, useRef } from "react";

export default forwardRef(function TextInput({ title, type, ...props }, ref) {
    const input = ref ? ref: useRef();

    return (
        <input 
            type={type}
            ref={input}
            className={"bg-white border-gray-300 border-2 rounded-full py-2 px-4 w-1/2 text-xl"}
            placeholder={title + "*"}
            {...props}
        />
    )
})

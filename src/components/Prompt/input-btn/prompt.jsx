//Prompt User

import Input from "./input.jsx";
import BtnSubmit from "./btn.jsx";
import { useState } from "react";

const PromptUser = () => {
    //Style Button | Visible or Hidden
    const [show, setShow] = useState("hidden");

    //OnClick | Hidden Button
    const handleClick = () => {
        setShow("visible");        
    }

    return (
        //OnClick | Hidden Button
        <div onClick={handleClick} onKeyDown={(key) => {if(key.key == "Enter") setShow("hidden")}} className="h-20 z-1 flex items-end fixed left-0 bottom-0 w-full" >

            <Input />
            <BtnSubmit show={show} client:only/>
        
        </div>
    )
}

export default PromptUser;
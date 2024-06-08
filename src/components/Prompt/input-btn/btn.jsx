//Show Icon Submit | Button Submit

import { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const BtnSubmit = ({show}) => {
    
    //Style Button 
    let style = `
        ${show == "visible" ? "visible" : "hidden"}
        absolute 
        bottom-10 
        right-0  
        hover:text-blue-700 
        rounded 
        text-blackfont-bold 
        py-2 
        px-4
        z-10
    `

    return (        
        //OnClick | Hidden Button
        <button onClick={() => {show = "hidden"}} type="submit" name="submit" className={style}>
            {/* Icon Submit | SVG - Heroicons */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
        </button>
    )
}

export default BtnSubmit;
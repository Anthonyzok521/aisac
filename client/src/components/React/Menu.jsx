//Show Icon Menu | Desktop or Mobile

import { useState, useEffect } from "react";

const Menu = ({ className }) => {
    
    //Responsive
    const [device, setDevice ] = useState(window.screen.width >= 768 ? "desktop" : "mobile");

    window.addEventListener("resize", () => {
        setDevice(window.screen.width >= 768 ? "desktop" : "mobile");
    });

    if (device === "mobile") {
        return (
            //Icon Menu | SVG - Heroicons
            <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
        )
    }
    return (
        //List Menu
        <ul className="flex gap-4">
            <li><h1 className="text-xl"><a href="/">Aisac</a></h1></li>
        </ul>
    )
}

export default Menu;
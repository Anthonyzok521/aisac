import { MdAutoAwesome } from "react-icons/md";
import React from 'react'

export const CleanStarts: React.FC = () => {
    return (
        <div className="absolute h-80 w-screen z-50 flex justify-center items-center md:left-[40rem] md:top-[15rem] bottom-[8rem]
    left-[-92px]" id="start">
            <div>
            <MdAutoAwesome className="absolute h-20 w-20 left-96 top-14 md:animate-bounce animate-ping opacity-50 text-white transition-all"/>
            <MdAutoAwesome className="absolute h-20 w-20 left-80 top-28 md:animate-bounce animate-ping opacity-50 text-white transition-all"/>
            <MdAutoAwesome className="absolute h-20 w-20 left-72 top-[-2rem] md:animate-bounce animate-ping opacity-50 text-white transition-all"/>
            <MdAutoAwesome className="absolute h-20 w-20 left-60 top-[-10rem] md:animate-bounce animate-ping opacity-50 text-white transition-all"/>
            <MdAutoAwesome className="absolute h-20 w-20 left-48 top-28 md:animate-bounce animate-ping opacity-50 text-white transition-all"/>
            <MdAutoAwesome className="absolute h-20 w-20 left-28 top-[-5rem] md:animate-bounce animate-ping opacity-50 text-white transition-all"/>
            </div>
        </div>
    )
}
import React from "react";
import { TbCoffee } from "react-icons/tb";
import { Link } from "react-router-dom";

export const Coffee: React.FC = () => {

  return (
    <Link to={import.meta.env.VITE_WS}
      target="_blank"
      id="coffee"
      className="flex justify-start items-center max-md:opacity-0 duration-100 hover:bg-slate-500 hover:cursor-pointer p-2 rounded-lg"
    >
      <div className="flex justify-center items-center gap-6">
        <div className="size-11 flex justify-center items-center">
          <TbCoffee className="text-white size-11 active:size-9 active:text-sky-500 transition-all md:hover:text-sky-500" />
        </div>

        {/* <span id="coffeText" className="text-white font-manrope font-extrabold transition-all select-none">
          Limpiar Chat
        </span> */}
      </div>
    </Link>
  );
}
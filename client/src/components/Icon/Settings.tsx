import React from "react";
import { IoSettingsSharp } from "react-icons/io5";

export const Settings: React.FC = () => {
  const handleClick = () => {};

  return (
    <div
      id="settings"
      className="flex items-center max-md:opacity-0 duration-100 hover:bg-slate-500 hover:cursor-pointer p-2 rounded-lg"
      onClick={handleClick}
    >
      <div className="flex justify-center items-center gap-6">
        <div className="size-9 flex justify-center items-center">
          <IoSettingsSharp className="text-white size-9 active:size-8 active:text-sky-500 transition-all md:hover:text-sky-500" />
        </div>

        <span id="settingsText" className="text-white font-manrope font-extrabold transition-all duration-300 select-none">
          Configuraciones
        </span>
      </div>
    </div>
  );
};

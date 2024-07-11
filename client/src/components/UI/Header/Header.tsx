import React from "react";
import { Profile } from "../../Icon/Profile";
import { Menu } from "../../Icon/Menu";

type Props = {
  device: string;
};

export const Header: React.FC<Props> = (props: Props) => {
  return (
    <header className="fixed top-0 p-4 w-full h-16 flex justify-between bg-slate-800 bg-opacity-10 backdrop-blur-sm">
      <div className="flex gap-20 items-center">
        <div className="w-3 h-full absolute left-0"></div>
        <Menu device={props.device} />
        <h1 id="title" className="text-white font-manrope font-extrabold uppercase max-md:hidden transition-all">Aisac</h1>
      </div>
      <Profile device={props.device} />
    </header>
  );
};

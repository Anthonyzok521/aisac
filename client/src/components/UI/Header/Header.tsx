import React from "react";
import { Profile } from "../../Icon/Profile";
import { Menu } from "../../Icon/Menu";

type Props = {
  device: string;
};

export const Header: React.FC<Props> = (props: Props) => {
  return (
    <header className="fixed top-0 p-4 w-full h-16 flex justify-between">      
        <Menu device={props.device}/><Profile device={props.device}/>
    </header>
  );
};
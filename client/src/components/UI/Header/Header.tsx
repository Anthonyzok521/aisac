import React from "react";
import { Nav } from "./Menu/Nav";
import { Aside } from "./Menu/Aside";

type Props = {
  device: string;
}

const Header: React.FC<Props> = (props: Props) => {
  return (
      <header className="relative p-2 bg-white w-full border-b-8">
        <Nav device={props.device} />
        <Aside device={props.device} />
      </header>
  );
};

export default Header;

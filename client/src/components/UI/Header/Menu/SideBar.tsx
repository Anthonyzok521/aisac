import React from "react";
import { Header } from "../Header";
import { Settings } from "../../../Icon/Settings";
import { FeedBack } from "../../../Icon/FeedBack";
import { CleanChat } from "../../../Icon/CleanChat";
import { Upload } from "../../../Icon/Upload";
import { Footer } from "../../Footer/Footer";

type Props = {
  device: string;
};

export const SideBar: React.FC<Props> = (props: Props) => {
  return (
    <nav id="sidebar" className="fixed flex flex-col justify-between h-dvh max-md:w-3 w-1/5 bg-slate-700  rounded-e-lg z-10 transition-all">
        <Header device={props.device} />
        <ul id="menu" className="flex flex-col pt-20 p-3 gap-10">
        <li><CleanChat /></li>        
        <li><Upload /></li>        
        <li><Settings /></li>        
        <li><FeedBack /></li>        
        </ul>
        <Footer />
    </nav>
  );
};

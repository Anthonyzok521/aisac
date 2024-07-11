import React, { useState } from "react";
import { RiMenuUnfold3Fill, RiMenuUnfold4Fill } from "react-icons/ri";

type Props = {
  device: string;
};

export const Menu: React.FC<Props> = (props: Props) => {
  const [click, setClick] = useState(false);

  const handleClick = (inPc: boolean) => {
    const title = document.querySelector("#title");
    const sidebar = document.querySelector("#sidebar");
    const footer = document.querySelector("#footer");
    //Icons
    const settings = document.querySelector("#settings");
    const feedback = document.querySelector("#feedback");
    const clean = document.querySelector("#clean");
    const upload = document.querySelector("#upload");
    const coffee = document.querySelector("#coffee");
    //Text Icons
    const settingsText = document.querySelector("#settingsText");
    const feedbackText = document.querySelector("#feedbackText");
    const cleanText = document.querySelector("#cleanText");
    const uploadText = document.querySelector("#uploadText");

    //Mobile
    if (!inPc) {
      if (sidebar?.classList.contains("max-md:w-9/12")) {
        sidebar?.classList.remove("max-md:w-9/12");
        sidebar?.classList.add("max-md:w-3");
        footer?.classList.remove("max-md:opacity-100");
        footer?.classList.add("max-md:opacity-0");
        settings?.classList.remove("max-md:opacity-100");
        feedback?.classList.remove("max-md:opacity-100");
        clean?.classList.remove("max-md:opacity-100");
        upload?.classList.remove("max-md:opacity-100");
        coffee?.classList.remove("max-md:opacity-100");
        title?.classList.toggle("max-md:hidden");
        return;
      }
      sidebar?.classList.remove("max-md:w-3");
      sidebar?.classList.add("max-md:w-9/12");
      footer?.classList.remove("max-md:opacity-0");
      footer?.classList.add("max-md:opacity-100");
      settings?.classList.add("max-md:opacity-100");
      feedback?.classList.add("max-md:opacity-100");
      clean?.classList.add("max-md:opacity-100");
      upload?.classList.add("max-md:opacity-100");
      coffee?.classList.add("max-md:opacity-100");
      title?.classList.toggle("max-md:hidden");
    }

    //Desktop
    if (inPc) {
      if (!sidebar?.classList.contains("w-20")) {
        sidebar?.classList.remove("w-1/5");
        sidebar?.classList.add("w-20");
        footer?.classList.toggle("hidden");
        settingsText?.classList.toggle("hidden");
        feedbackText?.classList.toggle("hidden");
        cleanText?.classList.toggle("hidden");
        uploadText?.classList.toggle("hidden");
        title?.classList.toggle("hidden");
        return;
      }
      sidebar?.classList.remove("w-20");
      sidebar?.classList.add("w-1/5");
      footer?.classList.toggle("hidden");
      settingsText?.classList.toggle("hidden");
      feedbackText?.classList.toggle("hidden");
      cleanText?.classList.toggle("hidden");
      uploadText?.classList.toggle("hidden");
      title?.classList.toggle("hidden");
    }
    
    

    setClick(!click);
  };

  return (
    <div className="size-10 flex justify-center items-center">
      {props.device != "desktop" ? (
        <div className="flex justify-center items-center size-10 active:size-9 transition-all">
          {!click ? (
            <RiMenuUnfold3Fill
              className=" text-white size-8 active:size-7 active:text-sky-500 transition-all select-none"
              onClick={() => handleClick(false)} //handleClick}
            />
          ) : (
            <RiMenuUnfold4Fill
              className=" text-white size-8 active:size-7 active:text-sky-500 transition-all select-none"
              onClick={() => handleClick(false)}
            />
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center size-10 active:size-9 transition-all">
          {!click ? (
            <RiMenuUnfold4Fill
              className=" text-white size-8 active:size-7 active:text-sky-500 md:hover:text-sky-500 transition-all select-none"
              onClick={() => handleClick(true)}
            />
          ) : (
            <RiMenuUnfold3Fill
              className=" text-white size-8 active:size-7 active:text-sky-500 md:hover:text-sky-500 transition-all select-none"
              onClick={() => handleClick(true)}
            />
          )}
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { MdDeleteSweep } from "react-icons/md";
import { CleanStarts } from "./CleanStarts";

type Props = {
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clean: any
}

export const CleanChat: React.FC<Props> = ({clean}:Props) => {
  const [cleaning, setClean] = useState<boolean>(false);
  const handleClick = () => {
    clean();
    setClean(true);    
  }

  useEffect(()=>{
    setTimeout(()=>{
      setClean(false);
    },1000)
  },[cleaning])

  return (
    <div
      id="clean"
      className="flex justify-start items-center max-md:opacity-0 duration-100 hover:bg-slate-500 hover:cursor-pointer p-2 rounded-lg"
      onClick={()=>handleClick()}
    >
      <div className="flex justify-center items-center gap-6">
        <div className="size-11 flex justify-center items-center">
          <MdDeleteSweep className="text-white size-11 active:size-9 active:text-sky-500 transition-all md:hover:text-sky-500" />
        </div>

        <span id="cleanText" className="text-white font-manrope font-extrabold transition-all select-none">
          Limpiar Chat
        </span>
      </div>
      {cleaning && <CleanStarts />}
    </div>
  );
};

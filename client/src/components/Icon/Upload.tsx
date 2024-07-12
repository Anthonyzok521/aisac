import React, {useState, useEffect} from "react";
import { FaFileUpload } from "react-icons/fa";
import { Toast } from "../UI/Toast";

export const Upload: React.FC = () => {
  const [upload, setUpload] = useState<boolean>(false);

  const handleClick = () => {setUpload(true)};

  useEffect(()=>{
    setTimeout(()=>{
      setUpload(false)
    }, 1500)
  })

  return (
    <div
      id="upload"
      className="flex justify-start items-center max-md:opacity-0 duration-100 hover:bg-slate-500 hover:cursor-pointer p-2 rounded-lg"
      onClick={handleClick}
    >
      <div className="flex justify-center items-center gap-6 ">
        <div className="size-9 flex justify-center items-center">
          <FaFileUpload className="text-white size-9 active:size-8 active:text-sky-500 transition-all md:hover:text-sky-500" />
        </div>

        <span id="uploadText" className="text-white font-manrope font-extrabold transition-all select-none">
          Subir un archivo
        </span>
      </div>
      {upload && <Toast alert="Función en Desarrollo"/>}
    </div>
  );
};

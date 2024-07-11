import React, { useState, useEffect } from "react";
import { IoPersonCircle } from "react-icons/io5";
import Cookies from "universal-cookie";

type Props = {
  device: string;
};

export const Profile: React.FC<Props> = (props: Props) => {
  const [user, setUser] = useState("Tú");
  const [click, setClick] = useState(false);
  const cookies = new Cookies();

  const hidden = (device: string): string[] => {
    if(device == "desktop") {
      return ["absolute rounded-s-xl bg-black h-0 -z-10 right-0 w-44 transition-all"]
    }
    //mobile
    return ["absolute rounded-s-xl bg-black h-0 -z-10 -right-1/2 max-md:w-1/2 transition-all"]
  }

  const visibility = (device: string): string[] => {
    if(device == "desktop") {
      return ["absolute rounded-s-xl bg-black h-44 -z-10 right-0 w-44 transition-all"]
    }
    
    return ["absolute rounded-s-xl bg-black h-44 -z-10 right-0 max-md:w-1/2 transition-all"]
  }

  const handleClick = () => {
    const asideProfile = document.querySelector("#asideProfile");
    if (!click) {
      //@ts-expect-error 'asideProfile' is possibly 'null'.ts(18047)
      asideProfile.classList = visibility(props.device);
      setClick(true);
      return;
    }    
    //@ts-expect-error 'asideProfile' is possibly 'null'.ts(18047)
    asideProfile.classList = hidden(props.device);
    setClick(false);
  };

  useEffect(() => {
    setUser(cookies.get('user_sid') ?? 'Tú');
  }, []);

  return (
    <div
      className="flex justify-center size-12 items-center"
      onClick={handleClick}
    >
      {user != "Tú" ? (
        <div className="rounded-full h-full w-full active:size-10 transition-all bg-white max-md:bg-black">
          <h1 className="text-black max-md:text-white font-manrope font-extrabold text-2xl flex justify-center items-center h-full w-full active:text-xl transition-all">
            {user[0]}
          </h1>{" "}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center">
        <IoPersonCircle className="size-12 active:size-10 transition-all text-white" />        
        </div>
      )}
    </div>
  );
};

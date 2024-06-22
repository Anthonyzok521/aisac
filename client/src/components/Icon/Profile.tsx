import { useState, useEffect } from "react";
import Cookies from "universal-cookie";

const Profile = () => {
  const [user, setUser] = useState('Tú');
  const cookies = new Cookies();

  useEffect(() => {
    setUser(cookies.get('user_sid')[0] ?? 'Tú');
  }, []);

  return (
    <div className="flex justify-center size-10 items-center">
      <div className="rounded-full h-full w-full bg-white active:size-8 transition-all">
        <h1 className="text-black font-manrope font-extrabold text-2xl flex justify-center items-center h-full w-full active:text-xl transition-all">{user}</h1>
      </div>
    </div>
  )
}

export default Profile;
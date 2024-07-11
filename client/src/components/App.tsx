import React, { useState, useEffect } from "react";
import { SideBar } from "./UI/Header/Menu/SideBar";
import { Load } from "./Chat/Load.jsx";

export const App: React.FC = () => {
  const getDevice = () => {
    if (window.screen.width >= 768) {
      return "desktop";
    } else {
      return "mobile";
    }
  };

  const [device, setDevice] = useState(getDevice());

  useEffect(() => {
    window.addEventListener("resize", () => {
      setDevice(getDevice());
    });
  }, []);

  return (
    <>
      <SideBar device={device} />
      <main className="relative h-dvh w-full bg-slate-800 flex justify-center">
        <Load device={device} />
      </main>
    </>
  );
};

import React, { useState, useEffect } from "react";
import { SideBar } from "./UI/Header/Menu/SideBar";
import { Main } from "./UI/Main/Main";
import Modal from "./Chat/Modal.jsx";
import { PromptUser } from "./Chat/PromptUser.jsx";

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
      <main className="relative pl-20 h-screen w-full bg-slate-800">
        <PromptUser device={device} />
      </main>
      
    </>
  );
};

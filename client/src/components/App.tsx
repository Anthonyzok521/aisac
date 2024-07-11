import React, { useState, useEffect } from "react";
import {Routes, Route } from "react-router-dom";
import { Terms } from "./../pages/Terms.tsx";
import { FeedBack } from "./../pages/FeedBack.tsx";
import { Home } from "./../pages/Home.tsx";
import { NotFound } from "./../pages/NotFound.tsx";

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
      <Routes>      
        <Route path="/" element={<Home device={device}/>} />
        <Route path="/terms" element={<Terms device={device}/>}/>
        <Route path="/feedback" element={<FeedBack />} />        
        <Route path="*" element={<NotFound/>} />
      </Routes>
  );
};

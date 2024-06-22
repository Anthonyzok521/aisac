import React, { useState, useEffect } from 'react'
import Header from './UI/Header/Header'

export const App: React.FC = () => {

  const getDevice = () => {
    if (window.screen.width >= 768) {
      return "desktop"
    }
    else {
      return "mobile"
    }
  }

  const [device, setDevice] = useState(getDevice())

  useEffect(() => {
    window.addEventListener("resize", () => {
      setDevice(getDevice())
    })
  }, [])

  return <Header device={device} />
}
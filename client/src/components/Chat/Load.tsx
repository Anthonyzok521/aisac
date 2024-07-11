import React, {Suspense, lazy, useEffect, useState} from "react"
import {Modal} from "./Modal.tsx";
import Cookies from 'universal-cookie'

const PromptUser = lazy(() => import("./PromptUser.tsx"));

type Props = {
  device: string
}

export const Load: React.FC<Props> = ({device}: Props) => {

  const [user, setUser] = useState<string>();

  const cookies = new Cookies();

  useEffect(() => {

    if (cookies.get('user_sid')) {
      
      setUser(cookies.get('user_sid'));      

    }
  }, [user])

  return (

    <Suspense fallback={
      <div className='absolute inset-0 z-30 top-0 flex space-x-2 justify-center items-center bg-slate-900 bg-opacity-25 backdrop-blur h-screen transition-all'>
        <span className='sr-only'>Loading...</span>
        <div className='h-8 w-8 bg-white rounded-full animate-bounce [animation-delay:-0.3s]'></div>
        <div className='h-8 w-8 bg-white rounded-full animate-bounce [animation-delay:-0.15s]'></div>
        <div className='h-8 w-8 bg-white rounded-full animate-bounce'></div>
      </div>
    }>      

      <PromptUser device={device} user={user ?? "Tú"} key={"prompt"} />

      {!user && <Modal />}

    </Suspense>


  )
}
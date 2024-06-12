import { Suspense, lazy, useEffect, useState } from "react"
import Avatar from "../React/Avatar.jsx";
import Modal from "../React/Modal.jsx";
import VITE_URL_API from '../../utils/config.ts';

import Cookies from 'universal-cookie'

const PromptUser = lazy(() => import("./PromptUser.jsx"));


const Load = () => {

  const [user, setUser] = useState();
  const cookies = new Cookies();

  useEffect(() => {

    if (cookies.get('user_sid')) {
      
      setUser(cookies.get('user_sid'));      

    }
  }, [user])

  return (

    <Suspense fallback={
      <div className='absolute inset-0 z-10 top-0 flex space-x-2 justify-center items-center bg-slate-900 bg-opacity-25 backdrop-blur h-screen transition-all'>
        <span class='sr-only'>Loading...</span>
        <div class='h-8 w-8 bg-white rounded-full animate-bounce [animation-delay:-0.3s]'></div>
        <div class='h-8 w-8 bg-white rounded-full animate-bounce [animation-delay:-0.15s]'></div>
        <div className='h-8 w-8 bg-white rounded-full animate-bounce'></div>
      </div>
    }>
      <div class="flex justify-center pt-20" client:load>
        <Avatar role="assistant" size="250" />
      </div>

      <PromptUser client:load user={user}/>

      {!user && <Modal client:load/>}

    </Suspense>


  )
}

export default Load;
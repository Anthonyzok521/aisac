import React, { useState } from "react";
import Cookies from "universal-cookie";

export const Modal: React.FC = () => {

  const [check, setCheck] = useState<boolean>(false);
  const [terms, setTerms] = useState<boolean>(false);

  const [user, setUser] = useState<string>();

  const cookies = new Cookies();

  const checkTerms = () => {
    const checkTerms = document.querySelector("#terms");
    //@ts-expect-error the left-hand side of an assignment expression may not be optional property access.
    checkTerms.checked = !checkTerms?.checked;

    setCheck(!check);
  }

  const acceptTerms = () => {
    setTerms(!terms);
  }

  const insertName = () => {
    const expires = new Date();
    const modal = document.querySelector("#modal")
    expires.setFullYear(expires.getFullYear() + 1);
    cookies.set('user_sid', user, { path: '/', expires: expires});
    modal?.classList.add("hidden");
  }

  const omitInsertName = () => {
    const modal = document.querySelector("#modal");
    setUser("Tú");
    modal?.classList.add("hidden");
  }

  const styleCheck = `
    transition-all
    rounded-lg
    w-10
    flex
    justify-center
    items-center
    border-2    
    ${!check ? ' animate-pulse bg-yellow-200 border-yellow-400 border-dashed' : 'bg-green-500'}
    cursor-pointer
  `

  return (

    <div id="modal" className='absolute inset-0 z-10 top-0 flex space-x-2 justify-center items-center bg-slate-900 bg-opacity-25 backdrop-blur h-screen transition-all p-4'>
      {!terms ? <div className="p-4 bg-white rounded-md flex flex-col wrap gap-2">
        <div className="text-sm font-poppins font-bold">Términos y Condiciones</div>
        <div className="flex">
          <div className="h-full w-full">
            <a href="/terms" target="_blank" className="underline text-sm font-poppins">Antes de continuar, por favor lee y acepta los términos y condiciones.</a>
          </div>
          <div className={styleCheck} onClick={checkTerms}>
            {check ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
              :
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            }
            <input type="checkbox" name="terms" id="terms" hidden />
          </div>
        </div>
        <button className="p-2 bg-green-500 text-white rounded disabled:active:translate-x-0.5 enabled:active:translate-y-0.5 disabled:bg-gray-600 transition-all" disabled={!check} onClick={acceptTerms}>Continuar</button>
      </div>
      : <div className="p-4 bg-white rounded-md flex flex-col wrap gap-2">
          <div className="text-sm font-poppins font-bold">¿Quieres añadir tu nombre para una mejor experiencia de usuario?</div>
          <div className="h-full w-full ">
            <input onInput={(e) => {
              //@ts-expect-error Property 'value' does not exist on type 'EventTarget'.ts(2339)
              setUser(e.target.value)}
              } minLength={3} maxLength={10} type="text" name="name" id="name" className="w-full p-2 border border-gray-300 rounded outline-none focus:border-sky-500 transition-all font-manrope" placeholder="Tu nombre" />
            <div className="flex justify-between mt-2">            
            <button className="p-2 bg-sky-500 text-white rounded disabled:active:translate-x-0.5 enabled:active:translate-y-0.5 disabled:bg-gray-600 transition-all" disabled={!check} onClick={omitInsertName}>Omitir por ahora</button>
            <button className="p-2 bg-green-500 text-white rounded disabled:active:translate-x-0.5 enabled:active:translate-y-0.5 disabled:bg-gray-600 transition-all" disabled={!user} onClick={insertName}>Continuar</button>
            </div>
          </div>
        </div>}
    </div>
  )
}
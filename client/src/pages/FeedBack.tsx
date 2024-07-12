// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Avatar } from '../components/Icon/Avatar'
import { Link } from 'react-router-dom';


export const FeedBack: React.FC = () => {

    const [send, setSend] = useState(false);

    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();
        emailjs.sendForm("service_mjuiuj1", "template_6lmhivd", form.current, import.meta.env.VITE_EMAIL)
            .then((result) => {
                console.log(result.text);
                console.log("message sent!")
                setSend(true)
            }, (error) => {
                console.log(error.text);
                console.log("error sending message, try again!")
            });
    };
    return (
        <main class=" bg-slate-800 h-screen w-screen">
            <header className="h-16 w-full flex flex-col justify-center items-center pt-5">
                <nav className="w-full bg-slate-800 p-10 h-full flex items-center">
                    <ul className="w-full h-full flex items-center justify-center">
                        <li className='text-white'>
                            <Link to='/'>
                                <Avatar role="assistant" size="48" />
                                Aisac
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <div class="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
                {!send ? <><h2 class="mb-4 text-4xl tracking-tight font-extrabold text-center text-white">Feedback</h2><p class="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">Tus consejos ayudan a mejorar la experiencia de usuario.</p><form ref={form} onSubmit={sendEmail} class="space-y-8">
                    <div>
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-300">Correo electrónico</label>
                        <input type="email" id="email" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" placeholder="aisac@mail.com" required />
                    </div>
                    <div>
                        <label for="subject" class="block mb-2 text-sm font-medium text-gray-300">Título</label>
                        <input type="text" id="subject" class="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500" placeholder="Qué quieres aportart?" required />
                    </div>
                    <div class="sm:col-span-2">
                        <label for="message" class="block mb-2 text-sm font-medium text-gray-400">Comentario</label>
                        <textarea id="message" rows="6" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 " placeholder="Tu comentario aquí..."></textarea>
                    </div>
                    <button type="submit" class="py-3 px-5 text-sm font-medium text-center bg-sky-500 text-white rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 ">Enviar Feedback</button>
                </form></>
                    :
                    <>  <div className='w-full flex flex-col justify-content items-center'>
                        <h1 className='text-white text-3xl'>Gracias por compartir tus comentarios</h1>
                        <Link to={'/'} className='px-10 py-4 rounded-lg mt-20 bg-sky-500 text-white text-lg'>Ir a Aisac</Link>
                    </div>
                        
                    </>
                }
            </div>
        </main>
    )
};
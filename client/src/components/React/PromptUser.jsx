//Prompt User
import { useState, useEffect, Suspense, lazy } from "react";
import Loading from "./Loading.jsx";
const Message = lazy(() => import("./Message.jsx"));
import Avatar from "./Avatar.jsx";
const host = import.meta.env.VITE_URL_API || "http://localhost:3000";
const PromptUser = ({ user }) => {
    const [messages, setMessages] = useState([]);

    //Style Button | Visible or Hidden
    const [show, setShow] = useState("hidden");

    let style = `
        ${show == "visible" ? "visible" : "hidden"}
        absolute 
        bottom-10 
        right-0  
        hover:text-blue-700 
        rounded 
        text-blackfont-bold 
        py-2 
        px-4
        z-10
    `

    //OnClick | Hidden Button
    const Hidden = () => {
        setShow("hidden");
    }
    const Visible = () => {

        if (document.querySelector("textarea").value !== "") {
            setShow("visible");
        } else {
            setShow("hidden");
        }
    }

    /***************/

    //Submit Prompt
    const Submit = async (useKey) => {
        if (document.querySelector("textarea").value !== "") {
            if (!useKey) { Hidden() };

            //Get Prompt
            const prompt = document.querySelector("textarea").value;

            //Reset Prompt
            document.querySelector("textarea").value = "";

            //Key
            const key = prompt[0] + prompt[prompt.length - 1] + (Math.random() * 100).toString();
            //Show Message
            const newMessageUser = <Message role={user} prompt={prompt} key={key} />;
            const loading = <Loading />;
            setMessages([...messages, newMessageUser, loading]);
            //Run AI Since API
            fetch(host + '/api/aisac/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Assuming you're sending JSON data
                },
                body: JSON.stringify({ prompt: prompt }),
            }).then((response) => response.json()).then((data) => {
                const newMessageAI = <Message role="assistant" prompt={data.message} key={key + (Math.random() * 100).toString()} />;

                setMessages([...messages, newMessageUser, newMessageAI]);
            }).catch((error) => {
                console.error('Error:', error);
            });
        }
        Hidden();
    }

    useEffect(() => {
        //Scroll
        document.querySelectorAll("#inbox > div")[messages.length].scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages]);


    return (
        <main className="relative flex justify-center flex-col items-center container mx-auto px-4 overflow-hidden" >
            <div class="flex justify-center pt-20">
                <Avatar role="assistant" size="250" />
            </div>
            <div className="w-2/5 max-md:w-full max-lg:w-3/5 pt-10 pb-20 flex flex-col gap-4" id="inbox">
                <Message role="assistant" prompt="Hola, soy tu asistente. ¿En que te puedo ayudar?" key="init" />
                <Suspense fallback={<Loading />}>
                    {messages}
                </Suspense>
            </div>

            {/* //OnClick | Hidden Button */}
            <div onMouseLeave={Hidden} className=" w-full h-20 z-1 flex items-end absolute max-md:fixed left-0 bottom-10 max-md:bottom-0 justify-center">

                {/* //Textarea | Multiline */}
                <textarea onInput={Visible} onFocus={Visible}
                    onKeyDown={(key) => { if (key.key == "Enter" && key.ctrlKey == true && show == "visible") { Submit(true); } }}
                    aria-multiline maxLength="1000" className="transition-all duration-300 ease focus:h-20 hover:rounded-none rounded-lg outline-none p-2 w-2/5 max-md:w-full max-lg:w-3/5 h-10 text-xl resize-none overflow-hidden" name="prompt" type="text" placeholder="Escribe tu pregunta aqui">
                </textarea>

                <button onClick={() => Submit(false)} type="submit" name="submit" className={style}>
                    {/* Icon Submit | SVG - Heroicons */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                </button>

            </div>
        </main>
    )
}
export default PromptUser;
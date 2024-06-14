//Prompt User
import '../../style/global.css';
import { useState, useEffect, Suspense, lazy } from "react";
import Loading from "./Loading.jsx";
const Message = lazy(() => import("./Message.jsx"));
import Avatar from "./Avatar.jsx";
const host = import.meta.env.VITE_URL_API || "http://localhost:3000";
const PromptUser = ({ user }) => {
    const [messages, setMessages] = useState([]);

    //Style Button | Visible or Hidden
    const [inPC, setInPC] = useState(false);
    const [show, setShow] = useState(inPC ? "disabled" : "hidden");

    useEffect(() => {

        if (window.screen.width >= 768) {
            setInPC(true);            
        }else{
            setInPC(false);
        }
    }, []);

    let style = `       
        transition-all 
        ${inPC ? 'hover:text-white' : 'hover:text-sky-500'}
        disabled:hover:text-black
        text-black 
        font-bold 
        py-2 
        px-4
        z-10
    `

    //OnClick | Hidden Button
    const Hidden = () => {
        if(inPC) {
            setShow("disabled");
            
            document.querySelector("#container-btn-submit").classList.remove("bg-sky-500");
            document.querySelector("#container-btn-submit").classList.add("bg-white"); 
        }else{
            setShow("hidden");
        }        
    }
    const Visible = (mouse = '') => {
        if(!inPC) {
            if (document.querySelector("textarea").value !== "") {
                document.querySelector("#btn-submit").removeAttribute("disabled");
                document.querySelector("#btn-submit").setAttribute("enabled", "");
                setShow("visible");
            } else {
                document.querySelector("#btn-submit").removeAttribute("enabled");                
                document.querySelector("#btn-submit").setAttribute("disabled", "");
                setShow("hidden");
            }
        }else{
            if (document.querySelector("textarea").value !== "") {
                document.querySelector("#btn-submit").removeAttribute("disabled");
                document.querySelector("#btn-submit").setAttribute("enabled", "");
                document.querySelector("#container-btn-submit").classList.remove("bg-white");
                document.querySelector("#container-btn-submit").classList.add("bg-sky-500");         
            } else {
                document.querySelector("#btn-submit").removeAttribute("enabled");                
                document.querySelector("#btn-submit").setAttribute("disabled", "");
                document.querySelector("#container-btn-submit").classList.remove("bg-sky-500");
                document.querySelector("#container-btn-submit").classList.add("bg-white");         
            }
        }

        if (mouse == 'enter') {
            if (document.querySelector("textarea").focus() && !inPC) {
                setShow("visible");
            }else if(document.querySelector("textarea").focus() && inPC){
                setShow("enabled");
                
            };
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
            const key = prompt[0] + ((Math.random() * 100)/3).toString() + prompt[prompt.length - 1];
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

            const newMessageAI = <Message role="assistant" prompt={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas similique, dolor voluptatibus odit deserunt tenetur modi voluptate molestiae, id tempora tempore minima. Modi placeat assumenda ex debitis unde totam a!"} key={key + (Math.random() * 100).toString()} />;

                setMessages([...messages, newMessageUser, newMessageAI]);
        }
        Hidden();
    }

    const elevatePromptFocus = () => {        
        document.querySelector("#prompt").classList.remove("h-12");
        document.querySelector("#prompt").classList.add("h-20");
    }

    const elevatePromptBlur = () => {        
        document.querySelector("#prompt").classList.remove("h-20");
        document.querySelector("#prompt").classList.add("h-12");
    }

    useEffect(() => {
        //Scroll
        document.querySelectorAll("#inbox > div")[document.querySelectorAll('#inbox>div').length - 1].scrollIntoView({ behavior: "smooth"});

    }, [messages]);


    return (
        <main className="h-screen relative flex justify-center flex-col items-center container mx-auto px-4 overflow-hidden" >            
            <div className="overflow-y-auto snap-mandatory snap-y w-2/5 max-md:w-full max-lg:w-3/5 pt-20 pb-24 flex flex-col gap-4" id="inbox">
            <div className=" flex justify-center pt-0">
                <Avatar role="assistant" size="250" />                
            </div>
                <Message role="assistant" prompt="Hola, soy tu asistente. ¿En que te puedo ayudar?" key="init" />
                <Suspense fallback={<Loading />}>
                    {messages}
                </Suspense>
            </div>

            {/* //OnClick | Hidden Button */}
            <div id="prompt" className="transition-all duration-300 ease w-full h-12 max-h-max z-1 flex items-end absolute max-md:fixed bottom-10 max-md:bottom-0 justify-center">

                {/* //Textarea | Multiline */}
                <textarea 
                    onInput={Visible}
                    onFocus={elevatePromptFocus}
                    onBlur={elevatePromptBlur}
                    onKeyDown={(key) => { if (key.key == "Enter" && key.ctrlKey == true && show == "visible") { Submit(true); } }}
                    aria-multiline maxLength="1000" className="transition-all duration-300 ease focus:rounded-s-lg 
                    hover:rounded-s-lg rounded-s-3xl
                    max-md:rounded-3xl
                    max-md:focus:rounded-lg
                    max-md:pr-10
                    outline-none p-2 w-2/5 max-md:w-full max-lg:w-3/5 h-full text-xl resize-none overflow-x-auto" name="prompt" type="text" placeholder="Escribe tu pregunta aqui">
                </textarea> 
                <div onClick={() => Submit(false)} id="container-btn-submit" className="transition-all h-full flex justify-center items-center bg-white rounded-e-3xl max-md:absolute max-md:right-0 max-md:bg-transparent">
                <button disabled id="btn-submit" type="submit" name="submit" className={style}>
                    {/* Icon Submit | SVG - Heroicons */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                </button>
                </div>
            </div>
        </main>
    )
}
export default PromptUser;
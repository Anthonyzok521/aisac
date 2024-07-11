//Prompt User
import React, { useState, useEffect, ReactNode } from "react";
import { Loading } from "./Loading.tsx";
import { Inbox } from "./Inbox.tsx";
import { Message } from "./Message.tsx";
import { ButtonSubmit } from "../Icon/ButtonSubmit.tsx";
import { SideBar } from "../UI/Header/Menu/SideBar";

//const host = import.meta.env.VITE_HOST;

type Props = {
  user: string;
  device: string;
};

export const PromptUser: React.FC<Props> = ({user, device}: Props) => {
  
  const [messages, setMessages] = useState<Array<ReactNode>>([])

  const cleanMessages = () =>{
    setMessages([]);
  }

  //Style Button | Visible or Hidden
  const [inPC, setInPC] = useState(device === "desktop");
  const [show, setShow] = useState(inPC ? "disabled" : "hidden");

  useEffect(() => {
    if (window.screen.width >= 768) {
      setInPC(true);
    } else {
      setInPC(false);
    }
  }, []);

  //OnClick | Hidden Button
  const Hidden = () => {
    if (inPC) {
      setShow("disabled");

      document
        .querySelector("#container-btn-submit")
        ?.classList.remove("bg-sky-500");
      document
        .querySelector("#container-btn-submit")
        ?.classList.add("bg-white");
    } else {
      setShow("hidden");
    }
  };
  const Visible = (mouse: string = "") => {
    const text = document.querySelector("textarea")?.value ?? '';
    if (!inPC) {
      if (text.trim() != '') {
        document.querySelector("#btn-submit")?.removeAttribute("disabled");
        document.querySelector("#btn-submit")?.setAttribute("enabled", "");
        setShow("visible");
      } else {
        document.querySelector("#btn-submit")?.removeAttribute("enabled");
        document.querySelector("#btn-submit")?.setAttribute("disabled", "");
        setShow("hidden");
      }
    } else {
      if (text.trim() != '') {
        document.querySelector("#btn-submit")?.removeAttribute("disabled");
        document.querySelector("#btn-submit")?.setAttribute("enabled", "");
        document
          .querySelector("#container-btn-submit")
          ?.classList.remove("bg-white");
        document
          .querySelector("#container-btn-submit")
          ?.classList.add("bg-sky-500");
      } else {
        document.querySelector("#btn-submit")?.removeAttribute("enabled");
        document.querySelector("#btn-submit")?.setAttribute("disabled", "");
        document
          .querySelector("#container-btn-submit")
          ?.classList.remove("bg-sky-500");
        document
          .querySelector("#container-btn-submit")
          ?.classList.add("bg-white");
      }
    }

    if (mouse == "enter") {
      if (document.querySelector("textarea")?.focus() && !inPC) {
        setShow("visible");
      } else if (document.querySelector("textarea")?.focus() && inPC) {
        setShow("enabled");
      }
    }
  };

  /***************/

  //Submit Prompt
  const Submit = async (useKey: boolean) => {
    if (document.querySelector("textarea")?.value !== "") {
      if (!useKey) {
        Hidden();
      }

      //Get Prompt
      const textarea = document.querySelector("textarea");
      const prompt: string = textarea?.value.trim() || "";
      //Reset Prompt

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      textarea.value = "";

      //Key
      const key =
        prompt[0] +
        ((Math.random() * 100) / 3).toString() +
        prompt[prompt.length - 1];
      //Show Message
      const newMessageUser: React.ReactNode = (
        <Message role={user} prompt={prompt} key={key} />
      );
      const loading: React.ReactNode = <Loading />;
      setMessages([...messages, newMessageUser, loading]);
      //Run AI Since API
      /* fetch(host + "/api/aisac/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Assuming you're sending JSON data
        },
        body: JSON.stringify({ prompt: prompt }),
      })
        .then((response) => response.json())
        .then((data) => {
          const newMessageAI = (
            <Message
              role="assistant"
              prompt={data.message}
              key={key + (Math.random() * 100).toString()}
            />
          );

          setMessages([...messages, newMessageUser, newMessageAI]);
        })
        .catch((error) => {
          console.error(error);
          const newMessageAI = (
            <Message
              role="assistant"
              prompt={
                "Ocurrió un error por parte del servidor. Intenta otra vez."
              }
              key={key + (Math.random() * 100).toString()}
            />
          );

          setMessages([...messages, newMessageUser, newMessageAI]);
        }); */
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      /* debug */
        const newMessageAI = <Message role="assistant" prompt={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas similique, dolor voluptatibus odit deserunt tenetur modi voluptate molestiae, id tempora tempore minima. Modi placeat assumenda ex debitis unde totam a!"} key={key + (Math.random() * 100).toString()} />;
        
        setMessages([...messages, newMessageUser, newMessageAI]);
    }
    Hidden();
  };

  const elevatePromptFocus = () => {
    document.querySelector("#prompt")?.classList.remove("h-12");
    document.querySelector("#prompt")?.classList.add("h-20");
  };

  const elevatePromptBlur = () => {
    document.querySelector("#prompt")?.classList.remove("h-20");
    document.querySelector("#prompt")?.classList.add("h-12");
  };

  useEffect(() => {
    //Scroll
    document
      .querySelectorAll("#inbox > div")[document.querySelectorAll("#inbox>div").length - 1].scrollIntoView({
        behavior: "smooth",
      });
  }, [messages]);

  return (
    <>
      <SideBar device={device} clean={cleanMessages}/>
      <Inbox messages={messages} key={"inbox"}/>

      {/* //OnClick | Hidden Button */}
      <div
        id="prompt"
        className="max-md:z-10 transition-all duration-300 ease w-full h-12 max-h-max z-1 flex items-end fixed bottom-10 justify-center"
      >
        {/* //Textarea | Multiline */}
        <textarea
          onInput={() => Visible()}
          onFocus={elevatePromptFocus}
          onBlur={elevatePromptBlur}
          onKeyDown={(key) => {
            if (key.key == "Enter" && key.ctrlKey && show == "visible") {
              Submit(true);
            }
          }}
          aria-multiline
          maxLength={1000}
          className="transition-all duration-300 ease md:focus:rounded-s-lg 
                    md:hover:rounded-s-lg md:rounded-s-3xl
                    max-md:rounded-t-3xl
                    max-md:focus:rounded-t-lg
                    max-md:p-10                    
                    outline-none p-2 w-2/5 max-md:w-full max-lg:w-3/5 h-full text-xl resize-none overflow-x-auto"
          name="prompt"
          placeholder="Escribe tu pregunta aqui"
        ></textarea>
        <div
          onClick={() => Submit(false)}
          id="container-btn-submit"
          className="transition-all h-full flex justify-center items-center bg-white rounded-e-3xl max-md:absolute max-md:right-0 max-md:bg-transparent"
        >
          <ButtonSubmit inPC={inPC} key={"btnSubmit"}/>
        </div>
        
          <div className="max-md:bg-white absolute -bottom-10">
            <h3 className="text-gray-600 max-md:text-sm max-md:text-center">Es posible que Aisac muestre información imprecisa, incluidos datos sobre personas, por lo que debes verificar sus respuestas.</h3>
          </div>
        
      </div>
    </>
  );
};
export default PromptUser;

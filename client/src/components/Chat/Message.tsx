import React from "react";
import { Avatar} from "../Icon/Avatar.tsx";
import Markdown from "markdown-to-jsx";

type Props = {
    role: string;
    prompt: string;
};

export const Message: React.FC<Props> = (props: Props) => {
    //Style Messages
    
    //Classes Tailwind
    const messageClass = `
    my-2
    md:w-2/5
    max-md:w-full
    flex
    flex-col
    gap-4
    text-white 
    md:px-2     
    max-md:px-10
    ${props.role === 'assistant' ? 'border-s-4 ' : 'border-r-4 '}
    ${props.role === 'assistant' ? 'border-sky-500' : 'border-slate-500'}
    `;


    const styleAvatar = `
        flex 
        w-full
        h-full
        gap-2
        items-center
        ${props.role === 'assistant' ? 'justify-start' : 'justify-end'}
    `;

    const container = `
        w-full
        ${props.role === 'assistant' ? 'bg-slate-900' : 'bg-slate-700'}
        rounded-md
        p-2
    `;

    return (
        <div className={messageClass}>
            <div className={styleAvatar}>
                <Avatar role={props.role} size={"32"} />
                <p className="font-bold">{props.role === 'assistant' ? 'Aisac' : props.role ? props.role : 'Tú'}</p>        
            </div>
            <div className={container}>
                <Markdown >
                    
                    {props.prompt}
                    
                </Markdown>
            </div>
        </div>
    )
}
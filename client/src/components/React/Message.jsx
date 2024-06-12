import Avatar from "../React/Avatar.jsx";

import 'https://md-block.verou.me/md-block.js';
const Message = ({role, prompt}) => {
    //Style Messages
    
    //Classes Tailwind
    const messageClass = `
    my-2
    w-full
    flex
    flex-col
    gap-4
    text-white 
    px-2     
    ${role === 'assistant' ? 'border-s-4 ' : 'border-r-4 '}
    ${role === 'assistant' ? 'border-sky-500' : 'border-slate-500'}
    `;

    const styleAssistant = `   
    max-w-full
    text-wrap 
    p-4    
    backdrop-blur-sm
    shadow-sm
    ${role === 'assistant' ? 'shadow-blue-400' : ''}
    ${role === 'assistant' ? 'bg-slate-800' : ''}
    rounded
    `;

    const styleAvatar = `
        flex 
        w-full
        h-full
        gap-2
        items-center
        ${role === 'assistant' ? 'justify-start' : 'justify-end'}
    `;

    const container = `
        w-full
        ${role === 'assistant' ? 'bg-slate-900' : 'bg-slate-700'}
        rounded-md
        p-2
    `;

    return (
        <div className={messageClass}>
            <div className={styleAvatar}>
                <Avatar role={role} size={"32"}/>
                <p className="font-bold">{role === 'assistant' ? 'Aisac' : role ? role : 'Tú'}</p>        
            </div>
            <div className={container}>
                <md-block className={styleAssistant}>
                    
                    {prompt}
                    
                </md-block>
            </div>
        </div>
    )
}

export default Message;
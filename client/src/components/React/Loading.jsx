const Loading = ({ role }) => {

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
    animate-pulse animate-infinite animate-ease-in-out 
    max-w-full
    text-wrap 
    p-4    
    backdrop-blur-sm
    shadow-sm
    flex
    gap-4
    flex-wrap
    flex-col
    `;

    const styleAvatar = `
    animate-pulse animate-infinite animate-ease-in-out
        flex 
        wrap
        w-full
        h-full
        gap-2
        items-center
        assistant
    `;

    const container = `
        w-full
        bg-slate-900
        rounded-md
        p-2
        h-36
    `;

    return (
        <div className={messageClass}>
            <div className={styleAvatar}>
                <div className="w-10 h-10 rounded-full bg-slate-500"></div>
                <div className="w-20 h-6 rounded-sm  bg-slate-500"></div>
            </div>
            <div className={container}>
                <div className={styleAssistant}>

                    <div className="w-20 h-6 rounded-sm  bg-slate-500"></div>
                    <div className="w-30 h-6 rounded-sm  bg-slate-500"></div>
                    <div className="w-36 h-6 rounded-sm  bg-slate-500"></div>

                </div>
            </div>
        </div>
    )
}

export default Loading;
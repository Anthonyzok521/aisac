import React, { useEffect } from 'react'

type Props = {
    alert:string
}

export const Toast: React.FC<Props> = ({alert}:Props) => {

    useEffect(()=>{
        const toast = document.querySelector('#toast') as HTMLElement;
        setTimeout(()=>{
            document.removeChild(toast);
        },1000)
    }, [])

    return (
        <div id='toast' className='absolute flex justify-center items-center bottom-32 right-0 w-80 h-20 bg-white rounded-md'>
            <p className='text-xl'>{alert}</p>
        </div>
    )
}
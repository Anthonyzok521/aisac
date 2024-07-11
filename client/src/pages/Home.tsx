import React from 'react'
import { Load } from "../components/Chat/Load.jsx";

type Props = {
    device: string
}

export const Home: React.FC<Props> = ({ device }) => {
    return (<>        
        <main className="relative h-dvh w-full bg-slate-800 flex justify-center">
            <Load device={device} />
        </main>
    </>
    )
}
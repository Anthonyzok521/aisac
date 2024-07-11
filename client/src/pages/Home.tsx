import React from 'react'
import { SideBar } from "../components/UI/Header/Menu/SideBar";
import { Load } from "../components/Chat/Load.jsx";

type Props = {
    device: string
}

export const Home: React.FC<Props> = ({ device }) => {
    return (<>
        <SideBar device={device} />
        <main className="relative h-dvh w-full bg-slate-800 flex justify-center">
            <Load device={device} />
        </main>
    </>
    )
}
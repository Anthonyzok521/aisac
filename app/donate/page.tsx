'use client'

import { Button } from "@/components/ui/button"
import Image from "next/image";
import { useRouter } from "next/navigation"
import {Spoiler} from "spoiled";

export default function DonatePage() {
    const navigate = useRouter();

    const handleBack = () => {
        navigate.back();
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Donar al Creador</h1>
            <p className="mb-4">Tu apoyo es muy importante para nosotros. Si deseas contribuir, puedes hacerlo a través de los siguientes métodos:</p>
            <ul className="list-disc list-inside mb-4 flex flex-col gap-5">
                <li className="flex justify-start items-center gap-2"><Image className="dark:bg-white rounded-full p-2" alt="Paypal" src={'/brand-paypal.svg'} width={32} height={32}/> <a href="https://www.paypal.com" className="text-blue-500">https://www.paypal.com</a></li>
                <li className="flex justify-start items-center gap-2"><Image className="dark:bg-white rounded-full p-2" alt="Patreon" src={'/brand-patreon.svg'} width={32} height={32}/><a href="https://patreon.com/advancedcommunity" className="text-blue-500">patreon.com/advancedcommunity</a></li>
                <li className="flex justify-start items-center gap-2"><Image className="dark:bg-white rounded-full p-2" alt="USDT" src={'/brand-tether.svg'} width={32} height={32} /><span className="text-gray-700">TANvL9YLZtTdbB4BsfbovhqaVFVZCwav79</span></li>
                <li className="flex justify-start items-center gap-2"><Image className="dark:bg-white rounded-full p-2" alt="Pago Movil" src={'/device-mobile-dollar.svg'} width={32} height={32} /><Spoiler><span className="text-gray-700">0412-4662193 0105 30659229</span></Spoiler></li>
            </ul>
            <Button variant="outline" onClick={handleBack}>Volver</Button>
        </div>
    )
}


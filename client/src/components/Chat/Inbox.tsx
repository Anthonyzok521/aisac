import React, { Suspense } from "react";
import { Message } from "./Message.tsx";
import { Loading } from "./Loading.tsx";
import { useRive } from '@rive-app/react-canvas';

type Props = {
  messages: Array<React.ReactNode>,
  key: string
};

export const Inbox: React.FC<Props> = ({ messages }: Props) => {

  const { rive, RiveComponent } = useRive({
    src: '/anim-aisac.riv',
    stateMachines: "scale",
    autoplay: true
  });

  return (
    <div
      className="max-md:w-full md:w-3/5 pt-28 pb-40 flex flex-col gap-4 justify-start items-center overflow-y-auto snap-mandatory snap-y"
      id="inbox"
    >
      <div className="w-full flex justify-center pt-0">

        <RiveComponent
          className="h-80 w-80 max-md:h-52 max-md:w-52"
          onClick={() => rive && rive.play()}
        />
      </div>
      <Message
        role="assistant"
        prompt="Hola, soy tu asistente. ¿En que te puedo ayudar?"
        key="init"
      />
      <Suspense fallback={<Loading key={"loading"} />}>{messages}</Suspense>
    </div>
  );
};

import React, {Suspense} from "react";
import {Avatar} from "../Icon/Avatar.tsx";
import {Message} from "./Message.tsx";
import {Loading} from "./Loading.tsx";

type Props = {
  messages: Array<React.ReactNode>,
  key: string
};

export const Inbox: React.FC<Props> = ({messages}: Props) => {
  return (
    <div
      className="max-md:w-full md:w-3/5 pt-28 pb-40 flex flex-col gap-4 justify-start items-center overflow-y-auto snap-mandatory snap-y"
      id="inbox"
    >
      <div className="w-full flex justify-center pt-0">
        <Avatar role="assistant" size="120" />
      </div>
      <Message
        role="assistant"
        prompt="Hola, soy tu asistente. ¿En que te puedo ayudar?"
        key="init"
      />
      <Suspense fallback={<Loading key={"loading"}/>}>{messages}</Suspense>
    </div>
  );
};

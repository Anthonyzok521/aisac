'use client'

import { Message } from '@/types/chat'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from 'next/image'
import { LoadingMessage } from '@/components/ui/LoadingMessage';

interface ChatAreaProps {
  r: React.RefObject<HTMLDivElement>
  messages: Message[]
  userName: string
  isLoading: boolean
}

export function ChatArea({r, messages, userName, isLoading }: ChatAreaProps) {
  return (
    <div ref={r} className="sc-chat flex-1 overflow-y-auto p-4 space-y-6 max-w-3xl mx-auto">
      {messages.map((msg) => (
        <div 
          key={msg.id} 
          className={cn(
            "flex items-end space-x-2",
            msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
          )}
        >
          <Avatar className="w-8 h-8">
            {msg.role === 'user' ?
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            :
            <Image src="/aisac-logo.svg" alt="AISAC Logo" width={32} height={32} />
          }
          </Avatar>
          <div 
            className={cn(
              "max-w-[70%] p-3",
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-l-2xl rounded-tr-2xl rounded-br-sm' 
                : 'bg-secondary text-secondary-foreground rounded-r-2xl rounded-tl-2xl rounded-bl-sm'
            )}
          >
            {msg.content}
          </div>
        </div>
      ))}
      {isLoading && <LoadingMessage />}
    </div>
  )
}


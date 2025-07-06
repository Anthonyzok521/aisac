'use client'

import { Message } from '@/types/chat'
import { cn } from '@/lib/utils'

interface ChatAreaProps {
  messages: Message[]
}

export function ChatArea({ messages }: ChatAreaProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <div 
          key={msg.id} 
          className={cn(
            "flex",
            msg.role === 'user' ? 'justify-end' : 'justify-start'
          )}
        >
          <div 
            className={cn(
              "max-w-[70%] rounded-lg p-3",
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground'
            )}
          >
            {msg.content}
          </div>
        </div>
      ))}
    </div>
  )
}

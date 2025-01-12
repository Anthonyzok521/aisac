'use client'

import { ImageIcon, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChatInputProps } from '@/types/chat'

export function ChatInput({ 
  className, 
  onSubmit, 
  value, 
  onChange,
  onAttachmentClick,
  ...props 
}: ChatInputProps) {
  return (
    <form 
      onSubmit={onSubmit} 
      className={cn(
        "relative flex items-center w-full max-w-[800px] mx-auto",
        className
      )}
      {...props}
    >
      <div className="relative flex w-full items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute left-2 h-8 w-8 rounded-full hover:bg-accent/50"
          onClick={onAttachmentClick}
        >
          <ImageIcon className="h-5 w-5 text-muted-foreground" />
        </Button>
        <input
          value={value}
          onChange={onChange}
          placeholder="Texto"
          className="w-full bg-accent/50 backdrop-blur-sm rounded-full pl-12 pr-12 py-6 focus:outline-none focus:ring-2 focus:ring-primary/20 text-base"
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-2 h-8 w-8 rounded-full hover:bg-accent/50"
          disabled={!value.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  )
}


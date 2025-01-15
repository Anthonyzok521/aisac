'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Menu } from 'lucide-react'
import { Sidebar } from "@/components/organisms/Sidebar"
import { ChatArea } from "@/components/organisms/ChatArea"
import { ChatInput } from "@/components/molecules/ChatInput"
import { UserProfile } from "@/components/molecules/UserProfile"
import { useChat } from "@/hooks/useChat"

interface ChatTemplateProps {
  userName: string
}

export function ChatTemplate({ userName }: ChatTemplateProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { messages, input, setInput, sendMessage, messagesEndRef, isLoading } = useChat()

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        userName={userName}
      />
      
      <main className="flex-1 flex flex-col">
        <header className="bg-card border-b border-border p-4 flex justify-between items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">AISAC</h1>
          <UserProfile userName={userName} />
        </header>

        <div className={`flex ${messages.length == 0 ? '' : 'hidden'} overflow-hidden w-full justify-center py-8`}>
          {userName ? 'Hola, ' + userName : 'Hola'}. En qué puedo ayudarte?
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-16 py-8">
          <ChatArea r={messagesEndRef} messages={messages} userName={userName} isLoading={isLoading}/>
        </div>

        <footer className="bg-card/50 backdrop-blur-sm border-t border-border p-4">
          <ChatInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSubmit={sendMessage}
            onAttachmentClick={() => {
              console.log('Attachment clicked')
            }}
          />
          <p className='flex pt-2 text-sm justify-center font-extralight text-white/20 text-center'>
          Es posible que Aisac muestre información imprecisa, incluidos datos sobre personas, por lo que debes verificar sus respuestas.
          </p>
        </footer>
      </main>
    </div>
  )
}


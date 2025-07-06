"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sidebar } from "@/components/organisms/Sidebar"
import { ChatArea } from "@/components/organisms/ChatArea"
import { ChatInput } from "@/components/molecules/ChatInput"
import { UserProfile } from "@/components/molecules/UserProfile"
import { RoleAlert } from "@/components/molecules/RoleAlert"
import { useChat } from "@/hooks/useChat"
import { useAuth } from "@/hooks/useAuth"

interface ChatTemplateProps {
  userName: string
}

export function ChatTemplate({ userName }: ChatTemplateProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { messages, input, setInput, sendMessage, isLoading } = useChat()
  const { user } = useAuth()

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

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
          <h1 className="text-xl font-semibold">Chat con AISAC</h1>
          <UserProfile userName={userName} />
        </header>

        <div className="p-4">{user && <RoleAlert role={user.role} />}</div>

        <ChatArea messages={messages} />

        <footer className="bg-card/50 backdrop-blur-sm border-t border-border p-4">
          <ChatInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSubmit={sendMessage}
            onAttachmentClick={() => {
              console.log("Attachment clicked")
            }}
          />
        </footer>
      </main>
    </div>
  )
}

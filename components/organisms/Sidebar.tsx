'use client'

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, X } from 'lucide-react'
import { ThemeToggle } from "@/components/atoms/ThemeToggle"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside className={`bg-card fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 lg:hidden"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center space-x-2 mb-6">
          <Avatar>
            <AvatarImage src="/aisac-logo.png" alt="AISAC Logo" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-lg">AISAC</span>
        </div>
        <Button variant="outline" className="w-full justify-start mb-4">
          <Plus className="mr-2 h-4 w-4" /> Nuevo chat
        </Button>
        <nav className="flex-1">
          {/* Aquí irían los chats recientes */}
        </nav>
        <ThemeToggle />
      </div>
    </aside>
  )
}

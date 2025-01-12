'use client'

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, X, Heart } from 'lucide-react'
import { ThemeToggle } from "@/components/atoms/ThemeToggle"
import { UploadTrainingDocumentDialog } from "@/components/molecules/UploadTrainingDocumentDialog"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  userName: string
}

export function Sidebar({ isOpen, onClose, userName }: SidebarProps) {
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
        <div className="space-y-2">
          <UploadTrainingDocumentDialog userName={userName} />
          <Button variant="ghost" className="w-full justify-start">
            <Heart className="mr-2 h-4 w-4" /> Donar al creador
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  )
}


import { HTMLAttributes, FormEvent, ChangeEvent } from 'react'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatInputProps extends HTMLAttributes<HTMLFormElement> {
  onSubmit: (e: FormEvent) => void
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onAttachmentClick?: () => void
}

export interface UserProfile {
  name: string
  avatar?: string
  createdAt: Date
}

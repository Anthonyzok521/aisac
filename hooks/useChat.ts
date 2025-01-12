import { useState, useCallback } from 'react'
import { Message } from '@/types/chat'
import { v4 as uuidv4 } from 'uuid'

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const newMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Aquí iría la lógica para enviar el mensaje a la IA
      // Por ahora, simulamos una respuesta después de 1 segundo
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const response: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Esta es una respuesta de ejemplo.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, response])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading])

  return {
    messages,
    input,
    setInput,
    sendMessage,
    isLoading
  }
}


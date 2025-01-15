import { useState, useCallback } from 'react'
import { Message } from '@/types/chat'
import { v4 as uuidv4 } from 'uuid'

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const host = process.env.NEXT_PUBLIC_API_URL;

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
      /* await new Promise(resolve => setTimeout(resolve, 1000))
      
      const response: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Esta es una respuesta de ejemplo.',
        timestamp: new Date()
      } */

      fetch(host + "/api/aisac/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Assuming you're sending JSON data
        },
        body: JSON.stringify({ prompt: prompt }),
      })
        .then((response) => response.json())
        .then((data) => {
          const response: Message = {
            id: uuidv4(),
            role: 'assistant',
            content: data.message,
            timestamp: new Date()
          }

          setMessages(prev => [...prev, response])
        })
        .catch((error) => {
          console.error(error);
          const response: Message = {
            id: uuidv4(),
            role: 'assistant',
            content: "Ocurrió un error por parte del servidor. Intenta otra vez.",
            timestamp: new Date()
          }

          setMessages(prev => [...prev, response])
        });
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


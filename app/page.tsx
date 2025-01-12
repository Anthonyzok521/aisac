'use client'

import { useState, useEffect } from 'react'
import { ChatTemplate } from '@/components/templates/ChatTemplate'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AISACChat() {
  const [userName, setUserName] = useState('')
  const [isTermsAccepted, setIsTermsAccepted] = useState(false)
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false)
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedUserName = localStorage.getItem('userName')
    if (savedUserName) {
      setUserName(savedUserName)
      setIsTermsAccepted(true)
    } else {
      setIsTermsDialogOpen(true)
    }
  }, [])

  if (!mounted) {
    return null
  }

  const handleAcceptTerms = () => {
    setIsTermsAccepted(true)
    setIsTermsDialogOpen(false)
    setIsNameDialogOpen(true)
  }

  const handleSubmitName = (name: string) => {
    setUserName(name)
    localStorage.setItem('userName', name)
    setIsNameDialogOpen(false)
  }

  return (
    <>
      <Dialog open={isTermsDialogOpen} onOpenChange={setIsTermsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Términos y Condiciones</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {/* Aquí va el contenido de los términos y condiciones */}
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc id aliquam tincidunt, nisl nunc tincidunt nunc, vitae aliquam nunc nunc vitae nunc.</p>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Acepto los términos y condiciones
            </label>
          </div>
          <DialogFooter>
            <Button onClick={handleAcceptTerms}>Continuar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNameDialogOpen} onOpenChange={setIsNameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bienvenido a AISAC</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const name = formData.get('name') as string
            handleSubmitName(name)
          }}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" name="name" placeholder="Tu nombre" required />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Comenzar a chatear</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {isTermsAccepted && userName && <ChatTemplate userName={userName} />}
    </>
  )
}


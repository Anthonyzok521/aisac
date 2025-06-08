import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function UserNameForm({ isOpen, onSubmit }) {
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bienvenido a AISAC</DialogTitle>
          <DialogDescription>
            Por favor, introduce tu nombre para comenzar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!name.trim()}>Comenzar a chatear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

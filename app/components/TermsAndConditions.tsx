import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function TermsAndConditions({ isOpen, onAccept }) {
  const [isChecked, setIsChecked] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Términos y Condiciones</DialogTitle>
          <DialogDescription>
            Por favor, lee y acepta nuestros términos y condiciones antes de continuar.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Aquí va el contenido de los términos y condiciones */}
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc id aliquam tincidunt, nisl nunc tincidunt nunc, vitae aliquam nunc nunc vitae nunc.</p>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox id="terms" checked={isChecked} onCheckedChange={setIsChecked} />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Acepto los términos y condiciones
          </label>
        </div>
        <DialogFooter>
          <Button onClick={onAccept} disabled={!isChecked}>Continuar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

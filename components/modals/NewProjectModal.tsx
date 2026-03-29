'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUIStore } from '@/stores/uiStore'
import { useChatStore } from '@/stores/chatStore'
import { PROJECT_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function NewProjectModal() {
  const open = useUIStore((s) => s.newProjectModalOpen)
  const setOpen = useUIStore((s) => s.setNewProjectModalOpen)
  const setOrganizations = useChatStore((s) => s.setOrganizations)

  const [name, setName] = useState('')
  const [color, setColor] = useState(PROJECT_COLORS[0])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim()) return
    setLoading(true)

    try {
      await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), color }),
      })

      // Refresh organizations
      const res = await fetch('/api/organizations')
      const data = await res.json()
      setOrganizations(data)

      setName('')
      setColor(PROJECT_COLORS[0])
      setOpen(false)
    } catch (error) {
      console.error('Create project error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Projeto</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome do projeto</label>
            <Input
              placeholder="Ex: Atrides, Cofrino..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Cor</label>
            <div className="flex gap-2 flex-wrap">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={cn(
                    'h-8 w-8 rounded-full transition-all',
                    color === c ? 'ring-2 ring-offset-2 ring-accent' : 'hover:scale-110'
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim() || loading}>
            {loading ? 'Criando...' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

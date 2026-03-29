'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUIStore } from '@/stores/uiStore'
import { useChatStore } from '@/stores/chatStore'
import { Info } from 'lucide-react'

export function AddPhoneModal() {
  const open = useUIStore((s) => s.addPhoneModalOpen)
  const setOpen = useUIStore((s) => s.setAddPhoneModalOpen)
  const organizations = useChatStore((s) => s.organizations)
  const setOrganizations = useChatStore((s) => s.setOrganizations)

  const [form, setForm] = useState({
    organizationId: '',
    label: '',
    phoneNumber: '',
    phoneNumberId: '',
    wabaId: '',
    accessToken: '',
    webhookVerifyToken: `verify_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  })
  const [showToken, setShowToken] = useState(false)
  const [loading, setLoading] = useState(false)

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/phones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const err = await res.json()
        alert(err.error || 'Erro ao criar número')
        return
      }

      // Refresh organizations
      const orgsRes = await fetch('/api/organizations')
      const data = await orgsRes.json()
      setOrganizations(data)

      setForm({
        organizationId: '',
        label: '',
        phoneNumber: '',
        phoneNumberId: '',
        wabaId: '',
        accessToken: '',
        webhookVerifyToken: `verify_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      })
      setOpen(false)
    } catch (error) {
      console.error('Add phone error:', error)
    } finally {
      setLoading(false)
    }
  }

  const isValid = form.organizationId && form.label && form.phoneNumber && form.phoneNumberId && form.wabaId && form.accessToken

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Número</DialogTitle>
          <DialogDescription>Vincule um número WhatsApp a um projeto</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Projeto</label>
            <select
              value={form.organizationId}
              onChange={(e) => updateField('organizationId', e.target.value)}
              className="flex h-9 w-full rounded-lg border border-border bg-input px-3 py-1 text-sm"
            >
              <option value="">Selecione...</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Label</label>
            <Input
              placeholder="Ex: Suporte, Marketing..."
              value={form.label}
              onChange={(e) => updateField('label', e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Número de telefone</label>
            <Input
              placeholder="+5581951680136"
              value={form.phoneNumber}
              onChange={(e) => updateField('phoneNumber', e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Phone Number ID</label>
            <Input
              placeholder="ID do número na Meta"
              value={form.phoneNumberId}
              onChange={(e) => updateField('phoneNumberId', e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">WABA ID</label>
            <Input
              placeholder="WhatsApp Business Account ID"
              value={form.wabaId}
              onChange={(e) => updateField('wabaId', e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Access Token</label>
            <div className="relative">
              <Input
                type={showToken ? 'text' : 'password'}
                placeholder="Token de acesso da Meta"
                value={form.accessToken}
                onChange={(e) => updateField('accessToken', e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                {showToken ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Webhook Verify Token</label>
            <Input
              value={form.webhookVerifyToken}
              onChange={(e) => updateField('webhookVerifyToken', e.target.value)}
              className="text-xs"
            />
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <p>
              Encontre o Phone Number ID, WABA ID e Access Token no{' '}
              <strong>Meta Business Suite → WhatsApp → Configuração da API</strong>.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

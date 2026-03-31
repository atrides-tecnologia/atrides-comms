'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Trash2, Plus, RefreshCw, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import type { Organization, PhoneNumber } from '@/types'

export default function SettingsPage() {
  const [organizations, setOrganizations] = useState<(Organization & { phoneNumbers: PhoneNumber[] })[]>([])
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/organizations')
      .then((r) => r.json())
      .then(setOrganizations)
      .catch(console.error)
  }, [])

  const handleDeleteOrg = async (id: string) => {
    if (!confirm('Tem certeza? Isso excluirá todos os números e conversas deste projeto.')) return
    await fetch(`/api/organizations/${id}`, { method: 'DELETE' })
    setOrganizations((prev) => prev.filter((o) => o.id !== id))
  }

  const handleDeletePhone = async (id: string) => {
    if (!confirm('Tem certeza? Isso excluirá todas as conversas deste número.')) return
    await fetch(`/api/phones/${id}`, { method: 'DELETE' })
    setOrganizations((prev) =>
      prev.map((org) => ({
        ...org,
        phoneNumbers: (org.phoneNumbers || []).filter((p: PhoneNumber) => p.id !== id),
      }))
    )
  }

  const handleSyncTemplates = async (phoneId: string) => {
    try {
      const res = await fetch('/api/templates/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumberId: phoneId }),
      })
      const data = await res.json()
      if (res.ok) {
        alert(`${data.synced} templates sincronizados!`)
      } else {
        alert(data.error || 'Erro ao sincronizar')
      }
    } catch {
      alert('Erro ao sincronizar templates')
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedToken(id)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  const webhookUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/webhook`
    : '/api/webhook'

  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-14 items-center gap-3 border-b border-border px-6">
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <a href="/chat"><ArrowLeft className="h-4 w-4" /></a>
        </Button>
        <h1 className="text-lg font-bold font-[family-name:var(--font-heading)]">Configurações</h1>
      </header>

      <div className="mx-auto max-w-2xl p-6 space-y-8">
        {/* Webhook Info */}
        <section>
          <h2 className="text-base font-semibold font-[family-name:var(--font-heading)] mb-3">Webhook</h2>
          <div className="rounded-lg border border-border p-4 space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">URL do Webhook</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 rounded bg-muted px-3 py-2 text-xs font-mono">{webhookUrl}</code>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => copyToClipboard(webhookUrl, 'webhook-url')}
                >
                  {copiedToken === 'webhook-url' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Configure esta URL no Meta Business Suite → WhatsApp → Configuração → Webhook.
              Use o Verify Token de cada número abaixo.
            </p>
          </div>
        </section>

        <Separator />

        {/* Projects & Phones */}
        <section>
          <h2 className="text-base font-semibold font-[family-name:var(--font-heading)] mb-3">Projetos e Números</h2>
          <div className="space-y-4">
            {organizations.map((org) => (
              <div key={org.id} className="rounded-lg border border-border">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: org.color }} />
                    <span className="font-medium text-sm">{org.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteOrg(org.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {(org.phoneNumbers || []).length > 0 && (
                  <div className="border-t border-border">
                    {(org.phoneNumbers || []).map((phone: PhoneNumber) => (
                      <div key={phone.id} className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0">
                        <div>
                          <p className="text-sm font-medium">{phone.label}</p>
                          <p className="text-xs text-muted-foreground">{phone.phoneNumber}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-[10px] text-muted-foreground">Verify Token:</span>
                            <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{phone.webhookVerifyToken}</code>
                            <button
                              onClick={() => copyToClipboard(phone.webhookVerifyToken || '', phone.id)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              {copiedToken === phone.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground"
                            onClick={() => handleSyncTemplates(phone.id)}
                            title="Sincronizar templates"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeletePhone(phone.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {organizations.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum projeto criado ainda
              </p>
            )}
          </div>
        </section>

        <Separator />

        {/* Appearance */}
        <section>
          <h2 className="text-base font-semibold font-[family-name:var(--font-heading)] mb-3">Aparência</h2>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <span className="text-sm">Tema</span>
            <ThemeToggle />
          </div>
        </section>
      </div>
    </div>
  )
}

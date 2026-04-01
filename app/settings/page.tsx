'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Trash2, Plus, RefreshCw, Copy, Check, Bell, BellOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { InlineEdit } from '@/components/ui/inline-edit'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useChatStore } from '@/stores/chatStore'
import type { Organization, PhoneNumber, NotificationChannel } from '@/types'

export default function SettingsPage() {
  const [organizations, setOrganizations] = useState<(Organization & { phoneNumbers: PhoneNumber[] })[]>([])
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const [channels, setChannels] = useState<Record<string, NotificationChannel[]>>({})
  const [newDiscordUrl, setNewDiscordUrl] = useState<Record<string, string>>({})
  const [newDiscordLabel, setNewDiscordLabel] = useState<Record<string, string>>({})
  const updateOrganization = useChatStore((s) => s.updateOrganization)
  const updatePhoneNumber = useChatStore((s) => s.updatePhoneNumber)

  useEffect(() => {
    fetch('/api/organizations')
      .then((r) => r.json())
      .then(setOrganizations)
      .catch(console.error)
  }, [])

  // Load notification channels for all orgs
  useEffect(() => {
    organizations.forEach((org) => {
      fetch(`/api/notifications?organizationId=${org.id}`)
        .then((r) => r.json())
        .then((data) => setChannels((prev) => ({ ...prev, [org.id]: data })))
        .catch(console.error)
    })
  }, [organizations.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddDiscord = async (orgId: string) => {
    const url = newDiscordUrl[orgId]?.trim()
    const label = newDiscordLabel[orgId]?.trim() || 'Discord'
    if (!url) return

    const res = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        organizationId: orgId,
        type: 'discord',
        label,
        config: { webhookUrl: url },
      }),
    })

    if (res.ok) {
      const channel = await res.json()
      setChannels((prev) => ({ ...prev, [orgId]: [...(prev[orgId] || []), channel] }))
      setNewDiscordUrl((prev) => ({ ...prev, [orgId]: '' }))
      setNewDiscordLabel((prev) => ({ ...prev, [orgId]: '' }))
    }
  }

  const handleToggleChannel = async (orgId: string, channelId: string, isActive: boolean) => {
    const res = await fetch(`/api/notifications/${channelId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    })

    if (res.ok) {
      setChannels((prev) => ({
        ...prev,
        [orgId]: (prev[orgId] || []).map((c) => c.id === channelId ? { ...c, isActive: !isActive } : c),
      }))
    }
  }

  const handleDeleteChannel = async (orgId: string, channelId: string) => {
    if (!confirm('Remover este canal de notificação?')) return
    const res = await fetch(`/api/notifications/${channelId}`, { method: 'DELETE' })

    if (res.ok) {
      setChannels((prev) => ({
        ...prev,
        [orgId]: (prev[orgId] || []).filter((c) => c.id !== channelId),
      }))
    }
  }

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

  const [webhookUrl, setWebhookUrl] = useState('/api/webhook')

  useEffect(() => {
    setWebhookUrl(`${window.location.origin}/api/webhook`)
  }, [])

  return (
    <TooltipProvider delayDuration={200}>
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
                    <InlineEdit
                      value={org.name}
                      onSave={async (name) => {
                        const res = await fetch(`/api/organizations/${org.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ name }),
                        })
                        if (!res.ok) throw new Error('Failed to update')
                        updateOrganization(org.id, { name })
                        setOrganizations((prev) =>
                          prev.map((o) => (o.id === org.id ? { ...o, name } : o))
                        )
                      }}
                    />
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
                          <InlineEdit
                            value={phone.label}
                            onSave={async (label) => {
                              const res = await fetch(`/api/phones/${phone.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ label }),
                              })
                              if (!res.ok) throw new Error('Failed to update')
                              setOrganizations((prev) =>
                                prev.map((o) =>
                                  o.id === org.id
                                    ? { ...o, phoneNumbers: (o.phoneNumbers || []).map((p) => p.id === phone.id ? { ...p, label } : p) }
                                    : o
                                )
                              )
                            }}
                          />
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

        {/* Notifications */}
        <section>
          <h2 className="text-base font-semibold font-[family-name:var(--font-heading)] mb-3">Notificações</h2>
          <p className="text-xs text-muted-foreground mb-3">
            Receba notificações quando mensagens chegarem no WhatsApp.
          </p>
          <div className="space-y-4">
            {organizations.map((org) => (
              <div key={org.id} className="rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: org.color }} />
                  <span className="text-sm font-medium">{org.name}</span>
                </div>

                {/* Existing channels */}
                {(channels[org.id] || []).map((channel) => (
                  <div key={channel.id} className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{channel.label}</span>
                      <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{channel.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground"
                        onClick={() => handleToggleChannel(org.id, channel.id, channel.isActive)}
                        title={channel.isActive ? 'Desativar' : 'Ativar'}
                      >
                        {channel.isActive ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteChannel(org.id, channel.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Add Discord channel */}
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      placeholder="Label (ex: Geral)"
                      value={newDiscordLabel[org.id] || ''}
                      onChange={(e) => setNewDiscordLabel((prev) => ({ ...prev, [org.id]: e.target.value }))}
                      className="h-8 text-xs flex-[1]"
                    />
                    <Input
                      placeholder="Discord Webhook URL"
                      value={newDiscordUrl[org.id] || ''}
                      onChange={(e) => setNewDiscordUrl((prev) => ({ ...prev, [org.id]: e.target.value }))}
                      className="h-8 text-xs flex-[2]"
                    />
                    <Button
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => handleAddDiscord(org.id)}
                      disabled={!newDiscordUrl[org.id]?.trim()}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Discord
                    </Button>
                  </div>
                </div>
              </div>
            ))}
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
    </TooltipProvider>
  )
}

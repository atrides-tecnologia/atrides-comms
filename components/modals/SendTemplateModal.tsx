'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUIStore } from '@/stores/uiStore'
import { useChatStore } from '@/stores/chatStore'
import type { MessageTemplate } from '@/types'

export function SendTemplateModal() {
  const open = useUIStore((s) => s.sendTemplateModalOpen)
  const setOpen = useUIStore((s) => s.setSendTemplateModalOpen)
  const selectedConversationId = useChatStore((s) => s.selectedConversationId)
  const conversations = useChatStore((s) => s.conversations)

  const [templates, setTemplates] = useState<MessageTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [variables, setVariables] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const conversation = conversations.find((c) => c.id === selectedConversationId)

  // Load templates when conversation's phone changes
  useEffect(() => {
    if (!conversation) return
    // For now, templates are loaded from database
    // In the future, add a sync button
  }, [conversation])

  const template = templates.find((t) => t.id === selectedTemplate)

  // Extract variable count from template components
  const varCount = template?.components
    ? JSON.stringify(template.components).match(/\{\{\d+\}\}/g)?.length || 0
    : 0

  useEffect(() => {
    setVariables(new Array(varCount).fill(''))
  }, [varCount])

  const handleSend = async () => {
    if (!selectedConversationId || !template) return
    setLoading(true)

    try {
      await fetch('/api/messages/template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversationId,
          templateName: template.templateName,
          language: template.language,
          components: variables.length > 0
            ? [{
                type: 'body',
                parameters: variables.map((v) => ({ type: 'text', text: v })),
              }]
            : undefined,
        }),
      })

      setOpen(false)
      setSelectedTemplate('')
      setVariables([])
    } catch (error) {
      console.error('Send template error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar Template</DialogTitle>
          <DialogDescription>Selecione um template aprovado para enviar</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Template</label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="flex h-9 w-full rounded-lg border border-border bg-input px-3 py-1 text-sm"
            >
              <option value="">Selecione um template...</option>
              {templates
                .filter((t) => t.status === 'approved')
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.templateName} ({t.language})
                  </option>
                ))}
            </select>
          </div>

          {variables.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Variáveis</label>
              {variables.map((v, i) => (
                <Input
                  key={i}
                  placeholder={`{{${i + 1}}}`}
                  value={v}
                  onChange={(e) => {
                    const newVars = [...variables]
                    newVars[i] = e.target.value
                    setVariables(newVars)
                  }}
                />
              ))}
            </div>
          )}

          {templates.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum template sincronizado. Sincronize os templates nas configurações.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSend} disabled={!selectedTemplate || loading}>
            {loading ? 'Enviando...' : 'Enviar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

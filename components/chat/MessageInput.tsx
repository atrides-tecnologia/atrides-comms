'use client'

import { useState, useRef, useCallback, KeyboardEvent } from 'react'
import { Send, FileText, Paperclip, Smile } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'

interface MessageInputProps {
  onSend: (text: string) => void
  disabled?: boolean
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const setSendTemplateModalOpen = useUIStore((s) => s.setSendTemplateModalOpen)

  const handleSend = useCallback(() => {
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setText('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [text, onSend])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`
    }
  }

  return (
    <div className="p-3 bg-background">
      <div className="flex items-end gap-2 rounded-2xl bg-muted px-3 py-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Escreva sua mensagem..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent text-[13px] placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 py-1"
        />

        <div className="flex items-center gap-0.5 shrink-0">
          <button
            className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-50"
            disabled
            title="Emoji (em breve)"
          >
            <Smile className="h-4 w-4" />
          </button>

          <button
            className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-50"
            disabled
            title="Anexar (em breve)"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          <button
            className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
            onClick={() => setSendTemplateModalOpen(true)}
            title="Enviar template"
          >
            <FileText className="h-4 w-4" />
          </button>

          <button
            onClick={handleSend}
            disabled={disabled || !text.trim()}
            className="h-9 w-9 flex items-center justify-center rounded-full bg-accent text-accent-foreground hover:opacity-90 disabled:opacity-40 ml-1"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

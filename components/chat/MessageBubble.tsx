'use client'

import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { MessageStatus } from './MessageStatus'
import type { Message } from '@/types'

interface MessageBubbleProps {
  message: Message
  isSameSenderAsPrevious: boolean
}

export function MessageBubble({ message, isSameSenderAsPrevious }: MessageBubbleProps) {
  const isOutbound = message.direction === 'outbound'
  const time = format(new Date(message.timestamp), 'HH:mm')

  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return <p className="text-[13px] whitespace-pre-wrap break-words">{message.content.text}</p>
      case 'image':
        return (
          <div>
            <div className="rounded-lg bg-black/10 h-48 flex items-center justify-center text-xs text-muted-foreground">
              [Imagem]
            </div>
            {message.content.caption && (
              <p className="text-[13px] mt-1">{message.content.caption}</p>
            )}
          </div>
        )
      case 'document':
        return (
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-black/10 flex items-center justify-center text-[10px] font-bold">
              DOC
            </div>
            <span className="text-[13px]">{message.content.filename || 'Documento'}</span>
          </div>
        )
      case 'audio':
        return <p className="text-[13px] italic">[Áudio]</p>
      case 'video':
        return <p className="text-[13px] italic">[Vídeo]</p>
      case 'sticker':
        return <p className="text-[13px]">[Sticker]</p>
      case 'location':
        return <p className="text-[13px] italic">[Localização]</p>
      case 'template':
        return (
          <div>
            <p className="text-[11px] font-medium opacity-70 mb-1">Template: {message.content.templateName}</p>
            <p className="text-[13px]">{message.content.text}</p>
          </div>
        )
      default:
        return <p className="text-[13px]">{message.content.text || `[${message.type}]`}</p>
    }
  }

  return (
    <div
      className={cn(
        'flex message-enter',
        isOutbound ? 'justify-end' : 'justify-start',
        isSameSenderAsPrevious ? 'mt-1' : 'mt-3'
      )}
    >
      <div
        className={cn(
          'max-w-[65%] px-3 py-2',
          isOutbound
            ? 'bg-bubble-outbound text-bubble-outbound-text rounded-[16px_16px_4px_16px]'
            : 'bg-bubble-inbound text-bubble-inbound-text rounded-[16px_16px_16px_4px]'
        )}
      >
        {renderContent()}
        <div className={cn('flex items-center justify-end gap-1 mt-0.5', isOutbound ? 'text-white/70' : 'text-muted-foreground')}>
          <span className="text-[11px]">{time}</span>
          {isOutbound && <MessageStatus status={message.status} />}
        </div>
      </div>
    </div>
  )
}

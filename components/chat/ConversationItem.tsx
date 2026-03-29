'use client'

import { cn, formatPhoneNumber, getInitials, stringToColor, relativeTime, truncate } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { Conversation } from '@/types'

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
}

export function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  const displayName = conversation.contactName || formatPhoneNumber(conversation.contactPhone)
  const initials = conversation.contactName
    ? getInitials(conversation.contactName)
    : '#'
  const avatarColor = stringToColor(conversation.contactPhone)

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
        isActive
          ? 'bg-accent/10'
          : 'hover:bg-hover'
      )}
    >
      <Avatar className="h-10 w-10 shrink-0">
        {conversation.contactAvatarUrl && (
          <AvatarImage src={conversation.contactAvatarUrl} alt={displayName} />
        )}
        <AvatarFallback style={{ backgroundColor: avatarColor, color: 'white' }} className="text-xs font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className={cn('text-sm font-medium truncate', isActive && 'text-accent')}>
            {displayName}
          </span>
          <span className="text-[11px] text-muted-foreground shrink-0 ml-2">
            {relativeTime(conversation.lastMessageAt)}
          </span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-[13px] text-muted-foreground truncate">
            {conversation.lastMessagePreview
              ? truncate(conversation.lastMessagePreview, 50)
              : 'Sem mensagens'}
          </p>
          {conversation.unreadCount > 0 && (
            <Badge variant="unread" className="ml-2 text-[10px] h-[18px] min-w-[18px] shrink-0">
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </button>
  )
}

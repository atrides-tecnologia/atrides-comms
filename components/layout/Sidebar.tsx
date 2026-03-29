'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Phone, Plus, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useChatStore } from '@/stores/chatStore'
import { useUIStore } from '@/stores/uiStore'
import type { Organization } from '@/types'

function OrgItem({ org }: { org: Organization }) {
  const [expanded, setExpanded] = useState(true)
  const selectedPhoneNumberId = useChatStore((s) => s.selectedPhoneNumberId)
  const selectPhoneNumber = useChatStore((s) => s.selectPhoneNumber)

  const phones = org.phoneNumbers || []

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium hover:bg-hover transition-colors"
      >
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
        <span
          className="h-2.5 w-2.5 rounded-full shrink-0"
          style={{ backgroundColor: org.color }}
        />
        <span className="truncate">{org.name}</span>
      </button>

      {expanded && phones.length > 0 && (
        <div className="ml-4 space-y-0.5">
          {phones.map((phone) => (
            <button
              key={phone.id}
              onClick={() => selectPhoneNumber(phone.id)}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] transition-colors',
                selectedPhoneNumberId === phone.id
                  ? 'bg-accent/10 text-accent font-medium'
                  : 'text-muted-foreground hover:bg-hover hover:text-foreground'
              )}
            >
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{phone.label}</span>
              {phone.totalUnread > 0 && (
                <Badge variant="unread" className="ml-auto text-[10px] h-4">
                  {phone.totalUnread}
                </Badge>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const organizations = useChatStore((s) => s.organizations)
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const setNewProjectModalOpen = useUIStore((s) => s.setNewProjectModalOpen)
  const setAddPhoneModalOpen = useUIStore((s) => s.setAddPhoneModalOpen)

  return (
    <aside
      className={cn(
        'flex h-full w-[220px] flex-col border-r border-border bg-sidebar transition-all duration-200',
        'max-lg:absolute max-lg:z-40 max-lg:shadow-lg',
        !sidebarOpen && 'max-lg:-translate-x-full'
      )}
    >
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-1">
          {organizations.map((org) => (
            <OrgItem key={org.id} org={org} />
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 space-y-1">
        <Separator className="mb-2" />
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sm h-8"
          onClick={() => setNewProjectModalOpen(true)}
        >
          <Plus className="h-3.5 w-3.5" />
          Novo Projeto
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sm h-8"
          onClick={() => setAddPhoneModalOpen(true)}
        >
          <Phone className="h-3.5 w-3.5" />
          Adicionar Número
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sm h-8"
          asChild
        >
          <a href="/settings">
            <Settings className="h-3.5 w-3.5" />
            Configurações
          </a>
        </Button>
      </div>
    </aside>
  )
}

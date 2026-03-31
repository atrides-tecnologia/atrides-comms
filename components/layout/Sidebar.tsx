'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Phone, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { SidebarSkeleton } from '@/components/chat/SidebarSkeleton'
import { EmptyState } from '@/components/chat/EmptyState'
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
                'relative flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] transition-colors',
                selectedPhoneNumberId === phone.id
                  ? 'bg-accent/10 text-accent font-medium'
                  : 'text-muted-foreground hover:bg-hover hover:text-foreground'
              )}
            >
              {selectedPhoneNumberId === phone.id && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-accent" />
              )}
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
  const loadingOrganizations = useChatStore((s) => s.loadingOrganizations)
  const orgPanelOpen = useUIStore((s) => s.orgPanelOpen)
  const setNewProjectModalOpen = useUIStore((s) => s.setNewProjectModalOpen)
  const setAddPhoneModalOpen = useUIStore((s) => s.setAddPhoneModalOpen)

  if (!orgPanelOpen) return null

  const renderContent = () => {
    if (loadingOrganizations) {
      return <SidebarSkeleton />
    }

    if (organizations.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center p-3">
          <EmptyState variant="no-org" />
        </div>
      )
    }

    return (
      <div className="space-y-1">
        {organizations.map((org) => (
          <OrgItem key={org.id} org={org} />
        ))}
      </div>
    )
  }

  return (
    <aside className="hidden md:flex h-full w-[220px] flex-col border-r border-border bg-sidebar">
      <div className="flex h-14 items-center justify-between px-4 border-b border-border">
        <h2 className="text-sm font-semibold font-[family-name:var(--font-heading)]">Organizações</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setNewProjectModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-3">
        {renderContent()}
      </ScrollArea>

      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sm h-8 text-muted-foreground"
          onClick={() => setAddPhoneModalOpen(true)}
        >
          <Phone className="h-3.5 w-3.5" />
          Adicionar Número
        </Button>
      </div>
    </aside>
  )
}

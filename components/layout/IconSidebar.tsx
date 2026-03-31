'use client'

import { MessageSquare, Building2, Settings, Menu } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import Link from 'next/link'

export function IconSidebar() {
  const orgPanelOpen = useUIStore((s) => s.orgPanelOpen)
  const toggleOrgPanel = useUIStore((s) => s.toggleOrgPanel)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)

  return (
    <aside className="hidden md:flex w-14 flex-col items-center bg-icon-sidebar py-4 gap-1">
      {/* Brand */}
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground font-bold text-lg font-[family-name:var(--font-heading)] mb-4">
        A
      </div>

      {/* Nav icons */}
      <nav className="flex flex-1 flex-col items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/10">
              <MessageSquare className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Conversas</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleOrgPanel}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl',
                orgPanelOpen
                  ? 'text-white bg-white/10'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              <Building2 className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Organizações</TooltipContent>
        </Tooltip>
      </nav>

      {/* Bottom icons */}
      <div className="flex flex-col items-center gap-1">
        <ThemeToggle />

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/settings"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/10"
            >
              <Settings className="h-5 w-5" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Configurações</TooltipContent>
        </Tooltip>
      </div>
    </aside>
  )
}

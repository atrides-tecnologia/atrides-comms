'use client'

import { Search, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from './ThemeToggle'
import { useUIStore } from '@/stores/uiStore'

export function Header() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold font-[family-name:var(--font-heading)] text-foreground">
          Atrides Comms
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="h-8 w-56 pl-8 text-xs"
          />
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}

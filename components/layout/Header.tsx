'use client'

import { Menu, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'
import { useUIStore } from '@/stores/uiStore'
import { supabase } from '@/lib/supabase/client'

export function Header() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

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
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleLogout}
          title="Sair"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}

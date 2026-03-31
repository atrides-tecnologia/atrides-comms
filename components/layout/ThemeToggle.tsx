'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="h-10 w-10" />
  }

  const isDark = theme === 'dark'

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/10 relative overflow-hidden"
        >
          <Sun
            className="h-5 w-5 absolute"
            style={{
              transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0)',
              opacity: isDark ? 1 : 0,
              transitionProperty: 'transform, opacity',
              transitionDuration: 'var(--duration-medium)',
              transitionTimingFunction: 'var(--ease-out)',
            }}
          />
          <Moon
            className="h-5 w-5 absolute"
            style={{
              transform: isDark ? 'rotate(-90deg) scale(0)' : 'rotate(0deg) scale(1)',
              opacity: isDark ? 0 : 1,
              transitionProperty: 'transform, opacity',
              transitionDuration: 'var(--duration-medium)',
              transitionTimingFunction: 'var(--ease-out)',
            }}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">{isDark ? 'Modo claro' : 'Modo escuro'}</TooltipContent>
    </Tooltip>
  )
}

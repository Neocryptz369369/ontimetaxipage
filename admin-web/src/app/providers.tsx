'use client'
import { useEffect } from 'react'
import { initObservability } from '@/lib/observability'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => { initObservability() }, [])
  return <>{children}</>
}

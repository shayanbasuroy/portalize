'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useRealtimeDeliverables(projectId: string, initialDeliverables: any[]) {
  const [deliverables, setDeliverables] = useState(initialDeliverables)
  
  useEffect(() => {
    if (!projectId) return
    
    const supabase = createClient()
    
    const channel = supabase
      .channel(`deliverables-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deliverables',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setDeliverables((prev) => [...prev, payload.new])
          } else if (payload.eventType === 'UPDATE') {
            setDeliverables((prev) => 
              prev.map((item) => item.id === payload.new.id ? { ...item, ...payload.new } : item)
            )
          } else if (payload.eventType === 'DELETE') {
            setDeliverables((prev) => prev.filter((item) => item.id !== payload.old.id))
          }
        }
      )
      .subscribe()
      
    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId])

  return deliverables
}

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useRealtimeProject(initialProject: any) {
  const [project, setProject] = useState(initialProject)
  
  useEffect(() => {
    if (!project?.id) return
    
    const supabase = createClient()
    
    const channel = supabase
      .channel(`project-${project.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${project.id}`
        },
        (payload) => {
          setProject((prev: any) => ({
            ...prev,
            ...payload.new
          }))
        }
      )
      .subscribe()
      
    return () => {
      supabase.removeChannel(channel)
    }
  }, [project?.id])

  return project
}

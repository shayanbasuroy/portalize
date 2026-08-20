import React from 'react'

interface EmbedViewerProps {
  url: string
}

export function EmbedViewer({ url }: EmbedViewerProps) {
  const getEmbedUrl = (rawUrl: string) => {
    try {
      const urlObj = new URL(rawUrl)
      
      // Figma
      if (urlObj.hostname.includes('figma.com')) {
        return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(rawUrl)}`
      }
      
      // YouTube
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        const videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop()
        return `https://www.youtube.com/embed/${videoId}`
      }
      
      // Loom
      if (urlObj.hostname.includes('loom.com')) {
        const videoId = urlObj.pathname.split('/').pop()
        return `https://www.loom.com/embed/${videoId}`
      }
      
      return rawUrl
    } catch {
      return rawUrl
    }
  }

  const embedUrl = getEmbedUrl(url)

  return (
    <div className="relative aspect-video w-full bg-zinc-100">
      <iframe
        src={embedUrl}
        className="absolute top-0 left-0 w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </div>
  )
}

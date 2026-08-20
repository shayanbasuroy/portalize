import React from 'react'

interface ImageViewerProps {
  src: string
  alt?: string
}

export function ImageViewer({ src, alt = 'Image preview' }: ImageViewerProps) {
  return (
    <div className="flex min-h-[200px] items-center justify-center bg-zinc-50/80 p-4">
      <img
        src={src}
        alt={alt}
        className="max-h-[600px] w-auto max-w-full rounded-md border object-contain"
      />
    </div>
  )
}

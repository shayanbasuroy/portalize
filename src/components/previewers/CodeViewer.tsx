'use client'

import React from 'react'
import Editor from '@monaco-editor/react'

interface CodeViewerProps {
  code: string
  language?: string
  isPaid?: boolean
}

export function CodeViewer({ code, language = 'javascript', isPaid = false }: CodeViewerProps) {
  // Approximate lines to set height
  const lineCount = (code.match(/\n/g) || '').length + 1
  const height = Math.min(Math.max(lineCount * 21, 200), 500) // 21px per line approx

  return (
    <div 
      className="relative w-full border-t border-b" 
      style={{ height: `${height}px` }}
      onContextMenu={(e) => {
        if (!isPaid) {
          e.preventDefault()
        }
      }}
    >
      <Editor
        height="100%"
        language={language}
        theme="vs-dark"
        value={code}
        options={{
          readOnly: true,
          domReadOnly: !isPaid,
          minimap: { enabled: true },
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          contextmenu: isPaid,
          selectionClipboard: isPaid,
        }}
        loading={
          <div className="flex h-full items-center justify-center bg-[#1e1e1e] text-zinc-400">
            Loading editor...
          </div>
        }
      />
    </div>
  )
}

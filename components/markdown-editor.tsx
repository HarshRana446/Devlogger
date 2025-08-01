"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MarkdownRenderer } from "./markdown-renderer"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [mode, setMode] = useState<"edit" | "preview">("edit")

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-gray-800/50 px-4 py-2 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Button
            variant={mode === "edit" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMode("edit")}
            className="text-xs"
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            variant={mode === "preview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMode("preview")}
            className="text-xs"
          >
            <Eye className="w-3 h-3 mr-1" />
            Preview
          </Button>
        </div>
        <span className="text-xs text-gray-400">Markdown supported</span>
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        {mode === "edit" ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Write your log in markdown..."}
            className="min-h-[300px] border-0 bg-black/30 resize-none focus:ring-0 font-mono text-sm"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="p-4 min-h-[300px] bg-black/30"
          >
            {value ? (
              <MarkdownRenderer content={value} />
            ) : (
              <p className="text-gray-500 italic">Nothing to preview yet...</p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

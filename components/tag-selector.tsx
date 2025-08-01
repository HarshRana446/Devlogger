"use client"

import { useState, type KeyboardEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface TagSelectorProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
  suggestions?: string[]
}

const commonTags = [
  "React",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "Python",
  "API",
  "Database",
  "MongoDB",
  "PostgreSQL",
  "CSS",
  "HTML",
  "Git",
  "Docker",
  "AWS",
  "Bug Fix",
  "Feature",
  "Learning",
  "Tutorial",
  "Project",
  "Debug",
]

export function TagSelector({
  selectedTags,
  onTagsChange,
  placeholder = "Add tags...",
  suggestions = commonTags,
}: TagSelectorProps) {
  const [inputValue, setInputValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredSuggestions = suggestions.filter(
    (tag) => tag.toLowerCase().includes(inputValue.toLowerCase()) && !selectedTags.includes(tag),
  )

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      onTagsChange([...selectedTags, trimmedTag])
    }
    setInputValue("")
    setShowSuggestions(false)
  }

  const removeTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === "Backspace" && !inputValue && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1])
    }
  }

  return (
    <div className="space-y-3">
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {selectedTags.map((tag) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border-blue-500/30 pr-1"
                >
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTag(tag)}
                    className="ml-1 h-4 w-4 p-0 hover:bg-red-500/20"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setShowSuggestions(true)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="bg-black/50 border-gray-700 focus:border-blue-500 transition-colors"
        />

        {/* Suggestions */}
        <AnimatePresence>
          {showSuggestions && (inputValue || filteredSuggestions.length > 0) && (
            <>
              {/* Backdrop to close dropdown */}
              <div className="fixed inset-0 z-40" onClick={() => setShowSuggestions(false)} />

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto"
                style={{ zIndex: 9999 }}
              >
                {inputValue && !selectedTags.includes(inputValue.trim()) && (
                  <button
                    onMouseDown={(e) => e.preventDefault()} // Prevent blur on click
                    onClick={() => addTag(inputValue)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-800 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2 text-green-400" />
                    Add "{inputValue.trim()}"
                  </button>
                )}

                {filteredSuggestions.map((tag) => (
                  <button
                    key={tag}
                    onMouseDown={(e) => e.preventDefault()} // Prevent blur on click
                    onClick={() => addTag(tag)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-800 transition-colors text-gray-300"
                  >
                    {tag}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

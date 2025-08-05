"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface TagSelectorProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  availableTags?: string[]
  placeholder?: string
}

export function TagSelector({
  selectedTags,
  onTagsChange,
  availableTags = [],
  placeholder = "Add tags...",
}: TagSelectorProps) {
  const [inputValue, setInputValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredSuggestions = availableTags.filter(
    (tag) =>
      tag.toLowerCase().includes(inputValue.toLowerCase()) && !selectedTags.includes(tag) && inputValue.length > 0,
  )

  const addTag = (tag: string) => {
    if (tag.trim() && !selectedTags.includes(tag.trim())) {
      onTagsChange([...selectedTags, tag.trim()])
      setInputValue("")
      setShowSuggestions(false)
    }
  }

  const removeTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === "Backspace" && !inputValue && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1])
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 p-3 border border-gray-700 rounded-lg bg-gray-900/50 focus-within:border-blue-500 transition-colors">
        {selectedTags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="bg-blue-600/20 text-blue-300 border-blue-500/30 hover:bg-blue-600/30"
          >
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-blue-200 transition-colors">
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setShowSuggestions(e.target.value.length > 0)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(inputValue.length > 0)}
          placeholder={selectedTags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] border-none bg-transparent p-0 focus:ring-0 focus:outline-none"
        />
        {inputValue && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => addTag(inputValue)}
            className="h-6 px-2 text-xs"
          >
            <Plus className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Suggestions Dropdown with highest z-index */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <>
          {/* Backdrop to ensure proper layering */}
          <div className="fixed inset-0 z-[999998]" onClick={() => setShowSuggestions(false)} />

          {/* Suggestions dropdown */}
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-[999999] max-h-48 overflow-y-auto">
            {filteredSuggestions.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addTag(tag)}
                className="w-full text-left px-3 py-2 hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
              >
                {tag}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

interface TagFilterProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  availableTags: string[]
}

export function TagFilter({ selectedTags, onTagsChange, availableTags }: TagFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const clearFilters = () => {
    onTagsChange([])
  }

  return (
    <div className="relative">
      <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="border-gray-700 hover:border-gray-600">
        <Filter className="w-4 h-4 mr-2" />
        Tags
        {selectedTags.length > 0 && (
          <Badge variant="secondary" className="ml-2 bg-blue-600 text-white">
            {selectedTags.length}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-20 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-white">Filter by Tags</h3>
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Clear all
                </Button>
              )}
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableTags.length === 0 ? (
                <p className="text-sm text-gray-500">No tags available</p>
              ) : (
                availableTags.map((tag) => (
                  <label key={tag} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-1 rounded">
                    <Checkbox checked={selectedTags.includes(tag)} onCheckedChange={() => toggleTag(tag)} />
                    <span className="text-sm text-gray-300">{tag}</span>
                  </label>
                ))
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="w-full mt-3 text-gray-400 hover:text-white"
            >
              Close
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />}
    </div>
  )
}

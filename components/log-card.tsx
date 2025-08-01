"use client"

import type React from "react"

import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar, Tag, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface Log {
  _id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
}

interface LogCardProps {
  log: Log
  onDelete: () => void
}

export function LogCard({ log, onDelete }: LogCardProps) {
  const { toast } = useToast()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm("Are you sure you want to delete this log?")) return

    try {
      const response = await fetch(`/api/logs/${log._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        toast({
          title: "Log Deleted",
          description: "Your log has been deleted successfully.",
        })
        onDelete()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete log. Please try again.",
        variant: "destructive",
      })
    }
  }

  const preview = log.content.length > 150 ? log.content.substring(0, 150) + "..." : log.content

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="group">
      <Link href={`/logs/${log._id}`}>
        <div className="glass rounded-xl p-6 h-full transition-all duration-300 hover:border-blue-500/30 cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
              {log.title}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-gray-400 text-sm mb-4 line-clamp-3">{preview}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(log.createdAt).toLocaleDateString()}
            </div>
            {log.tags.length > 0 && (
              <div className="flex items-center">
                <Tag className="w-3 h-3 mr-1 text-gray-500" />
                <span className="text-xs text-gray-500">
                  {log.tags.length} {log.tags.length === 1 ? "tag" : "tags"}
                </span>
              </div>
            )}
          </div>

          {log.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {log.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                  {tag}
                </Badge>
              ))}
              {log.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                  +{log.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

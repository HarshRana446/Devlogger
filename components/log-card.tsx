"use client"

import { motion } from "framer-motion"
import { Calendar, Tag, Edit, Trash2, Eye } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { AnimatedButton } from "@/components/animated-button"
import Link from "next/link"

interface LogCardProps {
  log: {
    _id: string
    title: string
    content: string
    tags: string[]
    createdAt: string
  }
  onDelete: (id: string) => void
  index: number
}

export function LogCard({ log, onDelete, index }: LogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getPreview = (content: string) => {
    return content.replace(/[#*`]/g, '').substring(0, 150) + (content.length > 150 ? '...' : '')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="group relative"
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-xl opacity-0 blur group-hover:opacity-20 transition-opacity duration-300"
      />
      
      <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 hover:border-gray-700/50 transition-all duration-300">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <motion.h3 
            className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors duration-300 line-clamp-2"
            layoutId={`title-${log._id}`}
          >
            {log.title}
          </motion.h3>
          
          <motion.div
            className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Link href={`/logs/${log._id}`}>
              <AnimatedButton size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Eye className="w-4 h-4" />
              </AnimatedButton>
            </Link>
            <Link href={`/logs/${log._id}?edit=true`}>
              <AnimatedButton size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Edit className="w-4 h-4" />
              </AnimatedButton>
            </Link>
            <AnimatedButton 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
              onClick={() => onDelete(log._id)}
            >
              <Trash2 className="w-4 h-4" />
            </AnimatedButton>
          </motion.div>
        </div>

        {/* Content Preview */}
        <motion.p 
          className="text-gray-400 text-sm mb-4 line-clamp-3"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
        >
          {getPreview(log.content)}
        </motion.p>

        {/* Tags */}
        {log.tags.length > 0 && (
          <motion.div 
            className="flex flex-wrap gap-2 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {log.tags.slice(0, 3).map((tag, tagIndex) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + tagIndex * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Badge 
                  variant="secondary" 
                  className="bg-blue-600/20 text-blue-300 border-blue-500/30 hover:bg-blue-600/30 transition-colors"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              </motion.div>
            ))}
            {log.tags.length > 3 && (
              <Badge variant="outline" className="text-gray-400 border-gray-600">
                +{log.tags.length - 3} more
              </Badge>
            )}
          </motion.div>
        )}

        {/* Footer */}
        <motion.div 
          className="flex items-center justify-between text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(log.createdAt)}</span>
          </div>
          
          <motion.div
            className="px-2 py-1 bg-gray-800/50 rounded-full text-xs"
            whileHover={{ scale: 1.05 }}
          >
            {log.content.split(' ').length} words
          </motion.div>
        </motion.div>

        {/* Animated border on hover */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-transparent"
          whileHover={{
            borderImage: "linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4) 1",
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  )
}

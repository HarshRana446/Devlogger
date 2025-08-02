"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { LogCard } from "@/components/log-card"
import { TagFilter } from "@/components/tag-filter"
import { AnimatedButton } from "@/components/animated-button"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/loading-spinner"

interface Log {
  _id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export default function LogsPage() {
  const { user, loading: authLoading } = useAuth()
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])

  useEffect(() => {
    if (user) {
      fetchLogs()
    }
  }, [user])

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setLogs(data)

        // Extract all unique tags
        const tags = new Set<string>()
        data.forEach((log: Log) => {
          log.tags.forEach((tag: string) => tags.add(tag))
        })
        setAllTags(Array.from(tags))
      }
    } catch (error) {
      console.error("Error fetching logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => log.tags.includes(tag))
    return matchesSearch && matchesTags
  })

  if (authLoading || loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 ml-0 md:ml-64 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
            >
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Development Logs
                </h1>
                <p className="text-gray-400 mt-2">Track your coding journey and document your learnings</p>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 sm:mt-0"
              >
                <Link href="/new">
                  <AnimatedButton variant="gradient" glowEffect size="md">
                    <Plus className="w-4 h-4 mr-2" />
                    New Log
                  </AnimatedButton>
                </Link>
              </motion.div>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8 space-y-4"
            >
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-900/50 border-gray-700 focus:border-blue-500"
                />
              </div>

              {/* Tag Filter */}
              {allTags.length > 0 && (
                <TagFilter availableTags={allTags} selectedTags={selectedTags} onTagsChange={setSelectedTags} />
              )}
            </motion.div>

            {/* Logs Grid */}
            {filteredLogs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  {logs.length === 0 ? "No logs yet" : "No logs match your filters"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {logs.length === 0
                    ? "Start documenting your development journey by creating your first log."
                    : "Try adjusting your search or filter criteria."}
                </p>
                {logs.length === 0 && (
                  <Link href="/new">
                    <AnimatedButton variant="gradient" glowEffect size="md">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Log
                    </AnimatedButton>
                  </Link>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredLogs.map((log, index) => (
                  <motion.div
                    key={log._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <LogCard log={log} index={index} onDelete={fetchLogs} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

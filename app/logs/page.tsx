"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogCard } from "@/components/log-card"
import { TagFilter } from "@/components/tag-filter"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { useAuth } from "@/hooks/use-auth"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest")

  useEffect(() => {
    if (!authLoading && user) {
      fetchLogs()
    }
  }, [user, authLoading])

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/logs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setLogs(data)
      }
    } catch (error) {
      console.error("Error fetching logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs
    .filter((log) => {
      const matchesSearch =
        log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.content.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => log.tags.includes(tag))
      return matchesSearch && matchesTags
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortBy === "newest" ? dateB - dateA : dateA - dateB
    })

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-64">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Developer Logs
                </h1>
                <p className="text-gray-400 mt-2">
                  {logs.length} {logs.length === 1 ? "entry" : "entries"} logged
                </p>
              </div>
              <Link href="/new">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                  <Plus className="w-4 h-4 mr-2" />
                  New Log
                </Button>
              </Link>
            </div>

            {/* Filters */}
            <div className="glass rounded-xl p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-black/50 border-gray-700 focus:border-blue-500 transition-colors"
                  />
                </div>
                <TagFilter
                  selectedTags={selectedTags}
                  onTagsChange={setSelectedTags}
                  availableTags={Array.from(new Set(logs.flatMap((log) => log.tags)))}
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
                  className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:border-blue-500 transition-colors"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            {/* Logs Grid */}
            {filteredLogs.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  {logs.length === 0 ? "No logs yet" : "No logs match your filters"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {logs.length === 0
                    ? "Start logging your development journey today!"
                    : "Try adjusting your search or filter criteria."}
                </p>
                {logs.length === 0 && (
                  <Link href="/new">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Create Your First Log
                    </Button>
                  </Link>
                )}
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLogs.map((log, index) => (
                  <motion.div
                    key={log._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <LogCard log={log} onDelete={fetchLogs} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

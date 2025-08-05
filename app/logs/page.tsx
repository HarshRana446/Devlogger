"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, BookOpen, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogCard } from "@/components/log-card"
import { TagFilter } from "@/components/tag-filter"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { useToast } from "@/hooks/use-toast"

interface Log {
  _id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([])
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchLogs()
  }, [])

  useEffect(() => {
    filterLogs()
  }, [logs, searchTerm, selectedTags])

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/logs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        const data: Log[] = await response.json()
        setLogs(data)

        // Extract all unique tags with proper typing
        const tags: string[] = Array.from(new Set(data.flatMap((log: Log) => log.tags)))
        setAllTags(tags)
      }
    } catch (error) {
      console.error("Error fetching logs:", error)
      toast({
        title: "Error",
        description: "Failed to fetch logs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterLogs = () => {
    let filtered = logs

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.content.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((log) => selectedTags.some((tag) => log.tags.includes(tag)))
    }

    setFilteredLogs(filtered)
  }

  const handleDeleteLog = async (logId: string) => {
    try {
      const response = await fetch(`/api/logs/${logId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        // Remove the deleted log from state
        setLogs(logs.filter((log) => log._id !== logId))
        toast({
          title: "Log Deleted",
          description: "Your log has been deleted successfully.",
        })
      } else {
        throw new Error("Failed to delete log")
      }
    } catch (error) {
      console.error("Error deleting log:", error)
      toast({
        title: "Error",
        description: "Failed to delete log. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
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
        <main className="flex-1 p-4 md:p-6 ml-0 md:ml-64 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"
                >
                  <BookOpen className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Development Logs</h1>
                  <p className="text-gray-400 text-sm md:text-base">
                    {filteredLogs.length} {filteredLogs.length === 1 ? "log" : "logs"} found
                  </p>
                </div>
              </div>

              <Link href="/new">
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 w-full md:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  New Log
                </Button>
              </Link>
            </div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-xl p-4 md:p-6 mb-8"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-black/50 border-gray-700 focus:border-blue-500"
                  />
                </div>

                {/* Tag Filter */}
                <div className="lg:w-80">
                  <TagFilter availableTags={allTags} selectedTags={selectedTags} onTagsChange={setSelectedTags} />
                </div>
              </div>
            </motion.div>

            {/* Logs Grid */}
            {filteredLogs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center py-16"
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                  className="inline-block mb-6"
                >
                  <Sparkles className="w-16 h-16 text-gray-600" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-300 mb-4">
                  {searchTerm || selectedTags.length > 0 ? "No logs match your filters" : "No logs yet"}
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  {searchTerm || selectedTags.length > 0
                    ? "Try adjusting your search terms or selected tags to find what you're looking for."
                    : "Start documenting your development journey by creating your first log entry."}
                </p>
                {!searchTerm && selectedTags.length === 0 && (
                  <Link href="/new">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Log
                    </Button>
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
                <AnimatePresence>
                  {filteredLogs.map((log, index) => (
                    <LogCard key={log._id} log={log} onDelete={handleDeleteLog} index={index} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

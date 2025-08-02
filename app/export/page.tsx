"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Download, FileText, Calendar, Tag } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { AnimatedButton } from "@/components/animated-button"
import { useToast } from "@/hooks/use-toast"

interface Log {
  _id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
}

export default function ExportPage() {
  const { toast } = useToast()
  const [logs, setLogs] = useState<Log[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [exportFormat, setExportFormat] = useState<"pdf" | "markdown">("pdf")
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetchLogs()
  }, [])

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
    }
  }

  const allTags = Array.from(new Set(logs.flatMap((log) => log.tags)))

  const filteredLogs = logs.filter((log) => {
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => log.tags.includes(tag))

    const logDate = new Date(log.createdAt)
    const matchesDateRange =
      (!dateRange.start || logDate >= new Date(dateRange.start)) &&
      (!dateRange.end || logDate <= new Date(dateRange.end))

    return matchesTags && matchesDateRange
  })

  const handleExport = async () => {
    if (filteredLogs.length === 0) {
      toast({
        title: "No logs to export",
        description: "Please adjust your filters to include some logs.",
        variant: "destructive",
      })
      return
    }

    setExporting(true)
    try {
      const response = await fetch(`/api/export/${exportFormat}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          logs: filteredLogs.map((log) => log._id),
          tags: selectedTags,
          dateRange,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `devlogger-export.${exportFormat === "pdf" ? "pdf" : "md"}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Export Complete",
          description: `Your logs have been exported as ${exportFormat.toUpperCase()}.`,
        })
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export logs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 ml-0 md:ml-64 pt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Export Logs
                </h1>
                <p className="text-gray-400 mt-2">Export your development logs as PDF or Markdown</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Export Options */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Format Selection */}
                  <div className="glass rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Export Format
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setExportFormat("pdf")}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          exportFormat === "pdf"
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-gray-700 hover:border-gray-600"
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">📄</div>
                          <div className="font-medium">PDF</div>
                          <div className="text-sm text-gray-400">Formatted document</div>
                        </div>
                      </button>
                      <button
                        onClick={() => setExportFormat("markdown")}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          exportFormat === "markdown"
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-gray-700 hover:border-gray-600"
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">📝</div>
                          <div className="font-medium">Markdown</div>
                          <div className="text-sm text-gray-400">Raw text format</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Date Range Filter */}
                  <div className="glass rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Date Range
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">From</label>
                        <input
                          type="date"
                          value={dateRange.start}
                          onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                          className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded-lg focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">To</label>
                        <input
                          type="date"
                          value={dateRange.end}
                          onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                          className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded-lg focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tag Filter */}
                  <div className="glass rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Tag className="w-5 h-5 mr-2" />
                      Filter by Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <label key={tag} className="flex items-center space-x-2 cursor-pointer">
                          <Checkbox
                            checked={selectedTags.includes(tag)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedTags((prev) => [...prev, tag])
                              } else {
                                setSelectedTags((prev) => prev.filter((t) => t !== tag))
                              }
                            }}
                          />
                          <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                            {tag}
                          </Badge>
                        </label>
                      ))}
                    </div>
                    {allTags.length === 0 && <p className="text-gray-500 text-sm">No tags available</p>}
                  </div>
                </div>

                {/* Preview */}
                <div className="glass rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
                  <div className="space-y-4">
                    <div className="text-sm text-gray-400">
                      <div className="flex justify-between">
                        <span>Total logs:</span>
                        <span className="text-white">{logs.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Filtered logs:</span>
                        <span className="text-blue-400">{filteredLogs.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Format:</span>
                        <span className="text-white uppercase">{exportFormat}</span>
                      </div>
                    </div>

                    <AnimatedButton
                      onClick={handleExport}
                      disabled={exporting || filteredLogs.length === 0}
                      variant="gradient"
                      glowEffect
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {exporting ? "Exporting..." : `Export ${filteredLogs.length} Logs`}
                    </AnimatedButton>

                    {filteredLogs.length === 0 && (
                      <p className="text-sm text-gray-500 text-center">No logs match your current filters</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

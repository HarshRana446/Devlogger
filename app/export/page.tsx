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

  // Modified filtering logic - if no filters selected, include all logs
  const filteredLogs = logs.filter((log) => {
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => log.tags.includes(tag))

    const logDate = new Date(log.createdAt)
    const matchesDateRange =
      (!dateRange.start || logDate >= new Date(dateRange.start)) &&
      (!dateRange.end || logDate <= new Date(dateRange.end))

    return matchesTags && matchesDateRange
  })

  // Use all logs if no filters are applied
  const logsToExport = selectedTags.length === 0 && !dateRange.start && !dateRange.end ? logs : filteredLogs

  const generatePDF = (logs: Log[]) => {
    // Create HTML content for PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>DevLogger Export</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #007bff; padding-bottom: 20px; }
        .header h1 { color: #007bff; margin: 0; }
        .header p { color: #666; margin: 5px 0; }
        .log { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .log-title { color: #007bff; font-size: 18px; font-weight: bold; margin-bottom: 10px; }
        .log-meta { color: #666; font-size: 14px; margin-bottom: 15px; }
        .log-tags { margin: 10px 0; }
        .tag { background: #e3f2fd; color: #1976d2; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 5px; }
        .log-content { line-height: 1.6; white-space: pre-wrap; }
        .separator { border-top: 1px solid #eee; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>DevLogger Export Report</h1>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
        <p>Total Logs: ${logs.length}</p>
    </div>
    
    ${logs
      .map(
        (log, index) => `
        <div class="log">
            <div class="log-title">Log #${index + 1}: ${log.title}</div>
            <div class="log-meta">
                <strong>Date:</strong> ${new Date(log.createdAt).toLocaleDateString()} | 
                <strong>Time:</strong> ${new Date(log.createdAt).toLocaleTimeString()}
            </div>
            ${
              log.tags.length > 0
                ? `<div class="log-tags">
                     <strong>Tags:</strong> ${log.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
                   </div>`
                : ""
            }
            <div class="log-content">${log.content}</div>
        </div>
        ${index < logs.length - 1 ? '<div class="separator"></div>' : ""}
    `,
      )
      .join("")}
</body>
</html>
    `

    return htmlContent
  }

  const handleExport = async () => {
    if (logsToExport.length === 0) {
      toast({
        title: "No logs to export",
        description: "You don't have any logs to export yet.",
        variant: "destructive",
      })
      return
    }

    setExporting(true)
    try {
      if (exportFormat === "pdf") {
        // Generate HTML content for PDF
        const htmlContent = generatePDF(logsToExport)

        // Create blob with HTML content and proper PDF MIME type
        const blob = new Blob([htmlContent], { type: "text/html" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `devlogger-export-${new Date().toISOString().split("T")[0]}.html`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        // Show instructions for PDF conversion
        toast({
          title: "Export Complete",
          description: "HTML file downloaded. Open it in your browser and use 'Print to PDF' to create a PDF.",
        })
      } else {
        // Create Markdown content
        const markdownContent = `# DevLogger Export

**Generated on:** ${new Date().toLocaleDateString()}  
**Total Logs:** ${logsToExport.length}

---

${logsToExport
  .map(
    (log, index) => `
## Log #${index + 1}: ${log.title}

**Date:** ${new Date(log.createdAt).toLocaleDateString()}  
**Tags:** ${log.tags.map((tag) => `\`${tag}\``).join(", ") || "No tags"}

### Content:
${log.content}

---
`,
  )
  .join("\n")}
        `

        const blob = new Blob([markdownContent], { type: "text/markdown" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `devlogger-export-${new Date().toISOString().split("T")[0]}.md`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Export Complete",
          description: `Successfully exported ${logsToExport.length} logs as Markdown.`,
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
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Export Logs
                </h1>
                <p className="text-gray-400 mt-2 text-sm md:text-base">
                  Export your development logs as PDF or Markdown
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Export Options */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Format Selection */}
                  <div className="glass rounded-xl p-4 md:p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Export Format
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          <div className="text-sm text-gray-400">HTML format (Print to PDF)</div>
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
                  <div className="glass rounded-xl p-4 md:p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Date Range (Optional)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">From</label>
                        <input
                          type="date"
                          value={dateRange.start}
                          onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                          className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded-lg focus:border-blue-500 transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">To</label>
                        <input
                          type="date"
                          value={dateRange.end}
                          onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                          className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded-lg focus:border-blue-500 transition-colors text-sm"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Leave empty to export all logs</p>
                  </div>

                  {/* Tag Filter */}
                  <div className="glass rounded-xl p-4 md:p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Tag className="w-5 h-5 mr-2" />
                      Filter by Tags (Optional)
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
                          <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                            {tag}
                          </Badge>
                        </label>
                      ))}
                    </div>
                    {allTags.length === 0 && <p className="text-gray-500 text-sm">No tags available</p>}
                    <p className="text-xs text-gray-500 mt-2">Leave unselected to export all logs</p>
                  </div>
                </div>

                {/* Preview */}
                <div className="glass rounded-xl p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Export Preview</h3>
                  <div className="space-y-4">
                    <div className="text-sm text-gray-400">
                      <div className="flex justify-between">
                        <span>Total logs:</span>
                        <span className="text-white">{logs.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Will export:</span>
                        <span className="text-blue-400">{logsToExport.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Format:</span>
                        <span className="text-white uppercase">{exportFormat}</span>
                      </div>
                    </div>

                    <AnimatedButton
                      onClick={handleExport}
                      disabled={exporting || logsToExport.length === 0}
                      variant="gradient"
                      glowEffect
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {exporting ? "Exporting..." : `Export ${logsToExport.length} Logs`}
                    </AnimatedButton>

                    {logsToExport.length === 0 && (
                      <p className="text-sm text-gray-500 text-center">No logs available to export</p>
                    )}

                    {logsToExport.length > 0 && (
                      <div className="text-xs text-gray-500 text-center">
                        {selectedTags.length === 0 && !dateRange.start && !dateRange.end
                          ? "Will export ALL logs"
                          : "Will export filtered logs"}
                      </div>
                    )}

                    {exportFormat === "pdf" && (
                      <div className="text-xs text-blue-400 text-center mt-2">
                        💡 Downloads as HTML. Open in browser and use "Print → Save as PDF"
                      </div>
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

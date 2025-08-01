"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Edit, Trash2, Save, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MarkdownEditor } from "@/components/markdown-editor"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { TagSelector } from "@/components/tag-selector"
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
  updatedAt: string
}

export default function LogDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [log, setLog] = useState<Log | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [editTags, setEditTags] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchLog()
    }
  }, [params.id])

  const fetchLog = async () => {
    try {
      const response = await fetch(`/api/logs/${params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setLog(data)
        setEditTitle(data.title)
        setEditContent(data.content)
        setEditTags(data.tags)
      } else {
        router.push("/logs")
      }
    } catch (error) {
      console.error("Error fetching log:", error)
      router.push("/logs")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/logs/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          tags: editTags,
        }),
      })

      if (response.ok) {
        const updatedLog = await response.json()
        setLog(updatedLog)
        setEditing(false)
        toast({
          title: "Log Updated",
          description: "Your log has been updated successfully!",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update log. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this log?")) return

    try {
      const response = await fetch(`/api/logs/${params.id}`, {
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
        router.push("/logs")
      }
    } catch (error) {
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

  if (!log) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-300 mb-4">Log not found</h2>
          <Link href="/logs">
            <Button>Back to Logs</Button>
          </Link>
        </div>
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
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Link href="/logs">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Logs
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-2">
                {editing ? (
                  <>
                    <Button onClick={() => setEditing(false)} variant="ghost" size="sm">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => setEditing(true)}
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={handleDelete}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {editing ? (
                <>
                  {/* Edit Title */}
                  <div className="glass rounded-xl p-6">
                    <label className="block text-sm font-medium text-gray-300 mb-3">Title</label>
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="text-lg bg-black/50 border-gray-700 focus:border-blue-500"
                    />
                  </div>

                  {/* Edit Tags */}
                  <div className="glass rounded-xl p-6 tag-selector-container">
                    <label className="block text-sm font-medium text-gray-300 mb-3">Tags</label>
                    <TagSelector selectedTags={editTags} onTagsChange={setEditTags} />
                  </div>

                  {/* Edit Content */}
                  <div className="glass rounded-xl p-6 markdown-editor-container">
                    <label className="block text-sm font-medium text-gray-300 mb-3">Content</label>
                    <MarkdownEditor value={editContent} onChange={setEditContent} />
                  </div>
                </>
              ) : (
                <>
                  {/* View Title and Meta */}
                  <div className="glass rounded-xl p-6">
                    <h1 className="text-3xl font-bold text-white mb-4">{log.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Created: {new Date(log.createdAt).toLocaleDateString()}</span>
                      {log.updatedAt !== log.createdAt && (
                        <span>Updated: {new Date(log.updatedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                    {log.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {log.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border-blue-500/30"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* View Content */}
                  <div className="glass rounded-xl p-6">
                    <MarkdownRenderer content={log.content} />
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

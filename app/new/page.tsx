"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MarkdownEditor } from "@/components/markdown-editor"
import { TagSelector } from "@/components/tag-selector"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { useToast } from "@/hooks/use-toast"

export default function NewLogPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and content for your log.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, content, tags }),
      })

      if (response.ok) {
        toast({
          title: "Log Saved",
          description: "Your log has been saved successfully!",
        })
        router.push("/logs")
      } else {
        throw new Error("Failed to save log")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save log. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
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
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    New Log Entry
                  </h1>
                  <p className="text-gray-400 mt-2">Document your development journey</p>
                </div>
              </div>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save Log"}
              </Button>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="glass rounded-xl p-6"
              >
                <label className="block text-sm font-medium text-gray-300 mb-3">Title</label>
                <Input
                  placeholder="What did you work on today?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg bg-black/50 border-gray-700 focus:border-blue-500 transition-colors"
                />
              </motion.div>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="glass rounded-xl p-6 tag-selector-container"
              >
                <label className="block text-sm font-medium text-gray-300 mb-3">Tags</label>
                <TagSelector
                  selectedTags={tags}
                  onTagsChange={setTags}
                  placeholder="Add tags (React, API, MongoDB, etc.)"
                />
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="glass rounded-xl p-6 markdown-editor-container"
              >
                <label className="block text-sm font-medium text-gray-300 mb-3">Content</label>
                <MarkdownEditor value={content} onChange={setContent} placeholder="Write your log in markdown..." />
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

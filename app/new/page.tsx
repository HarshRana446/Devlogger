"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { MarkdownEditor } from "@/components/markdown-editor"
import { TagSelector } from "@/components/tag-selector"
import { AnimatedButton } from "@/components/animated-button"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function NewLogPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your log.",
        variant: "destructive",
      })
      return
    }

    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter some content for your log.",
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
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          tags,
        }),
      })

      if (response.ok) {
        toast({
          title: "Log Saved",
          description: "Your development log has been saved successfully.",
        })
        router.push("/logs")
      } else {
        throw new Error("Failed to save log")
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save your log. Please try again.",
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

        <main className="flex-1 ml-0 md:ml-64 pt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Create New Log
                  </h1>
                  <p className="text-gray-400 mt-2 text-sm md:text-base">Document your development journey</p>
                </div>
                <div className="flex gap-3">
                  <Link href="/logs">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-700 hover:border-gray-600 bg-transparent"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  </Link>
                  <AnimatedButton onClick={handleSave} disabled={saving} variant="gradient" glowEffect size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Saving..." : "Save Log"}
                  </AnimatedButton>
                </div>
              </div>

              <div className="space-y-6">
                {/* Title Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass rounded-xl p-4 md:p-6"
                >
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a descriptive title for your log..."
                    className="bg-black/50 border-gray-700 focus:border-blue-500 text-white placeholder-gray-500 text-sm md:text-base"
                  />
                </motion.div>

                {/* Tags */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass rounded-xl p-4 md:p-6"
                >
                  <label className="block text-sm font-medium text-gray-300 mb-3">Tags</label>
                  <TagSelector selectedTags={tags} onTagsChange={setTags} />
                </motion.div>

                {/* Content Editor */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass rounded-xl p-4 md:p-6"
                >
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Content <span className="text-red-400">*</span>
                  </label>
                  <div className="markdown-editor-container">
                    <MarkdownEditor value={content} onChange={setContent} />
                  </div>
                </motion.div>

                {/* Save Button - Mobile */}
                <div className="block sm:hidden">
                  <AnimatedButton
                    onClick={handleSave}
                    disabled={saving}
                    variant="gradient"
                    glowEffect
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Saving..." : "Save Log"}
                  </AnimatedButton>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

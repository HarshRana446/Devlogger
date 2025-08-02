"use client"

import { motion } from "framer-motion"
import { BookOpen, Plus, Download, Home, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { href: "/logs", icon: Home, label: "Dashboard" },
  { href: "/new", icon: Plus, label: "New Log" },
  { href: "/export", icon: Download, label: "Export" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -280, opacity: 0 },
  }

  const itemVariants = {
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
    closed: {
      opacity: 0,
      x: -20,
    },
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className="fixed top-20 left-4 z-50 md:hidden bg-gray-900/80 backdrop-blur-sm p-2 rounded-lg border border-gray-700"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </motion.button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-70 bg-gray-950/95 backdrop-blur-xl border-r border-gray-800/50 z-50",
          "md:relative md:translate-x-0 md:opacity-100 md:w-64",
        )}
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "open"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="p-6 space-y-2">
          {sidebarItems.map((item, index) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <motion.div key={item.href} custom={index} variants={itemVariants} initial="closed" animate="open">
                <Link href={item.href} onClick={() => setIsOpen(false)}>
                  <motion.div
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                      isActive
                        ? "bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 text-white border border-blue-500/30"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50",
                    )}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10"
                        layoutId="activeTab"
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    <motion.div
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        isActive
                          ? "bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white"
                          : "bg-gray-800 group-hover:bg-gray-700",
                      )}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.div>

                    <span className="font-medium relative z-10">{item.label}</span>

                    {isActive && (
                      <motion.div
                        className="absolute right-2 w-2 h-2 bg-blue-400 rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Decorative Elements */}
        <motion.div
          className="absolute bottom-6 left-6 right-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 border border-gray-700/50">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-gray-300">Quick Tip</span>
            </div>
            <p className="text-xs text-gray-400">Use markdown syntax to format your logs beautifully!</p>
          </div>
        </motion.div>
      </motion.aside>
    </>
  )
}

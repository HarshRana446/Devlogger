"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Plus, Download } from "lucide-react"

const navigation = [
  { name: "All Logs", href: "/logs", icon: BookOpen },
  { name: "New Log", href: "/new", icon: Plus },
  { name: "Export", href: "/export", icon: Download },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gray-900/50 backdrop-blur-sm border-r border-gray-800"
    >
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border border-blue-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </motion.aside>
  )
}

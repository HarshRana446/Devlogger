"use client"

import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { AnimatedLogo } from "@/components/animated-logo"
import { AnimatedButton } from "@/components/animated-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"

export function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <AnimatedLogo size="sm" />
          </motion.div>

          {/* User Section */}
          {user && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-3">
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                  <Avatar className="w-8 h-8 border-2 border-blue-500/30">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <span className="text-sm text-gray-300 hidden sm:block">{user.name}</span>
              </div>

              <AnimatedButton
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-red-400"
              >
                <LogOut className="w-4 h-4" />
              </AnimatedButton>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  )
}

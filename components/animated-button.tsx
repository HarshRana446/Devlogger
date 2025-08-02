"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface AnimatedButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: "default" | "ghost" | "outline" | "gradient"
  size?: "sm" | "md" | "lg"
  glowEffect?: boolean
  className?: string
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export function AnimatedButton({
  children,
  onClick,
  variant = "default",
  size = "md",
  glowEffect = false,
  className = "",
  disabled = false,
  type = "button",
  ...props
}: AnimatedButtonProps) {
  const baseClasses = "relative overflow-hidden transition-all duration-300"

  const variantClasses = {
    default: "bg-gray-900 hover:bg-gray-800 text-white border border-gray-700",
    ghost: "bg-transparent hover:bg-gray-800/50 text-gray-300 hover:text-white",
    outline:
      "bg-transparent border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white hover:bg-gray-800/20",
    gradient:
      "bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white border-0",
  }

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm h-8",
    md: "px-4 py-2 text-sm h-10",
    lg: "px-6 py-3 text-base h-12",
  }

  const glowClasses = glowEffect ? "shadow-lg hover:shadow-xl hover:shadow-blue-500/25" : ""

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
      <Button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], glowClasses, className)}
        {...props}
      >
        {glowEffect && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 opacity-0 hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />
        )}
        <span className="relative z-10">{children}</span>
      </Button>
    </motion.div>
  )
}

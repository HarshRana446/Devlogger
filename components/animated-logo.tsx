"use client"

import { motion } from "framer-motion"
import { Code2 } from "lucide-react"

interface AnimatedLogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function AnimatedLogo({ size = "md", className = "" }: AnimatedLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  const letters = "DevLogger".split("")

  return (
    <motion.div
      className={`flex items-center space-x-3 ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Animated Icon */}
      <motion.div
        className={`${sizeClasses[size]} rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 flex items-center justify-center relative overflow-hidden`}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 opacity-50"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <Code2
          className={`${size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-8 h-8"} text-white relative z-10`}
        />
      </motion.div>

      {/* Animated Text */}
      <div className="flex">
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            className={`${textSizes[size]} font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3,
              repeatType: "reverse",
            }}
            whileHover={{
              scale: 1.1,
              color: "#60A5FA",
              transition: { duration: 0.2 },
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

"use client"

import { motion } from "motion/react"
import { RefreshCw, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

interface ErrorStepProps {
  error: string
  onRetry: () => void
  onSkip: () => void
}

export function ScanError({ error, onRetry, onSkip }: ErrorStepProps) {
  return (
    <div className="flex max-w-5xl flex-col items-center gap-12 md:flex-row">
      <div className="flex flex-1 justify-center">
        <ErrorIllustration />
      </div>
      <div className="flex-1 text-center md:text-left">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white"
        >
          Oops! Something Went Wrong
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8"
        >
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-300">
            <p className="text-sm font-medium">{error}</p>
          </div>

          <p className="text-slate-600 dark:text-slate-300">
            We encountered an issue while scanning your inbox. This could be due to a temporary connection problem or
            limited access to your Gmail account.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <Button onClick={onRetry} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>

          <Button variant="outline" onClick={onSkip}>
            <ArrowRight className="mr-2 h-4 w-4" /> Continue Without Scanning
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

function ErrorIllustration() {
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme || "light"
  const bgColor = theme === "dark" ? "#1e293b" : "#fee2e2"
  const accentColor = theme === "dark" ? "#f87171" : "#ef4444"

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="200" cy="150" r="100" fill={bgColor} />
        <motion.path
          d="M200 100V180"
          stroke={accentColor}
          strokeWidth="12"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        <motion.path
          d="M200 200V210"
          stroke={accentColor}
          strokeWidth="12"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        />
        <motion.circle
          cx="200"
          cy="150"
          r="80"
          stroke={accentColor}
          strokeWidth="6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <circle cx="150" cy="100" r="5" fill={accentColor} />
          <circle cx="250" cy="100" r="5" fill={accentColor} />
          <circle cx="130" cy="200" r="5" fill={accentColor} />
          <circle cx="270" cy="200" r="5" fill={accentColor} />
        </motion.g>
      </svg>
    </motion.div>
  )
}

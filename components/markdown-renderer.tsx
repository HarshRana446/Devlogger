"use client"

import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert prose-blue max-w-none">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "")
            return !inline && match ? (
              <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}>
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
                {children}
              </code>
            )
          },
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">{children}</h1>
          ),
          h2: ({ children }) => <h2 className="text-xl font-semibold text-white mb-3 mt-6">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-medium text-white mb-2 mt-4">{children}</h3>,
          p: ({ children }) => <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-1">{children}</ol>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400 mb-4">{children}</blockquote>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-blue-400 hover:text-blue-300 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

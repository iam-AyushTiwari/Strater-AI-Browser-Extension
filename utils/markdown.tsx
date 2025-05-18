import { cn } from "@sglara/cn"
import katex from "katex"
import { useEffect } from "react"

import "katex/dist/katex.min.css"

// Import Highlight.js for code syntax highlighting
import hljs from "highlight.js" // Import Highlight.js

import "highlight.js/styles/github.css" // Import Highlight.js theme

interface MarkdownProps {
  markdown: string
  className?: string
}

export default function Markdown({ markdown, className }: MarkdownProps) {
  useEffect(() => {
    // Highlight all code blocks after markdown is rendered
    const codeBlocks = document.querySelectorAll("pre code")
    codeBlocks.forEach((block) => {
      hljs.highlightBlock(block as HTMLElement)
    })
  }, [markdown])

  const convertToHtml = (markdownText: string) => {
    // Escape HTML to prevent injection
    markdownText = markdownText.replace(/</g, "&lt;").replace(/>/g, "&gt;")

    // Handle code blocks (``` code ``` with auto language detection)
    markdownText = markdownText.replace(
      /```([\s\S]*?)```/gim,
      (match, code) => {
        const highlightedCode = hljs.highlightAuto(code.trim()).value // Use Highlight.js for automatic language detection

        return `
          <pre class="bg-gray-800 rounded-lg my-4 overflow-x-auto">
            <code class="hljs">${highlightedCode}</code>
          </pre>
        `
      }
    )

    // Inline code (`code`)
    markdownText = markdownText.replace(
      /`([^`]+)`/gim,
      '<code class="bg-gray-800 text-green-400 px-1 py-0.5 rounded text-xl font-mono">$1</code>'
    )

    // Headings
    markdownText = markdownText.replace(
      /^### (.*$)/gim,
      '<h3 class="text-xl font-semibold text-indigo-200 mt-4 mb-2">$1</h3>'
    )
    markdownText = markdownText.replace(
      /^## (.*$)/gim,
      '<h2 class="text-2xl font-bold text-purple-200 mt-5 mb-3">$1</h2>'
    )
    markdownText = markdownText.replace(
      /^# (.*$)/gim,
      '<h1 class="text-3xl font-extrabold text-cyan-200 mb-4 mt-6">$1</h1>'
    )

    // Bold & Italic
    markdownText = markdownText.replace(
      /\*\*(.*?)\*\*/gim,
      '<strong class="font-bold text-yellow-200">$1</strong>'
    )
    markdownText = markdownText.replace(
      /\*(.*?)\*/gim,
      '<i class="italic text-gray-300">$1</i>'
    )

    // Links
    markdownText = markdownText.replace(
      /\[([^[]+)\]\((.*)\)/gim,
      '<a href="$2" target="_blank" class="text-blue-400 underline hover:text-blue-300">$1</a>'
    )

    // Blockquotes
    markdownText = markdownText.replace(
      /^> (.*$)/gim,
      '<blockquote class="border-l-4 border-gray-500 pl-4 italic text-gray-300 bg-gray-900/40 py-2 px-4 rounded-md my-2">$1</blockquote>'
    )

    // Unordered list
    markdownText = markdownText.replace(
      /^(?:-|\+|\*)\s+(.+)$/gim,
      '<li class="list-disc ml-5 text-[18px] text-white">$1</li>'
    )
    markdownText = markdownText.replace(
      /((?:<li class="list-disc.+<\/li>\s*)+)/gim,
      '<ul class="list-inside space-y-1 my-2">$1</ul>'
    )

    // Ordered list
    markdownText = markdownText.replace(
      /^\d+\.\s+(.+)$/gim,
      '<li class="list-decimal ml-5 text-[18px] text-white">$1</li>'
    )
    markdownText = markdownText.replace(
      /((?:<li class="list-decimal.+<\/li>\s*)+)/gim,
      '<ol class="list-decimal list-inside space-y-1 my-2">$1</ol>'
    )

    // LaTeX Block ($$...$$)
    markdownText = markdownText.replace(/\$\$([^$]+)\$\$/gim, (_, expr) => {
      try {
        return `<div class="katex-block text-inherit my-4">${katex.renderToString(
          expr.trim(),
          {
            throwOnError: false,
            displayMode: true
          }
        )}</div>`
      } catch {
        return `<div class="text-red-400">Invalid LaTeX: ${expr}</div>`
      }
    })

    // LaTeX Inline ($...$)
    markdownText = markdownText.replace(/\$([^$\n]+)\$/gim, (_, expr) => {
      try {
        return katex.renderToString(expr.trim(), {
          throwOnError: false,
          displayMode: false
        })
      } catch {
        return `<span class="text-red-400">Invalid LaTeX: ${expr}</span>`
      }
    })

    // Paragraphs
    markdownText = markdownText.replace(
      /^(?!<(?:ul|ol|li|h1|h2|h3|blockquote|a|strong|i|em|p|div|pre|code)\b)[^<]+/gim,
      '<p class="text-[18px] text-white leading-relaxed mb-2">$&</p>'
    )

    // Line breaks
    markdownText = markdownText.replace(/\n/g, "<br>")

    return markdownText
  }

  const htmlContent = convertToHtml(markdown)

  return (
    <div
      className={cn("prose dark:prose-invert max-w-none text-white", className)}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}

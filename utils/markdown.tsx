import { cn } from "@sglara/cn"

interface MarkdownProps {
  markdown: string
  className?: string
}

export default function Markdown({ markdown, className }: MarkdownProps) {
  const convertToHtml = (markdownText: string) => {
    // Escape HTML to prevent injection
    markdownText = markdownText.replace(/</g, "&lt;").replace(/>/g, "&gt;")

    // Fenced code blocks (``` code ```)
    markdownText = markdownText.replace(
      /```([\s\S]*?)```/gim,
      (match, code) => {
        return `<pre class="bg-gray-800 text-green-300 text-xl font-mono p-4 rounded-md overflow-x-auto my-4"><code>${code.trim()}</code></pre>`
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

    // Bold
    markdownText = markdownText.replace(
      /\*\*(.*?)\*\*/gim,
      '<strong class="font-bold text-yellow-200">$1</strong>'
    )

    // Italic
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

    // Unordered lists
    markdownText = markdownText.replace(
      /^(?:-|\+|\*)\s+(.+)$/gim,
      '<li class="list-disc ml-5 text-[18px] text-white">$1</li>'
    )
    markdownText = markdownText.replace(
      /((?:<li class="list-disc.+<\/li>\s*)+)/gim,
      '<ul class="list-inside space-y-1 my-2">$1</ul>'
    )

    // Ordered lists
    markdownText = markdownText.replace(
      /^\d+\.\s+(.+)$/gim,
      '<li class="list-decimal ml-5 text-[18px] text-white">$1</li>'
    )
    markdownText = markdownText.replace(
      /((?:<li class="list-decimal.+<\/li>\s*)+)/gim,
      '<ol class="list-decimal list-inside space-y-1 my-2">$1</ol>'
    )

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

import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  FolderOpen
} from "lucide-react"
import { useState } from "react"

import { type TreeNode } from "./hierarchy"

interface TreeViewProps {
  node: TreeNode
  level?: number
}

export function TreeView({ node, level = 0 }: TreeViewProps) {
  const [isExpanded, setIsExpanded] = useState(node.expanded ?? false)

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="text-gray-300">
      <div
        className={`flex items-center gap-1 py-1 px-2 hover:bg-[#ffffff1a] rounded cursor-pointer`}
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={handleToggle}>
        {node.children && node.children.length > 0 ? (
          <span className="text-gray-400">
            {isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </span>
        ) : (
          <span className="w-4" /> // Spacer for alignment
        )}
        <span className="text-[#aaa]">
          {node.type === "parent" &&
            (isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />)}
          {node.type === "leaf" && <File size={16} />}
        </span>
        <span className="ml-1 text-xl">{node.label}</span>
      </div>
      {isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeView key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

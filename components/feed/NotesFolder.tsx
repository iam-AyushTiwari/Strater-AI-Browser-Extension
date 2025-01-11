import { Plus, Search } from "lucide-react"
import { useState } from "react"

import { Card } from "./Card"
import { type TreeNode } from "./hierarchy"
import { TreeView } from "./TreeView"

const initialNotes: TreeNode = {
  id: "root",
  type: "parent",
  label: "My Notes",
  expanded: true,
  children: [
    {
      id: "1",
      type: "parent",
      label: "Web Development",
      children: [
        {
          id: "1-1",
          type: "leaf",
          label: "React Hooks"
        },
        {
          id: "1-2",
          type: "leaf",
          label: "Next.js Routing"
        }
      ]
    },
    {
      id: "2",
      type: "parent",
      label: "Data Science",
      children: [
        {
          id: "2-1",
          type: "leaf",
          label: "Python Basics"
        },
        {
          id: "2-2",
          type: "leaf",
          label: "Machine Learning Intro"
        }
      ]
    }
  ]
}

export function NotesFolder() {
  const [notes, setNotes] = useState<TreeNode>(initialNotes)
  const [searchTerm, setSearchTerm] = useState("")

  const handleAddNote = () => {
    console.log("Add note")
  }

  return (
    <Card title="Notes Folder" collapsible={false}>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-grow gap-4">
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full bg-[#282828] text-white text-2xl placeholder-gray-400 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#ff0042]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
          <button
            onClick={handleAddNote}
            className="bg-[#ff0042] hover:bg-[#ff3366] text-white rounded-md p-2 transition-colors"
            aria-label="Add new note">
            <Plus size={18} />
          </button>
        </div>
        <div className="bg-[#282828] rounded-md p-2 max-h-[300px] overflow-y-auto">
          <TreeView node={notes} />
        </div>
      </div>
    </Card>
  )
}

import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface CardProps {
  title: string
  children: React.ReactNode
  collapsible?: boolean
}


export function Card({ title, children, collapsible = true }: CardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="bg-[#212121] w-full rounded-xl overflow-hidden shadow-lg mt-3">
      <div
        className={`
          flex justify-between items-center p-4 
          ${collapsible ? "cursor-pointer hover:bg-[#ffffff1a]" : ""}
          border-b border-[#3f3f3f]
        `}
        onClick={() => collapsible && setIsCollapsed(!isCollapsed)}>
        <h2 className="text-white text-3xl font-semibold">{title}</h2>
        {collapsible && (
          <button className="text-[#aaa] hover:text-white">
            {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        )}
      </div>
      {!isCollapsed && <div className="p-4">{children}</div>}
    </div>
  )
}

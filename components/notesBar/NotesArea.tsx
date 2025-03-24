import { Button, Divider, Tooltip } from "antd"
import { Expand, PanelTopClose, Save, X } from "lucide-react"
import React from "react"

const NotesArea = () => {
  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between p-4 border-b-2 border-b-zinc-700 dark:bg-zinc-900">
        <div className="flex gap-2">
          <Tooltip title="Expand">
            <Button
              type="text"
              icon={<Expand size={15} color="white" />}
              className="dark:bg-zinc-800 dark:hover:bg-zinc-900"
            />
          </Tooltip>
          <Tooltip title="Save">
            <Button
              type="text"
              icon={<Save size={15} color="white" />}
              className="dark:bg-zinc-800 dark:hover:bg-zinc-900"
            />
          </Tooltip>
        </div>
        <div>
          <Tooltip title="Close">
            <Button
              type="text"
              icon={<X size={15} color="white" />}
              className="dark:bg-zinc-800 dark:hover:bg-zinc-900"
            />
          </Tooltip>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 h-full text-lg font-medium dark:bg-zinc-900 dark:text-white">
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold text-center">
            Learn JavaScript in 10 Minutes!
          </h2>
          <div className="border-b-2 border-b-zinc-700 py-2"></div>

          {/* Summary Cards */}
          <div className="space-y-4">
            <div className="p-4 bg-zinc-800 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-2">
                <span role="img" aria-label="Checkmark">
                  {" "}
                </span>{" "}
                What is JavaScript?
              </h3>
              <p className="text-lg text-slate-400 dark:text-slate-400">
                JavaScript is a high-level, dynamic, and interpreted programming
                language. It is primarily used for client-side scripting and is
                a core technology for the web.
              </p>
            </div>

            <div className="p-4 bg-zinc-800 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-2">
                <span role="img" aria-label="Checkmark">
                  {" "}
                </span>{" "}
                How to write your first JavaScript code
              </h3>
              <p className="text-lg text-slate-400 dark:text-slate-400">
                To write your first JavaScript code, create a new file with a
                .js extension and write your code in it. You can then run the
                file in your browser or use a tool like Node.js to execute it.
              </p>
            </div>

            <div className="p-4 bg-zinc-800 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-2">
                <span role="img" aria-label="Checkmark">
                  {" "}
                </span>{" "}
                What is DOM?
              </h3>
              <p className="text-lg text-slate-400 dark:text-slate-400">
                The Document Object Model (DOM) is a programming interface for
                HTML and XML documents. It represents the structure of a
                document as a tree of nodes, allowing you to access and modify
                the document's elements and their properties.
              </p>
            </div>
            <div className="p-4">
              <p className="text-lg text-slate-400 dark:text-slate-400">
                The Document Object Model (DOM) is a programming interface for
                HTML and XML documents. It represents the structure of a
                document as a tree of nodes, allowing you to access and modify
                the document's elements and their properties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotesArea
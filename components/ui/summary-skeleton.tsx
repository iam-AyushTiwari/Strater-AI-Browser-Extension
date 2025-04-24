"use client"

import { cn } from "@sglara/cn"
import type React from "react"
import { useEffect, useState } from "react"

export default function SummarySkeleton() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-auto w-full px-3">
      <div className="w-full rounded-xl space-y-5 bg-gradient-to-br from-[#161616] to-[#1e1e1e] p-4 border border-zinc-800/30 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xl font-bold text-white inline-flex items-center gap-2">
              Generating Summary
              <span className="inline-flex">
                <span className="animate-bounce h-1 w-1 bg-primary rounded-full delay-100"></span>
                <span className="animate-bounce h-1 w-1 bg-primary rounded-full mx-1 delay-200"></span>
                <span className="animate-bounce h-1 w-1 bg-primary rounded-full delay-300"></span>
              </span>
            </span>
            <div className="text-xs text-zinc-400">
              Analyzing content and extracting key points
            </div>
          </div>
          <div className="relative h-10 w-10 flex items-center justify-center">
            <svg
              className="animate-spin h-8 w-8 text-zinc-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>

        <div className="w-full bg-zinc-800/40 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}></div>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex gap-3">
            <ShimmerSkeleton className="h-20 w-20 rounded-lg" delay={0} />
            <div className="flex-1 space-y-2">
              <ShimmerSkeleton className="h-4 w-3/4" delay={100} />
              <ShimmerSkeleton className="h-4 w-full" delay={200} />
              <ShimmerSkeleton className="h-4 w-5/6" delay={300} />
            </div>
          </div>

          <div className="pt-2">
            <ShimmerSkeleton className="h-5 w-1/3 mb-3" delay={400} />
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-2 mb-3">
                <ShimmerSkeleton
                  className="h-3 w-3 rounded-full"
                  delay={500 + index * 100}
                />
                <ShimmerSkeleton
                  className="h-4 w-full"
                  delay={600 + index * 100}
                />
              </div>
            ))}
          </div>

          <div className="pt-2">
            <ShimmerSkeleton className="h-5 w-2/5 mb-3" delay={1000} />
            {Array.from({ length: 5 }).map((_, index) => (
              <ShimmerSkeleton
                key={index}
                className="h-4 w-full mb-3"
                delay={1100 + index * 100}
              />
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <ShimmerSkeleton className="h-16 w-16 rounded-lg" delay={1600} />
            <ShimmerSkeleton className="h-16 w-16 rounded-lg" delay={1700} />
            <ShimmerSkeleton className="h-16 w-16 rounded-lg" delay={1800} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ShimmerSkeleton({
  className,
  delay = 0,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { delay?: number }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-zinc-700/40",
        className
      )}
      style={{
        animationDelay: `${delay}ms`
      }}
      {...props}>
      <div className="shimmer absolute inset-0 -translate-x-full" />
    </div>
  )
}

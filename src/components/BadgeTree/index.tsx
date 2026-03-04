import { useMemo, useRef, useState, useLayoutEffect } from 'react'
import { type TreeNode, type BadgeTreeVariant } from './types'
import { calculateLayout, getBadgeSize } from './layout'
import { BadgeNode } from './BadgeNode'
import { ConnectionLines } from './ConnectionLines'

interface BadgeTreeProps {
  treeData: TreeNode[]
  badgeCount: number
  variant?: BadgeTreeVariant
  interactive?: boolean
}

export function BadgeTree({ treeData, badgeCount, variant = 'compact', interactive = true }: BadgeTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const layout = useMemo(() => {
    return calculateLayout(treeData, badgeCount, variant)
  }, [treeData, badgeCount, variant])

  // Calculate node size for presentation based on layout results, or directly for full
  const nodeSize = variant === 'full' ? 72 : getBadgeSize(badgeCount)

  useLayoutEffect(() => {
    if (!containerRef.current || layout.width === 0) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const availableWidth = entry.contentRect.width
        if (availableWidth > 0 && availableWidth < layout.width) {
          setScale(availableWidth / layout.width)
        } else {
          setScale(1)
        }
      }
    })

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [layout.width])

  if (layout.nodes.length === 0) return null

  return (
    <div className="flex justify-center w-full overflow-hidden" ref={containerRef}>
      <div style={{ width: layout.width * scale, height: layout.height * scale }}>
        <div
          className="relative origin-top-left transition-transform duration-200"
          style={{
            width: layout.width,
            height: layout.height,
            transform: `scale(${scale})`
          }}
        >
          <ConnectionLines lines={layout.lines} />
          {layout.nodes.map((position) => (
            <BadgeNode key={position.id} position={position} nodeSize={nodeSize} interactive={interactive} />
          ))}
        </div>
      </div>
    </div>
  )
}

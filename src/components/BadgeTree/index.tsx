import { useMemo } from 'react'
import { type TreeNode } from './types'
import { calculateLayout, getBadgeSize } from './layout'
import { BadgeNode } from './BadgeNode'
import { ConnectionLines } from './ConnectionLines'

interface BadgeTreeProps {
  treeData: TreeNode[]
  badgeCount: number
}

export function BadgeTree({ treeData, badgeCount }: BadgeTreeProps) {
  const nodeSize = getBadgeSize(badgeCount)

  const layout = useMemo(() => {
    return calculateLayout(treeData, badgeCount)
  }, [treeData, badgeCount])

  if (layout.nodes.length === 0) return null

  return (
    <div className="flex justify-center w-full">
      <div className="relative" style={{ width: layout.width, height: layout.height }}>
        <ConnectionLines lines={layout.lines} />
        {layout.nodes.map((position) => (
          <BadgeNode key={position.id} position={position} nodeSize={nodeSize} />
        ))}
      </div>
    </div>
  )
}

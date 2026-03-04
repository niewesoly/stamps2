import { type BadgeSpec } from '@/data/types'

export type BadgeTreeVariant = 'compact' | 'full'


export interface TreeNode {
  badge: BadgeSpec
  children: TreeNode[]
}

export interface NodePosition {
  id: string
  x: number
  y: number
  badge: BadgeSpec
}

export interface ConnectionLine {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface LayoutResult {
  nodes: NodePosition[]
  lines: ConnectionLine[]
  width: number
  height: number
}

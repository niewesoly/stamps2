import { type TreeNode, type NodePosition, type ConnectionLine, type LayoutResult } from './types'
import { sortTreeNodeChildren } from '@/data/tree-utils'

interface LayoutConfig {
  nodeSize: number
  levelHeight: number
  hSpacing: number
  containerMaxWidth: number
  containerMaxHeight: number
  tooltipSpace: number
  padding: number
}

interface LevelNode {
  node: TreeNode
  parents: string[]
}

const DEFAULT_CONFIG: LayoutConfig = {
  nodeSize: 56,
  levelHeight: 70,
  hSpacing: 24,
  containerMaxWidth: 260,
  containerMaxHeight: 180,
  tooltipSpace: 16,
  padding: 8,
}

/**
 * Get badge size based on count to fit within card
 */
export function getBadgeSize(badgeCount: number): number {
  if (badgeCount <= 4) return 56
  if (badgeCount <= 8) return 44
  if (badgeCount <= 12) return 36
  if (badgeCount <= 20) return 30
  return 26
}

/**
 * Get horizontal spacing based on badge count
 */
export function getHorizontalSpacing(badgeCount: number): number {
  if (badgeCount <= 4) return 24
  if (badgeCount <= 8) return 18
  if (badgeCount <= 12) return 14
  if (badgeCount <= 20) return 10
  return 8
}

/**
 * Get level height based on badge count
 */
export function getLevelHeight(badgeCount: number): number {
  if (badgeCount <= 4) return 70
  if (badgeCount <= 8) return 58
  if (badgeCount <= 12) return 48
  if (badgeCount <= 20) return 40
  return 36
}

/**
 * Get layout config based on badge count
 */
export function getLayoutConfig(badgeCount: number): LayoutConfig {
  return {
    nodeSize: getBadgeSize(badgeCount),
    levelHeight: getLevelHeight(badgeCount),
    hSpacing: getHorizontalSpacing(badgeCount),
    containerMaxWidth: DEFAULT_CONFIG.containerMaxWidth,
    containerMaxHeight: DEFAULT_CONFIG.containerMaxHeight,
    tooltipSpace: DEFAULT_CONFIG.tooltipSpace,
    padding: DEFAULT_CONFIG.padding,
  }
}

/**
 * Collect all nodes by level using BFS-like traversal
 */
function collectNodesByLevel(
  treeData: TreeNode[],
  config: LayoutConfig
): Map<number, LevelNode[]> {
  const levels = new Map<number, LevelNode[]>()
  const nodeParents = new Map<string, string[]>()

  function collect(node: TreeNode, level: number, parentIds: string[]): void {
    if (!levels.has(level)) levels.set(level, [])

    const existing = levels.get(level)?.find(n => n.node.badge.id === node.badge.id)
    if (!existing) {
      levels.get(level)!.push({ node, parents: parentIds })
      nodeParents.set(node.badge.id, parentIds)
    } else {
      const current = nodeParents.get(node.badge.id) || []
      nodeParents.set(node.badge.id, [...current, ...parentIds])
    }

    node.children.forEach(child => {
      collect(child, level + 1, [node.badge.id])
    })
  }

  treeData.forEach(root => collect(root, 0, []))

  return levels
}

/**
 * Calculate subtree width for centering
 */
function getSubtreeWidth(
  node: TreeNode,
  config: LayoutConfig,
  visited = new Set<string>()
): number {
  if (visited.has(node.badge.id)) return 0
  visited.add(node.badge.id)

  const sorted = sortTreeNodeChildren(node.children)
  if (sorted.length === 0) return config.nodeSize

  const childrenWidth = sorted.reduce(
    (sum, child) => sum + getSubtreeWidth(child, config, visited),
    0
  )
  const gaps = (sorted.length - 1) * config.hSpacing

  return Math.max(config.nodeSize, childrenWidth + gaps)
}

/**
 * Position nodes within a level
 */
function positionLevelNodes(
  levelNodes: LevelNode[],
  level: number,
  config: LayoutConfig
): NodePosition[] {
  const sorted = [...levelNodes].sort((a, b) => {
    const starsDiff = a.node.badge.stars - b.node.badge.stars
    if (starsDiff !== 0) return starsDiff
    return a.parents.length - b.parents.length
  })

  const totalWidth = sorted.length * config.nodeSize + (sorted.length - 1) * config.hSpacing
  const startY = level * config.levelHeight

  return sorted.map(({ node }, index) => ({
    id: node.badge.id,
    x: index * (config.nodeSize + config.hSpacing),
    y: startY,
    badge: node.badge,
  }))
}

/**
 * Collect nodes and create connection lines
 */
function collectNodesAndLines(
  node: TreeNode,
  positions: Map<string, NodePosition>,
  config: LayoutConfig,
  visited = new Set<string>()
): { nodes: NodePosition[]; lines: ConnectionLine[] } {
  if (visited.has(node.badge.id)) return { nodes: [], lines: [] }
  visited.add(node.badge.id)

  const pos = positions.get(node.badge.id)!
  const nodes: NodePosition[] = [pos]
  const lines: ConnectionLine[] = []

  node.children.forEach(child => {
    const parentPos = positions.get(node.badge.id)!
    const childPos = positions.get(child.badge.id)!

    if (parentPos && childPos) {
      lines.push({
        id: `${parentPos.id}-${childPos.id}`,
        x1: parentPos.x,
        y1: parentPos.y + config.nodeSize / 2,
        x2: childPos.x,
        y2: childPos.y - config.nodeSize / 2,
      })
    }

    const childResult = collectNodesAndLines(child, positions, config, new Set(visited))
    nodes.push(...childResult.nodes)
    lines.push(...childResult.lines)
  })

  return { nodes, lines }
}

/**
 * Main layout calculation function
 */
export function calculateLayout(treeData: TreeNode[], badgeCount: number): LayoutResult {
  if (treeData.length === 0) {
    return { nodes: [], lines: [], width: 0, height: 0 }
  }

  const config = getLayoutConfig(badgeCount)
  const levels = collectNodesByLevel(treeData, config)

  // Position all nodes by level
  const positions = new Map<string, NodePosition>()
  for (const [level, levelNodes] of levels.entries()) {
    const positioned = positionLevelNodes(levelNodes, level, config)
    positioned.forEach(pos => positions.set(pos.id, pos))
  }

  // Build nodes and lines arrays
  const { nodes, lines } = collectNodesAndLines(treeData[0], positions, config)

  // Handle multiple roots
  if (treeData.length > 1) {
    const allNodes: NodePosition[] = []
    const allLines: ConnectionLine[] = []

    treeData.forEach((root, index) => {
      const rootPositions = new Map<string, NodePosition>()
      const rootLevels = collectNodesByLevel([root], config)

      for (const [level, levelNodes] of rootLevels.entries()) {
        const offsetX = index * (config.nodeSize + config.hSpacing)
        const positioned = positionLevelNodes(levelNodes, level, config).map(pos => ({
          ...pos,
          x: pos.x + offsetX,
        }))
        positioned.forEach(pos => rootPositions.set(pos.id, pos))
      }

      const { nodes: rootNodes, lines: rootLines } = collectNodesAndLines(root, rootPositions, config)
      allNodes.push(...rootNodes)
      allLines.push(...rootLines)
    })

    return normalizeLayout(allNodes, allLines, config)
  }

  return normalizeLayout(nodes, lines, config)
}

/**
 * Normalize positions to fit within container
 */
function normalizeLayout(
  nodes: NodePosition[],
  lines: ConnectionLine[],
  config: LayoutConfig
): LayoutResult {
  if (nodes.length === 0) {
    return { nodes: [], lines: [], width: 0, height: 0 }
  }

  const minX = Math.min(...nodes.map(n => n.x))
  const maxX = Math.max(...nodes.map(n => n.x))
  const minY = Math.min(...nodes.map(n => n.y))
  const maxY = Math.max(...nodes.map(n => n.y))

  const rawWidth = maxX - minX + config.nodeSize + config.padding * 2
  const rawHeight = maxY - minY + config.nodeSize + config.padding * 2 + config.tooltipSpace

  const width = Math.min(rawWidth, config.containerMaxWidth)
  const height = Math.min(rawHeight, config.containerMaxHeight)

  const normalizedNodes = nodes.map(n => ({
    ...n,
    x: n.x - minX + config.nodeSize / 2 + config.padding,
    y: n.y - minY + config.nodeSize / 2 + config.padding,
  }))

  const normalizedLines = lines.map(l => ({
    ...l,
    x1: l.x1 - minX + config.nodeSize / 2 + config.padding,
    y1: l.y1 - minY + config.nodeSize / 2 + config.padding,
    x2: l.x2 - minX + config.nodeSize / 2 + config.padding,
    y2: l.y2 - minY + config.nodeSize / 2 + config.padding,
  }))

  return {
    nodes: normalizedNodes,
    lines: normalizedLines,
    width,
    height,
  }
}

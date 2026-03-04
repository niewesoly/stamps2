import { type TreeNode, type NodePosition, type ConnectionLine, type LayoutResult, type BadgeTreeVariant } from './types'
import { sortTreeNodeChildren } from '@/data/tree-utils'

// Badge size thresholds - number of badges in the tree
const SIZE_THRESHOLD_SMALL = 4
const SIZE_THRESHOLD_MEDIUM = 8
const SIZE_THRESHOLD_LARGE = 12
const SIZE_THRESHOLD_XLARGE = 20

// Layout configuration constants
interface LayoutConfig {
  nodeSize: number
  levelHeight: number
  hSpacing: number
  containerMaxWidth: number
  containerMaxHeight: number
  tooltipSpace: number
  padding: number
}

const DEFAULT_CONFIG: LayoutConfig = {
  nodeSize: 56,
  levelHeight: 70,
  hSpacing: 24,
  containerMaxWidth: 260,
  containerMaxHeight: 280,
  tooltipSpace: 32,
  padding: 8,
}

const FULL_CONFIG: LayoutConfig = {
  nodeSize: 72,
  levelHeight: 110,
  hSpacing: 48,
  containerMaxWidth: 320,
  containerMaxHeight: 800,
  tooltipSpace: 36,
  padding: 16,
}

// Badge size mapping based on tree density
const BADGE_SIZE_MAP = {
  small: 56,    // ≤4 badges
  medium: 44,   // ≤8 badges
  large: 36,    // ≤12 badges
  xlarge: 30,   // ≤20 badges
  dense: 26,    // >20 badges
} as const

const H_SPACING_MAP = {
  small: 24,
  medium: 18,
  large: 14,
  xlarge: 10,
  dense: 8,
} as const

const LEVEL_HEIGHT_MAP = {
  small: 70,
  medium: 58,
  large: 48,
  xlarge: 40,
  dense: 36,
} as const

/**
 * Get badge size based on count to fit within card
 */
export function getBadgeSize(badgeCount: number): number {
  if (badgeCount <= SIZE_THRESHOLD_SMALL) return BADGE_SIZE_MAP.small
  if (badgeCount <= SIZE_THRESHOLD_MEDIUM) return BADGE_SIZE_MAP.medium
  if (badgeCount <= SIZE_THRESHOLD_LARGE) return BADGE_SIZE_MAP.large
  if (badgeCount <= SIZE_THRESHOLD_XLARGE) return BADGE_SIZE_MAP.xlarge
  return BADGE_SIZE_MAP.dense
}

/**
 * Get horizontal spacing based on badge count
 */
export function getHorizontalSpacing(badgeCount: number): number {
  if (badgeCount <= SIZE_THRESHOLD_SMALL) return H_SPACING_MAP.small
  if (badgeCount <= SIZE_THRESHOLD_MEDIUM) return H_SPACING_MAP.medium
  if (badgeCount <= SIZE_THRESHOLD_LARGE) return H_SPACING_MAP.large
  if (badgeCount <= SIZE_THRESHOLD_XLARGE) return H_SPACING_MAP.xlarge
  return H_SPACING_MAP.dense
}

/**
 * Get level height based on badge count
 */
export function getLevelHeight(badgeCount: number): number {
  if (badgeCount <= SIZE_THRESHOLD_SMALL) return LEVEL_HEIGHT_MAP.small
  if (badgeCount <= SIZE_THRESHOLD_MEDIUM) return LEVEL_HEIGHT_MAP.medium
  if (badgeCount <= SIZE_THRESHOLD_LARGE) return LEVEL_HEIGHT_MAP.large
  if (badgeCount <= SIZE_THRESHOLD_XLARGE) return LEVEL_HEIGHT_MAP.xlarge
  return LEVEL_HEIGHT_MAP.dense
}

/**
 * Get layout config based on badge count and variant
 */
export function getLayoutConfig(badgeCount: number, variant: BadgeTreeVariant = 'compact'): LayoutConfig {
  if (variant === 'full') {
    return FULL_CONFIG
  }
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
 * Layout tree with parent centering over children
 */
function layoutTree(
  treeData: TreeNode[],
  config: LayoutConfig
): { nodes: NodePosition[]; lines: ConnectionLine[] } {
  const nodes: NodePosition[] = []
  const lines: ConnectionLine[] = []
  const visited = new Set<string>()

  // Collect all nodes with their levels
  const nodeMap = new Map<string, { node: TreeNode; level: number; children: TreeNode[] }>()
  const levels = new Map<number, TreeNode[]>()

  function collectNodes(node: TreeNode, level: number): void {
    if (visited.has(node.badge.id)) {
      // Node already visited, but might be reached from another parent
      return
    }
    visited.add(node.badge.id)

    nodeMap.set(node.badge.id, { node, level, children: node.children })

    if (!levels.has(level)) levels.set(level, [])
    levels.get(level)!.push(node)

    node.children.forEach(child => collectNodes(child, level + 1))
  }

  treeData.forEach(root => {
    visited.clear()
    collectNodes(root, 0)
  })

  // Position nodes level by level, but center parents over children
  const finalPositions = new Map<string, { x: number; y: number }>()
  const processed = new Set<string>()

  // Process from bottom level to top
  const maxLevel = Math.max(...levels.keys())

  for (let level = maxLevel; level >= 0; level--) {
    const levelNodes = levels.get(level) || []

    // Sort nodes: by stars (ascending), then by number of children (descending - more children = more central)
    const sorted = [...levelNodes].sort((a, b) => {
      const starsDiff = a.badge.stars - b.badge.stars
      if (starsDiff !== 0) return starsDiff
      // Nodes with more children should be more central
      return b.children.length - a.children.length
    })

    // Calculate positions
    const totalWidth = sorted.reduce((sum, node, idx) => {
      return sum + config.nodeSize + (idx < sorted.length - 1 ? config.hSpacing : 0)
    }, 0)

    const startX = -totalWidth / 2 + config.nodeSize / 2

    sorted.forEach((node, index) => {
      if (processed.has(node.badge.id)) return
      processed.add(node.badge.id)

      const x = startX + index * (config.nodeSize + config.hSpacing)
      const y = level * config.levelHeight

      finalPositions.set(node.badge.id, { x, y })
    })
  }

  // Now adjust parent positions to be centered over their children
  const adjustedPositions = new Map<string, { x: number; y: number }>()

  function adjustParentPosition(nodeId: string, localVisited = new Set<string>()): { centerX: number; width: number } {
    if (localVisited.has(nodeId)) {
      const pos = adjustedPositions.get(nodeId)
      return pos ? { centerX: pos.x, width: config.nodeSize } : { centerX: 0, width: 0 }
    }
    localVisited.add(nodeId)

    const data = nodeMap.get(nodeId)
    if (!data) return { centerX: 0, width: 0 }

    if (data.children.length === 0) {
      const pos = finalPositions.get(nodeId)
      if (pos) adjustedPositions.set(nodeId, pos)
      return { centerX: pos?.x || 0, width: config.nodeSize }
    }

    // Calculate children positions first
    const sorted = sortTreeNodeChildren(data.children)
    let totalChildrenWidth = 0
    let leftEdge = 0
    let rightEdge = 0

    sorted.forEach((child, idx) => {
      const result = adjustParentPosition(child.badge.id, new Set(localVisited))
      if (idx === 0) {
        leftEdge = result.centerX - config.nodeSize / 2
      }
      if (idx === sorted.length - 1) {
        rightEdge = result.centerX + config.nodeSize / 2
      }
      totalChildrenWidth += result.width
      if (idx < sorted.length - 1) {
        totalChildrenWidth += config.hSpacing
        rightEdge += config.hSpacing
      }
    })

    // Center parent over children
    const childrenCenterX = (leftEdge + rightEdge) / 2
    const parentPos = finalPositions.get(nodeId)
    const newY = parentPos?.y || data.level * config.levelHeight

    adjustedPositions.set(nodeId, { x: childrenCenterX, y: newY })

    const subtreeWidth = Math.max(config.nodeSize, totalChildrenWidth)
    return { centerX: childrenCenterX, width: subtreeWidth }
  }

  // Adjust all root positions
  treeData.forEach(root => {
    adjustParentPosition(root.badge.id)
  })

  // Build final nodes and lines
  const addedNodes = new Set<string>()

  function collectNodesAndLines(node: TreeNode, localVisited = new Set<string>()): void {
    if (localVisited.has(node.badge.id)) return
    localVisited.add(node.badge.id)
    if (addedNodes.has(node.badge.id)) return
    addedNodes.add(node.badge.id)

    const pos = adjustedPositions.get(node.badge.id)
    if (!pos) return

    nodes.push({
      id: node.badge.id,
      x: pos.x,
      y: pos.y,
      badge: node.badge,
    })

    node.children.forEach(child => {
      const childPos = adjustedPositions.get(child.badge.id)
      if (childPos) {
        lines.push({
          id: `${node.badge.id}-${child.badge.id}`,
          x1: pos.x,
          y1: pos.y + config.nodeSize / 2,
          x2: childPos.x,
          y2: childPos.y - config.nodeSize / 2,
        })
      }
      collectNodesAndLines(child, new Set(localVisited))
    })
  }

  treeData.forEach(root => collectNodesAndLines(root))

  return { nodes, lines }
}

/**
 * Main layout calculation function
 */
export function calculateLayout(treeData: TreeNode[], badgeCount: number, variant: BadgeTreeVariant = 'compact'): LayoutResult {
  if (treeData.length === 0) {
    return { nodes: [], lines: [], width: 0, height: 0 }
  }

  const config = getLayoutConfig(badgeCount, variant)

  // Layout all trees
  const allNodes: NodePosition[] = []
  const allLines: ConnectionLine[] = []

  // Handle multiple disconnected trees (roots)
  if (treeData.length > 1) {
    let offsetX = 0
    treeData.forEach((root, index) => {
      const { nodes: treeNodes, lines: treeLines } = layoutTree([root], config)

      if (index > 0) {
        // Add horizontal gap between trees
        const prevMaxX = Math.max(...allNodes.map(n => n.x))
        const currMinX = Math.min(...treeNodes.map(n => n.x))
        offsetX = prevMaxX - currMinX + config.hSpacing
      }

      treeNodes.forEach(node => {
        allNodes.push({ ...node, x: node.x + offsetX })
      })
      treeLines.forEach(line => {
        allLines.push({ ...line, x1: line.x1 + offsetX, x2: line.x2 + offsetX })
      })
    })
  } else {
    const { nodes, lines } = layoutTree(treeData, config)
    allNodes.push(...nodes)
    allLines.push(...lines)
  }

  return normalizeLayout(allNodes, allLines, config)
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
  // Height: account for badge position + full badge size + tooltip space below
  const rawHeight = maxY - minY + config.nodeSize + config.padding * 2 + config.tooltipSpace

  // Width: use containerMaxWidth as minimum for small trees
  // Height: always use actual height to avoid clipping badges/tooltips
  const width = rawWidth < config.containerMaxWidth ? config.containerMaxWidth : rawWidth
  const height = rawHeight

  // Calculate offset to center the tree within the container
  const treeCenterX = (minX + maxX) / 2
  const containerCenterX = width / 2
  const horizontalOffset = containerCenterX - treeCenterX

  const normalizedNodes = nodes.map(n => ({
    ...n,
    x: n.x + horizontalOffset,
    y: n.y - minY + config.nodeSize / 2 + config.padding,
  }))

  const normalizedLines = lines.map(l => ({
    ...l,
    x1: l.x1 + horizontalOffset,
    y1: l.y1 - minY + config.nodeSize / 2 + config.padding,
    x2: l.x2 + horizontalOffset,
    y2: l.y2 - minY + config.nodeSize / 2 + config.padding,
  }))

  return {
    nodes: normalizedNodes,
    lines: normalizedLines,
    width,
    height,
  }
}

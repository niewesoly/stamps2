import { type TreeNode, type NodePosition, type ConnectionLine, type LayoutResult } from './types'
import { type BadgeSpec } from '@/data/types'
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

interface PositionedNode {
  node: TreeNode
  x: number
  y: number
  parents: string[]
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
 * First pass: calculate ideal X position for each node based on its children
 * This ensures parents are centered above their children
 */
function calculateIdealPositions(
  node: TreeNode,
  level: number,
  config: LayoutConfig,
  nodeMap: Map<string, { node: TreeNode; level: number; children: TreeNode[] }>
): number {
  nodeMap.set(node.badge.id, { node, level, children: node.children })

  if (node.children.length === 0) {
    return 0 // Leaf node, will be positioned by parent
  }

  // Recursively calculate for children
  const childPositions: number[] = []
  node.children.forEach(child => {
    calculateIdealPositions(child, level + 1, config, nodeMap)
  })

  return 0 // Root will be centered
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
  const positioned = new Map<string, { x: number; y: number; badge: BadgeSpec }>()
  const visited = new Set<string>()

  // Calculate subtree width for centering
  function getSubtreeWidth(nodeId: string, localVisited = new Set<string>()): number {
    if (localVisited.has(nodeId)) return 0
    localVisited.add(nodeId)

    const data = getNodeData(nodeId)
    if (!data || data.children.length === 0) return config.nodeSize

    const sorted = sortTreeNodeChildren(data.children)
    let totalWidth = 0
    sorted.forEach((child, idx) => {
      totalWidth += getSubtreeWidth(child.badge.id, new Set(localVisited))
      if (idx < sorted.length - 1) totalWidth += config.hSpacing
    })

    return Math.max(config.nodeSize, totalWidth)
  }

  function getNodeData(nodeId: string): { node: TreeNode; level: number; children: TreeNode[] } | null {
    for (const [, data] of nodeMap.entries()) {
      if (data.node.badge.id === nodeId) return data
    }
    return null
  }

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
export function calculateLayout(treeData: TreeNode[], badgeCount: number): LayoutResult {
  if (treeData.length === 0) {
    return { nodes: [], lines: [], width: 0, height: 0 }
  }

  const config = getLayoutConfig(badgeCount)

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

  // Width: use actual width for small trees, cap very wide trees
  // Height: always use actual height to avoid clipping badges/tooltips
  const width = rawWidth < config.containerMaxWidth ? config.containerMaxWidth : rawWidth
  const height = rawHeight

  // Calculate offset to center the tree within the container
  // Tree center is at (minX + maxX) / 2, container center is at width / 2
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

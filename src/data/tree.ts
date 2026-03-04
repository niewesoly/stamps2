import type { BadgeSpec, BadgeGroup } from "./types";

export interface TreeNode {
  badge: BadgeSpec;
  children: TreeNode[];
  depth: number;
  x: number;
  y: number;
  width: number;
  // For layout algorithm
  mod: number;
  thread?: TreeNode;
  ancestor: TreeNode;
  parent?: TreeNode;
  number: number;
}

export interface TreeLayout {
  nodes: TreeNode[];
  width: number;
  height: number;
  levels: number;
}

const NODE_WIDTH = 160;
const NODE_HEIGHT = 70;
const LEVEL_HEIGHT = 100;
const NODE_GAP = 24;

/**
 * Build prerequisite tree from root badge.
 * Returns null if root has no prerequisites.
 */
export function buildPrerequisiteTree(
  rootBadge: BadgeSpec,
  groups: BadgeGroup[]
): TreeNode | null {
  const badgeMap = buildBadgeMap(groups);
  const visited = new Set<string>();

  function buildNode(badge: BadgeSpec, depth: number, parent?: TreeNode, number: number = 0): TreeNode | null {
    if (visited.has(badge.id)) {
      // Create a reference node for already-visited badges (prevents cycles)
      return null;
    }
    visited.add(badge.id);

    const node: TreeNode = {
      badge,
      children: [],
      depth,
      x: 0,
      y: depth * LEVEL_HEIGHT,
      width: NODE_WIDTH,
      mod: 0,
      ancestor: null!, // Will be set to self-reference below
      parent,
      number,
    };
    node.ancestor = node; // Self-reference for tree algorithm

    // Build children from basedOn (prerequisites), filtering out self-references
    const prerequisites = (badge.basedOn || []).filter(id => id !== badge.id);
    for (let i = 0; i < prerequisites.length; i++) {
      const reqId = prerequisites[i];
      const childBadge = badgeMap.get(reqId);
      if (childBadge) {
        const childNode = buildNode(childBadge, depth + 1, node, i);
        if (childNode) {
          node.children.push(childNode);
        }
      }
    }

    return node;
  }

  const root = buildNode(rootBadge, 0);

  // Only return tree if there are actual prerequisites
  if (!root || root.children.length === 0) {
    return null;
  }

  return root;
}

/**
 * Calculate tree layout using a simplified Reingold-Tilford algorithm.
 * Ensures no overlapping nodes and proper parent-centering.
 */
export function calculateTreeLayout(root: TreeNode): TreeLayout {
  const nodes: TreeNode[] = [];

  // First pass: post-order traversal to assign initial positions
  function firstPass(node: TreeNode): void {
    for (const child of node.children) {
      firstPass(child);
    }

    if (node.children.length === 0) {
      // Leaf node
      node.x = 0;
    } else if (node.children.length === 1) {
      // Single child - center above it
      node.x = node.children[0].x;
    } else {
      // Multiple children - center between first and last
      const firstChild = node.children[0];
      const lastChild = node.children[node.children.length - 1];
      node.x = (firstChild.x + lastChild.x) / 2;
    }

    nodes.push(node);
  }

  // Second pass: pre-order traversal to adjust positions and prevent overlaps
  function secondPass(node: TreeNode, modSum: number): void {
    node.x += modSum;
    node.mod += modSum;

    for (const child of node.children) {
      secondPass(child, node.mod);
    }
  }

  // Check and fix overlaps between subtrees
  function fixSubtreeOverlaps(): boolean {
    let hasOverlap = false;

    // Group nodes by depth
    const nodesByDepth = new Map<number, TreeNode[]>();
    for (const node of nodes) {
      const depthNodes = nodesByDepth.get(node.depth) || [];
      depthNodes.push(node);
      nodesByDepth.set(node.depth, depthNodes);
    }

    // Check each level for overlaps
    for (const [, depthNodes] of nodesByDepth) {
      // Sort by x position
      depthNodes.sort((a, b) => a.x - b.x);

      for (let i = 1; i < depthNodes.length; i++) {
        const prev = depthNodes[i - 1];
        const curr = depthNodes[i];
        const minDistance = NODE_WIDTH + NODE_GAP;
        const actualDistance = curr.x - prev.x;

        if (actualDistance < minDistance) {
          const shift = minDistance - actualDistance;
          curr.x += shift;
          curr.mod += shift;
          hasOverlap = true;
        }
      }
    }

    return hasOverlap;
  }

  // Build ancestor references for all nodes
  function buildAncestors(node: TreeNode): void {
    for (const child of node.children) {
      child.parent = node;
      buildAncestors(child);
    }
  }

  buildAncestors(root);
  firstPass(root);

  // Propagate positions down
  secondPass(root, 0);

  // Fix overlaps iteratively
  for (let i = 0; i < 10; i++) {
    if (!fixSubtreeOverlaps()) break;
    // Re-propagate after fixing
    for (const node of nodes) {
      node.mod = 0;
    }
    secondPass(root, 0);
  }

  // Calculate bounds
  const minX = Math.min(...nodes.map(n => n.x - NODE_WIDTH / 2));
  const maxX = Math.max(...nodes.map(n => n.x + NODE_WIDTH / 2));
  const maxY = Math.max(...nodes.map(n => n.y)) + NODE_HEIGHT;

  // Center the tree around 0
  const offsetX = (minX + maxX) / 2;
  for (const node of nodes) {
    node.x -= offsetX;
  }

  const width = maxX - minX;
  const height = maxY;
  const levels = Math.max(...nodes.map(n => n.depth)) + 1;

  return {
    nodes,
    width,
    height,
    levels,
  };
}

function buildBadgeMap(groups: BadgeGroup[]): Map<string, BadgeSpec> {
  const map = new Map<string, BadgeSpec>();
  for (const group of groups) {
    for (const badge of group.spec.badges) {
      map.set(badge.id, badge);
    }
  }
  return map;
}

export { NODE_WIDTH, NODE_HEIGHT, LEVEL_HEIGHT };

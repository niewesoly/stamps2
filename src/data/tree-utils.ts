import { type BadgeSpec } from '@/data/types'
import { type TreeNode } from '@/components/BadgeTree/types'

/**
 * Build a tree structure from flat badge list based on basedOn relationships.
 * Each badge appears only once in the tree, even if it has multiple parents.
 * Self-references in basedOn are ignored to prevent cycles.
 */
export function buildBadgeTree(badges: BadgeSpec[]): TreeNode[] {
  const childrenMap = new Map<string, TreeNode[]>()
  const roots: TreeNode[] = []

  badges.forEach(b => childrenMap.set(b.id, []))

  badges.forEach(badge => {
    // Filter out self-references to prevent cycles
    const validParents = badge.basedOn.filter(id => id !== badge.id)

    if (validParents.length === 0) {
      roots.push({ badge, children: childrenMap.get(badge.id)! })
    } else {
      validParents.forEach(parentId => {
        const parentChildren = childrenMap.get(parentId)
        if (parentChildren) {
          parentChildren.push({ badge, children: childrenMap.get(badge.id)! })
        }
      })
    }
  })

  return roots
}

/**
 * Sort children to minimize line crossings:
 * - Primary: by star level (keeps progression vertical: 1★ → 2★ → 3★)
 * - Secondary: by number of prerequisites (simpler badges first)
 */
export function sortTreeNodeChildren(children: TreeNode[]): TreeNode[] {
  return [...children].sort((a, b) => {
    if (a.badge.stars !== b.badge.stars) {
      return a.badge.stars - b.badge.stars
    }
    return a.badge.basedOn.length - b.badge.basedOn.length
  })
}

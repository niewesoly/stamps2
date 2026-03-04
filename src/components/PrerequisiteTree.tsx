import { Link } from "react-router";
import { useMemo } from "react";
import type { TreeLayout, TreeNode } from "@/data/tree";
import { NODE_WIDTH, NODE_HEIGHT } from "@/data/tree";
import StarRating from "./StarRating";

interface PrerequisiteTreeProps {
  layout: TreeLayout;
}

export function PrerequisiteTree({ layout }: PrerequisiteTreeProps) {
  const { viewBoxWidth, viewBoxHeight, centerOffset, contentWidth, padding } = useMemo(() => {
    const padding = 60;
    const viewBoxWidth = layout.width + padding * 2;
    const viewBoxHeight = layout.height + padding * 2;

    const minX = Math.min(...layout.nodes.map(n => n.x - NODE_WIDTH / 2));
    const maxX = Math.max(...layout.nodes.map(n => n.x + NODE_WIDTH / 2));
    const contentWidth = maxX - minX;
    const centerOffset = (minX + maxX) / 2;

    return { viewBoxWidth, viewBoxHeight, centerOffset, contentWidth, padding };
  }, [layout]);

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-gradient-to-b from-muted/30 to-muted/10 p-4">
      <svg
        width={Math.max(viewBoxWidth, contentWidth + padding * 2)}
        height={viewBoxHeight}
        viewBox={`${centerOffset - viewBoxWidth / 2} -${padding} ${viewBoxWidth} ${viewBoxHeight}`}
        className="mx-auto"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
          </marker>
        </defs>

        <g>
          {/* Render connections first (behind nodes) */}
          {layout.nodes.map((node) =>
            node.children.map((child, idx) => (
              <ConnectionLine
                key={`${node.badge.id}-${child.badge.id}-${idx}`}
                parentX={node.x}
                parentY={node.y}
                childX={child.x}
                childY={child.y}
              />
            ))
          )}

          {/* Render nodes */}
          {layout.nodes.map((node) => (
            <TreeNodeComponent
              key={node.badge.id}
              node={node}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

interface ConnectionLineProps {
  parentX: number;
  parentY: number;
  childX: number;
  childY: number;
}

function ConnectionLine({ parentX, parentY, childX, childY }: ConnectionLineProps) {
  // Draw curved line from bottom of parent to top of child
  const startY = parentY + NODE_HEIGHT / 2;
  const endY = childY - NODE_HEIGHT / 2;
  const controlY = (startY + endY) / 2;

  // Cubic bezier for smooth curve
  const path = `M ${parentX} ${startY} C ${parentX} ${controlY}, ${childX} ${controlY}, ${childX} ${endY}`;

  return (
    <path
      d={path}
      fill="none"
      stroke="#cbd5e1"
      strokeWidth="2"
      strokeLinecap="round"
      markerEnd="url(#arrowhead)"
      className="transition-all"
    />
  );
}

interface TreeNodeComponentProps {
  node: TreeNode;
}

function TreeNodeComponent({ node }: TreeNodeComponentProps) {
  const { badge, x, y } = node;

  return (
    <g transform={`translate(${x - NODE_WIDTH / 2}, ${y - NODE_HEIGHT / 2})`}>
      <Link to={`/sprawnosc/${badge.slug}`}>
        {/* Card background with shadow */}
        <rect
          x="1"
          y="1"
          width={NODE_WIDTH - 2}
          height={NODE_HEIGHT - 2}
          rx="10"
          fill="white"
          className="drop-shadow-sm"
        />
        <rect
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
          rx="10"
          fill="white"
          stroke="#e2e8f0"
          strokeWidth="1.5"
          className="transition-all duration-200 hover:stroke-primary hover:stroke-2"
        />

        {/* Content */}
        <foreignObject x="10" y="8" width={NODE_WIDTH - 20} height={NODE_HEIGHT - 16}>
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-start gap-2">
              {badge.iconUrl ? (
                <img
                  src={badge.iconUrl}
                  alt=""
                  className="w-10 h-10 object-contain shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 shrink-0 flex items-center justify-center text-xs font-bold text-amber-700">
                  {badge.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="text-xs font-semibold text-foreground leading-tight line-clamp-2">
                  {badge.name}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <StarRating stars={badge.stars} size="sm" />
            </div>
          </div>
        </foreignObject>
      </Link>
    </g>
  );
}

import { type NodePosition } from './types'

interface BadgeNodeProps {
  position: NodePosition
  nodeSize: number
}

export function BadgeNode({ position, nodeSize }: BadgeNodeProps) {
  const { badge, x, y } = position

  return (
    <div
      className="absolute z-10 group/badge cursor-default"
      style={{
        left: x - nodeSize / 2,
        top: y - nodeSize / 2,
        width: nodeSize,
        height: nodeSize,
      }}
    >
      <div className="w-full h-full flex items-center justify-center p-0.5 transition-transform duration-300 group-hover/badge:scale-110 bg-card rounded-full shadow-sm ring-2 ring-transparent group-hover/badge:ring-primary/20 relative z-20">
        {badge.iconUrl ? (
          <img
            src={badge.iconUrl}
            alt={badge.name}
            className="w-full h-full object-contain filter group-hover/badge:brightness-110 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all"
          />
        ) : (
          <div className="w-full h-full rounded-full border-2 border-dashed border-border flex items-center justify-center bg-background/50">
            <span className="text-[0.65rem] font-bold text-muted-foreground/40">
              {badge.stars}*
            </span>
          </div>
        )}
      </div>
      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/badge:opacity-100 transition-opacity bg-foreground text-background text-[8px] font-bold px-1 py-0.5 rounded whitespace-nowrap shadow-xl z-30 pointer-events-none text-center max-w-[100px]">
        {badge.name}
      </span>
    </div>
  )
}

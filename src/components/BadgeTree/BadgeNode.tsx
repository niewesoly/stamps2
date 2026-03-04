import { type NodePosition } from './types'

interface BadgeNodeProps {
  position: NodePosition
  nodeSize: number
  interactive?: boolean
}

export function BadgeNode({ position, nodeSize, interactive = true }: BadgeNodeProps) {
  const { badge, x, y } = position

  const commonProps = {
    className: `absolute group/badge block ${interactive ? 'cursor-pointer' : 'cursor-default'}`,
    style: {
      left: x - nodeSize / 2,
      top: y - nodeSize / 2,
      width: nodeSize,
      height: nodeSize,
    },
  }

  if (interactive) {
    return (
      <a
        href={`/sprawnosc/${badge.slug}`}
        {...commonProps}
      >
        <BadgeIcon badge={badge} interactive />
        <BadgeTooltip badge={badge} />
      </a>
    )
  }

  return (
    <div {...commonProps}>
      <BadgeIcon badge={badge} interactive={false} />
      <BadgeTooltip badge={badge} />
    </div>
  )
}

function BadgeIcon({ badge, interactive }: { badge: NodePosition['badge']; interactive: boolean }) {
  return (
    <div className={`w-full h-full flex items-center justify-center p-0.5 transition-transform duration-300 ${interactive ? 'group-hover/badge:scale-110' : ''} bg-card rounded-full shadow-sm ${interactive ? 'ring-2 ring-transparent group-hover/badge:ring-primary/20 hover:shadow-primary/20 hover:shadow-lg' : ''} relative z-10`}>
      {badge.iconUrl ? (
        <img
          src={badge.iconUrl}
          alt={badge.name}
          className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all"
        />
      ) : (
        <div className="w-full h-full rounded-full border-2 border-dashed border-border flex items-center justify-center bg-background/50">
          <span className="text-[0.65rem] font-bold text-muted-foreground/40">
            {badge.stars}*
          </span>
        </div>
      )}
    </div>
  )
}

function BadgeTooltip({ badge }: { badge: NodePosition['badge'] }) {
  return (
    <span
      className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/badge:opacity-100 transition-opacity bg-foreground text-background text-[10px] font-bold px-1.5 py-1 rounded whitespace-nowrap shadow-xl pointer-events-none text-center max-w-[120px]"
      style={{
        zIndex: 100,
      }}
    >
      {badge.name}
    </span>
  )
}

import { type ConnectionLine } from './types'

interface ConnectionLinesProps {
  lines: ConnectionLine[]
}

export function ConnectionLines({ lines }: ConnectionLinesProps) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ overflow: 'visible' }}
    >
      {lines.map((line) => (
        <line
          key={line.id}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="hsl(var(--border))"
          strokeWidth="2"
          strokeOpacity="0.6"
        />
      ))}
    </svg>
  )
}

export function RulerTicks() {
  const ticks = Array.from({ length: 41 }, (_, i) => i)
  return (
    <g className="whyjoin__ruler-ticks">
      {ticks.map((i) => {
        const major = i % 5 === 0
        return <line key={i} x1={i * 8} y1={major ? 16 : 27} x2={i * 8} y2={38} />
      })}
    </g>
  )
}

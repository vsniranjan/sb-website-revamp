const NODES = [
  { x: 60, label: '1961' },
  { x: 480, label: '1988' },
  { x: 1140, label: 'TODAY' },
]

/** Rail + scrub-drawn progress line (existing mechanism, see initLineDraws in
 * flourishes.ts), plus three nodes that "power on" as scroll passes them —
 * driven by the same scroll range via initTimelineNodes. */
export function CircuitTimeline() {
  return (
    <div className="about__timeline-wrap">
      <svg className="about__timeline" viewBox="0 0 1200 64" preserveAspectRatio="none" aria-hidden="true">
        <line className="about__timeline-rail" x1="0" y1="40" x2="1200" y2="40" />
        <line className="about__timeline-progress" x1="0" y1="40" x2="1200" y2="40" />
        <g className="about__timeline-marks">
          <line x1="60" y1="28" x2="60" y2="52" />
          <line x1="480" y1="28" x2="480" y2="52" />
          <line x1="1140" y1="28" x2="1140" y2="52" />
        </g>
        <g className="about__timeline-nodes">
          {NODES.map((n) => (
            <circle className="about__timeline-node" cx={n.x} cy="40" r="6" key={n.label} />
          ))}
        </g>
      </svg>
      <div className="about__timeline-labels" aria-hidden="true">
        <span style={{ left: '5%' }}>1961</span>
        <span style={{ left: '40%' }}>1988</span>
        <span style={{ left: '95%' }}>TODAY</span>
      </div>
    </div>
  )
}

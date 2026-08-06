const TRAIL_SIZE = 14

export function CircuitCursor() {
  return (
    <>
      <div className="reticle" id="reticle" aria-hidden="true">
        <span className="reticle__ring" />
      </div>
      <div className="reticle__trail" id="reticle-trail" aria-hidden="true">
        {Array.from({ length: TRAIL_SIZE }).map((_, i) => (
          <span className="reticle__spark" key={i} />
        ))}
      </div>
      <svg className="circuit-trace" aria-hidden="true">
        <path className="circuit-trace__path" id="circuit-trace-path" />
      </svg>
    </>
  )
}

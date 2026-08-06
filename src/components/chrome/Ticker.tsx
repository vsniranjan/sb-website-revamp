const TICKER_PHRASES =
  'ADVANCING TECHNOLOGY FOR HUMANITY · SINCE 1988 · >.HACK(); · SPARC · STEM OUTREACH · HACK-HER · HACK-A-ADDICT · LIGHT THE LIVES · CONNECT THE LIVES · '

export function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track" id="ticker-track">
        <span>{TICKER_PHRASES}</span>
        <span aria-hidden="true">{TICKER_PHRASES}</span>
      </div>
    </div>
  )
}

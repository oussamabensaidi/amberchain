import React, { useState } from "react"
import { useShipmentStore } from "@/store/shipmentStore"
import { useUserQuotes } from "@/queries/useUserQuotes"
import { applyQuoteToStore } from "@/mappers/shipmentMapper"
export default function QuoteHelperCard({ onSelectQuote, showCreateNew = false, onCreateNew, userId }) {
  const { setField } = useShipmentStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showAllLatest, setShowAllLatest] = useState(false)

  // useUserQuotes now returns { quotes, pagination } structure
  const { data: quotesData, isLoading, isError } = useUserQuotes(userId, 0, 20)
  const quotes = quotesData?.quotes || []
  
  console.log("Rendering QuoteHelperCard with quotes:", quotes)

  const filteredQuotes = quotes.filter((q) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      q.id.toLowerCase().includes(term) ||
      q.pol.toLowerCase().includes(term) ||
      q.pod.toLowerCase().includes(term) ||
      q.customer.toLowerCase().includes(term)
    )
  })

  const latestQuotes = [...quotes].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
  
  const visibleLatestQuotes = showAllLatest ? latestQuotes : latestQuotes.slice(0, 4)
  const hasMoreLatest = latestQuotes.length > 4

  


const handleUseQuote = (quote) => {
  applyQuoteToStore(quote, setField)
  onSelectQuote?.(quote)
}


  return (
    <div className="w-full max-w-xl rounded-2xl border bg-card p-6 shadow-md space-y-6">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-base font-semibold">Find an existing quote</h3>
          <p className="text-xs text-muted-foreground">
            Search or pick from recent quotes.
          </p>
        </div>

        {showCreateNew && (
          <button
            type="button"
            onClick={onCreateNew}
            className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            Create new booking
          </button>
        )}
      </div>

      {/* LOADING STATE */}
      {isLoading && (
        <div className="text-center py-8 text-sm text-muted-foreground">
          Loading quotes...
        </div>
      )}

      {/* ERROR STATE */}
      {isError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load quotes. Please try again.
        </div>
      )}

      {/* MAIN CONTENT */}
      {!isLoading && !isError && (
        <>
          {/* SEARCH BOX */}
          <div className="space-y-1 relative">
            <label className="text-xs font-medium">Search by reference, route or customer</label>

            <input
              id="quote-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setShowSuggestions(false)}
              placeholder="e.g. Q-2025-001, Rotterdam, Fresh Fruits BV"
              className="w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-primary/40"
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && filteredQuotes.length > 0 && (
              <div className="absolute z-20 mt-1 w-full rounded-lg border bg-popover shadow-xl overflow-hidden max-h-64 overflow-y-auto">
                {filteredQuotes.map((quote) => (
                  <button
                    key={quote.id}
                    type="button"
                    onMouseDown={() => {
                      handleUseQuote(quote)
                      setShowSuggestions(false)
                      setSearchTerm(`${quote.id} · ${quote.pol} → ${quote.pod}`)
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent/40 flex flex-col border-b last:border-none"
                  >
                    <span className="font-medium">
                      {quote.id} — {quote.pol} → {quote.pod}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {quote.customer || 'No customer info'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* LATEST QUOTES */}
          {quotes.length > 0 ? (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                Latest quotes
              </p>

              <div className="space-y-2">
                {visibleLatestQuotes.map((quote) => (
                  <button
                    key={quote.id}
                    type="button"
                    onClick={() => {
                      handleUseQuote(quote)
                      setSearchTerm(`${quote.id} · ${quote.pol} → ${quote.pod}`)
                    }}
                    className="w-full rounded-lg border bg-background px-4 py-3 text-sm shadow-sm hover:bg-accent/40 transition flex justify-between items-center"
                  >
                    <div className="space-y-0.5 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {quote.id} — {quote.pol} → {quote.pod}
                        </span>
                        <span className="text-[11px] text-muted-foreground">{quote.createdAt}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{quote.customer || 'No customer'}</p>
                    </div>

                    <span className="text-[11px] uppercase font-medium text-muted-foreground">
                      {quote.mode}
                    </span>
                  </button>
                ))}
                {hasMoreLatest && !showAllLatest && (
                  <button
                    type="button"
                    onClick={() => setShowAllLatest(true)}
                    className="mx-auto flex h-7 w-10 items-center justify-center rounded-full border bg-background text-lg leading-none text-muted-foreground hover:bg-accent/60"
                    aria-label="Load more latest quotes"
                  >
                    …
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No quotes found. Create your first quote to get started.
            </div>
          )}
        </>
      )}

      {/* FOOTER INFO BOX */}
      <div className="rounded-lg border bg-muted/40 px-4 py-3 text-xs text-muted-foreground space-y-1">
        <p className="font-semibold text-[11px] uppercase tracking-wide text-foreground/80">
          How this works
        </p>
        <p>
          Search by quote ID, origin, destination or customer. Select a quote above or start a new booking.
        </p>
      </div>
    </div>
  )
}
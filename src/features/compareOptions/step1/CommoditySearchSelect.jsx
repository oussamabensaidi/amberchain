import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Package } from "lucide-react"

const CommoditySearchSelect = ({
  label,
  value,
  onChange,
  placeholder = "Search commodities",
  className = ""
}) => {
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)

  const mockCommodities = [
    { id: "electronics", name: "Electronics", category: "Technology" },
    { id: "textiles", name: "Textiles", category: "Manufacturing" },
    { id: "machinery", name: "Machinery", category: "Industrial" },
    { id: "food", name: "Food Products", category: "Agriculture" },
    { id: "chemicals", name: "Chemicals", category: "Chemical" },
    { id: "automotive", name: "Automotive Parts", category: "Transportation" },
    { id: "pharmaceuticals", name: "Pharmaceuticals", category: "Healthcare" },
    { id: "furniture", name: "Furniture", category: "Consumer Goods" },
    { id: "apparel", name: "Apparel", category: "Fashion" },
    { id: "agricultural", name: "Agricultural Products", category: "Agriculture" }
  ]

  const searchCommodities = async (query) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 200)) // simulate API delay

      const q = query.toLowerCase().trim()
      const filtered = mockCommodities.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      )
      setSuggestions(filtered)
    } catch (err) {
      console.error(err)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  // Debounce search
  useEffect(() => {
    if (!value) {
      setSuggestions([])
      return
    }

    const timeoutId = setTimeout(() => {
      searchCommodities(value)
    }, 200)

    return () => clearTimeout(timeoutId)
  }, [value])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={`relative ${className}`}>
      {label && <Label className="text-sm font-medium text-foreground">{label}</Label>}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Package className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          ref={inputRef}
          className="w-full h-11 border-2 focus:border-primary transition-colors pl-10 pr-10"
          placeholder={placeholder}
          value={value || ""}
          onChange={(e) => {
            onChange(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          ) : (
            <Search className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map(s => (
            <div
              key={s.id}
              className="px-4 py-3 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
              onClick={() => {
                onChange(s.name)
                setShowSuggestions(false)
                setSuggestions([])
              }}
            >
              <div className="flex items-start gap-3">
                <Package className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{s.category}</p>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {showSuggestions && suggestions.length === 0 && value && !isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg p-4">
          <p className="text-sm text-muted-foreground text-center">
            No commodities found. Try a different search.
          </p>
        </div>
      )}
    </div>
  )
}

export default CommoditySearchSelect

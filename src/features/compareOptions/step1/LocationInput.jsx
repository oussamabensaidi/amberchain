import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Search } from "lucide-react"
import { Ship, Train, Plane, Truck } from "lucide-react"
import { searchLocations, searchPorts, searchAirports } from "@/lib/locationSearchService"

// choose icon based on mode
const getModeIcon = (mode) => {
  switch (mode) {
    case "sea":
      return <Ship className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
    case "rail":
      return <Train className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
    case "air":
      return <Plane className="h-4 w-4 text-sky-500 mt-0.5 flex-shrink-0" />
    default:
      return <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
  }
}

const LocationInput = ({ 
  id,
  label, 
  value, 
  onChange, 
  placeholder = "Enter location",
  className = "",
  error,
  mode
}) => {
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Search function using local database
  const performSearch = async (query) => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }

    setIsLoading(true)

    try {
      let results = []

      if (mode === "sea") {
        results = await searchPorts(query)
      } else if (mode === "air") {
        results = await searchAirports(query)
      } else {
        results = await searchLocations(query, "port")
      }

      // Transform results to expected format
const transformedResults = results.map(item => ({
  display_name: item.display_name,
  name: item.name,
  cityName: item.city,           // ← Changed to cityName for consistency
  countryName: item.country,     // ← Changed to countryName for consistency
  countryCode: item.countryCode || item.country_code || "",
  lat: item.lat,
  lon: item.lon,
  id: item.code || item.id || 0,
  unicode: item.unicode || item.unCode || "",   // ← Use unicode from API response
  locationType: item.locationType,
  code: item.code,
}))

      setSuggestions(transformedResults)
    
  } catch (error) {
    console.error("Error fetching locations:", error)
    setSuggestions([])
  } finally {
    setIsLoading(false)
  }
  }

  // Debounce the search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (value && value.length >= 2) {
        performSearch(value)
      } else {
        setSuggestions([])
      }
    }, 200)

    return () => clearTimeout(timeoutId)
  }, [value])

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value
    onChange(newValue)
    setShowSuggestions(true)
  }

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion)
    setShowSuggestions(false)
    setSuggestions([])
  }

  // Handle click outside
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
    <div className={`relative space-y-2 ${className}`}>
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          id={id}
          ref={inputRef}
          className="w-full h-11 border-2 focus:border-primary transition-colors pl-10 pr-10"
          placeholder={placeholder}
          value={value || ""}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          ) : (
            <Search className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-3 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {suggestion.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {suggestion.display_name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Field error (if any) */}
      {error && (
        <p id={`${id}-error`} className="text-destructive text-xs mt-1" role="alert" aria-live="polite">
          {error}
        </p>
      )}
      
      {/* No results message */}
      {showSuggestions && suggestions.length === 0 && value && value.length >= 3 && !isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg p-4">
          <p className="text-sm text-muted-foreground text-center">
            No locations found. Try a different search term.
          </p>
        </div>
      )}
    </div>
  )
}

export default LocationInput
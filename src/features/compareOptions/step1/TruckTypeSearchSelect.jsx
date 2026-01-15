import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Truck } from "lucide-react"

const TruckTypeSearchSelect = ({ 
  label, 
  value, 
  onChange, 
  placeholder = "Search truck types",
  className = "" 
}) => {
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Static truck type options
  const truckTypes = [
    { id: "van", name: "Van", description: "Small cargo van" },
    { id: "small-truck", name: "Small Truck", description: "3.5t light truck" },
    { id: "medium-truck", name: "Medium Truck", description: "7.5t box truck" },
    { id: "large-truck", name: "Large Truck", description: "12t rigid truck" },
    { id: "flatbed", name: "Flatbed", description: "Open flatbed truck" },
    { id: "curtain-sider", name: "Curtain Sider", description: "Curtainsider trailer" },
    { id: "box", name: "Box Truck", description: "Closed box body" },
    { id: "reefer", name: "Reefer", description: "Refrigerated truck" },
    { id: "mega-trailer", name: "Mega Trailer", description: "High volume trailer" },
    { id: "low-loader", name: "Low Loader", description: "Low loader for oversized" },
    { id: "tipper", name: "Tipper", description: "Tipper truck" },
    { id: "tanker", name: "Tanker", description: "Liquid tanker" },
    { id: "car-carrier", name: "Car Carrier", description: "Vehicle transporter" },
  ]

  const filterTruckTypes = (query) => {
    if (!query || query.length < 1) return truckTypes
    return truckTypes.filter(t =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase())
    )
  }

  const handleInputChange = (e) => {
    const newValue = e.target.value
    onChange(newValue)
    setSuggestions(filterTruckTypes(newValue))
    setShowSuggestions(true)
  }

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.name)
    setShowSuggestions(false)
    setSuggestions([])
  }

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

  const handleFocus = () => {
    setShowSuggestions(true)
    if (!value) setSuggestions(truckTypes)
  }

  return (
    <div className={`relative space-y-2 ${className}`}>
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Truck className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          ref={inputRef}
          className="w-full h-11 border-2 focus:border-primary transition-colors pl-10 pr-10"
          placeholder={placeholder}
          value={value || ""}
          onChange={handleInputChange}
          onFocus={handleFocus}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="px-4 py-3 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-start gap-3">
                <Truck className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {suggestion.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {suggestion.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && value && value.length >= 1 && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg p-4">
          <p className="text-sm text-muted-foreground text-center">
            No truck types found. Try a different search term.
          </p>
        </div>
      )}
    </div>
  )
}

export default TruckTypeSearchSelect

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Container } from "lucide-react"

const ContainerTypeSearchSelect = ({ 
  label, 
  value, 
  onChange, 
  placeholder = "Search container types",
  className = "" 
}) => {
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Static container type options
  const containerTypes = [
    { id: "20-standard", name: "20' Standard", description: "Standard 20ft container" },
    { id: "40-standard", name: "40' Standard", description: "Standard 40ft container" },
    { id: "40-high-cube", name: "40' High Cube", description: "High cube 40ft container" },
    { id: "45-high-cube", name: "45' High Cube", description: "High cube 45ft container" },
    { id: "20-refrigerated", name: "20' Refrigerated", description: "Reefer 20ft container" },
    { id: "40-refrigerated", name: "40' Refrigerated", description: "Reefer 40ft container" },
    { id: "20-open-top", name: "20' Open Top", description: "Open top 20ft container" },
    { id: "40-open-top", name: "40' Open Top", description: "Open top 40ft container" },
    { id: "20-flatrack", name: "20' Flatrack", description: "Flatrack 20ft container" },
    { id: "40-flatrack", name: "40' Flatrack", description: "Flatrack 40ft container" },
    { id: "20-flatrack-collapsible", name: "20' Flatrack Collapsible", description: "Collapsible flatrack 20ft" },
    { id: "40-flatrack-collapsible", name: "40' Flatrack Collapsible", description: "Collapsible flatrack 40ft" },
    { id: "20-high-cube", name: "20' High Cube", description: "High cube 20ft container" },
    { id: "20-pallet-wide", name: "20' Pallet Wide", description: "Pallet wide 20ft container" },
    { id: "20-high-cube-pallet-wide", name: "20' High Cube Pallet Wide", description: "High cube pallet wide 20ft" },
    { id: "40-pallet-wide", name: "40' Pallet Wide", description: "Pallet wide 40ft container" },
    { id: "40-high-cube-pallet-wide", name: "40' High Cube Pallet Wide", description: "High cube pallet wide 40ft" },
    { id: "45-high-cube-pallet-wide", name: "45' High Cube Pallet Wide", description: "High cube pallet wide 45ft" },
    { id: "10-standard", name: "10' Standard", description: "Standard 10ft container" },
    { id: "20-bulk", name: "20' Bulk", description: "Bulk 20ft container" },
    { id: "20-tank", name: "20' Tank", description: "Tank 20ft container" },
    { id: "20-platform", name: "20' Platform", description: "Platform 20ft container" },
    { id: "40-platform", name: "40' Platform", description: "Platform 40ft container" },
    { id: "48-high-cube", name: "48' High Cube", description: "High cube 48ft container" },
    { id: "53-high-cube", name: "53' High Cube", description: "High cube 53ft container" }
  ]

  // Filter container types based on search query
  const filterContainerTypes = (query) => {
    if (!query || query.length < 1) {
      return containerTypes
    }

    return containerTypes.filter(container =>
      container.name.toLowerCase().includes(query.toLowerCase()) ||
      container.description.toLowerCase().includes(query.toLowerCase())
    )
  }

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value
    onChange(newValue)
    setSuggestions(filterContainerTypes(newValue))
    setShowSuggestions(true)
  }

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.name)
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

  // Show all options when input is focused and empty
  const handleFocus = () => {
    setShowSuggestions(true)
    if (!value) {
      setSuggestions(containerTypes)
    }
  }

  return (
    <div className={`relative space-y-2 ${className}`}>
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Container className="h-4 w-4 text-muted-foreground" />
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

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              className="px-4 py-3 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-start gap-3">
                <Container className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
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

      {/* No results message */}
      {showSuggestions && suggestions.length === 0 && value && value.length >= 1 && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg p-4">
          <p className="text-sm text-muted-foreground text-center">
            No container types found. Try a different search term.
          </p>
        </div>
      )}
    </div>
  )
}

export default ContainerTypeSearchSelect

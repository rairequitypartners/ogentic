
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FilterState {
  types: string[];
  sources: string[];
  complexity: string[];
  industries: string[];
}

interface DiscoveryFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  userPreferences: any;
}

const FILTER_OPTIONS = {
  types: [
    { id: "prompt", label: "Prompts", color: "bg-blue-100 text-blue-800" },
    { id: "tool", label: "Tools", color: "bg-green-100 text-green-800" },
    { id: "model", label: "Models", color: "bg-purple-100 text-purple-800" },
    { id: "agent", label: "Agents", color: "bg-orange-100 text-orange-800" }
  ],
  sources: [
    { id: "openai", label: "OpenAI" },
    { id: "anthropic", label: "Anthropic" },
    { id: "google", label: "Google" },
    { id: "microsoft", label: "Microsoft" },
    { id: "huggingface", label: "Hugging Face" },
    { id: "custom", label: "Custom" },
    { id: "community", label: "Community" }
  ],
  complexity: [
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
    { id: "expert", label: "Expert" }
  ],
  industries: [
    { id: "healthcare", label: "Healthcare" },
    { id: "finance", label: "Finance" },
    { id: "education", label: "Education" },
    { id: "ecommerce", label: "E-commerce" },
    { id: "marketing", label: "Marketing" },
    { id: "technology", label: "Technology" },
    { id: "legal", label: "Legal" },
    { id: "manufacturing", label: "Manufacturing" }
  ]
};

export const DiscoveryFilters = ({ filters, onFilterChange, userPreferences }: DiscoveryFiltersProps) => {
  const handleFilterToggle = (category: keyof FilterState, value: string) => {
    const currentFilters = filters[category];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(item => item !== value)
      : [...currentFilters, value];
    
    onFilterChange({
      ...filters,
      [category]: newFilters
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      types: [],
      sources: [],
      complexity: [],
      industries: []
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).flat().length;
  };

  const applyUserPreferences = () => {
    if (!userPreferences) return;
    
    const newFilters = { ...filters };
    
    if (userPreferences.industry) {
      newFilters.industries = [userPreferences.industry.toLowerCase()];
    }
    
    if (userPreferences.ux_complexity) {
      newFilters.complexity = [userPreferences.ux_complexity.toLowerCase()];
    }
    
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters</CardTitle>
            {getActiveFilterCount() > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-xs"
              >
                Clear All
              </Button>
            )}
          </div>
          {userPreferences && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={applyUserPreferences}
              className="w-full text-xs"
            >
              Apply My Preferences
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Component Types */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Component Type</Label>
            <div className="space-y-2">
              {FILTER_OPTIONS.types.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={type.id}
                    checked={filters.types.includes(type.id)}
                    onCheckedChange={() => handleFilterToggle('types', type.id)}
                  />
                  <Label htmlFor={type.id} className="text-sm cursor-pointer">
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Sources */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Source</Label>
            <div className="space-y-2">
              {FILTER_OPTIONS.sources.map((source) => (
                <div key={source.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={source.id}
                    checked={filters.sources.includes(source.id)}
                    onCheckedChange={() => handleFilterToggle('sources', source.id)}
                  />
                  <Label htmlFor={source.id} className="text-sm cursor-pointer">
                    {source.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Complexity */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Complexity</Label>
            <div className="space-y-2">
              {FILTER_OPTIONS.complexity.map((level) => (
                <div key={level.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={level.id}
                    checked={filters.complexity.includes(level.id)}
                    onCheckedChange={() => handleFilterToggle('complexity', level.id)}
                  />
                  <Label htmlFor={level.id} className="text-sm cursor-pointer">
                    {level.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Industries */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Industry</Label>
            <div className="space-y-2">
              {FILTER_OPTIONS.industries.map((industry) => (
                <div key={industry.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={industry.id}
                    checked={filters.industries.includes(industry.id)}
                    onCheckedChange={() => handleFilterToggle('industries', industry.id)}
                  />
                  <Label htmlFor={industry.id} className="text-sm cursor-pointer">
                    {industry.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {getActiveFilterCount() > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Active Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([category, values]) =>
                values.map((value) => (
                  <Badge key={`${category}-${value}`} variant="secondary" className="text-xs">
                    {value}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0 text-xs"
                      onClick={() => handleFilterToggle(category as keyof FilterState, value)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

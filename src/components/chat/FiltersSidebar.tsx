
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, FileText, Wrench, Bot, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FilterState {
  types: string[];
  sources: string[];
  complexity: string[];
  industries: string[];
}

interface FiltersSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const filterOptions = {
  types: [
    { id: 'prompt', label: 'Prompts', icon: FileText, color: 'bg-blue-100 text-blue-800' },
    { id: 'tool', label: 'Tools', icon: Wrench, color: 'bg-green-100 text-green-800' },
    { id: 'model', label: 'Models', icon: Bot, color: 'bg-purple-100 text-purple-800' },
    { id: 'agent', label: 'Agents', icon: Zap, color: 'bg-orange-100 text-orange-800' },
  ],
  sources: [
    { id: 'openai', label: 'OpenAI' },
    { id: 'anthropic', label: 'Anthropic' },
    { id: 'google', label: 'Google' },
    { id: 'huggingface', label: 'Hugging Face' },
    { id: 'community', label: 'Community' },
  ],
  complexity: [
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
  ],
  industries: [
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'finance', label: 'Finance' },
    { id: 'education', label: 'Education' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'development', label: 'Development' },
  ],
};

export const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  isOpen,
  onToggle,
  filters,
  onFiltersChange,
}) => {
  const toggleFilter = (category: keyof FilterState, value: string) => {
    const currentValues = filters[category];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFiltersChange({
      ...filters,
      [category]: newValues,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      types: [],
      sources: [],
      complexity: [],
      industries: [],
    });
  };

  const totalActiveFilters = Object.values(filters).flat().length;

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-full w-80 bg-background border-r z-50 lg:relative lg:z-0"
      >
        <div className="p-4 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Filters</h2>
              {totalActiveFilters > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {totalActiveFilters}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onToggle} className="lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Clear All */}
          {totalActiveFilters > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="w-full mb-4"
            >
              Clear All Filters
            </Button>
          )}

          {/* Filter Categories */}
          <div className="space-y-6">
            {/* Types */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {filterOptions.types.map((type) => {
                    const Icon = type.icon;
                    const isActive = filters.types.includes(type.id);
                    return (
                      <motion.button
                        key={type.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleFilter('types', type.id)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          isActive 
                            ? 'border-primary bg-primary/10 text-primary' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Icon className="h-4 w-4 mb-1" />
                        <div className="text-xs font-medium">{type.label}</div>
                      </motion.button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Sources */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filterOptions.sources.map((source) => {
                    const isActive = filters.sources.includes(source.id);
                    return (
                      <motion.button
                        key={source.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => toggleFilter('sources', source.id)}
                        className={`w-full p-2 rounded-md text-sm text-left transition-all ${
                          isActive 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-muted'
                        }`}
                      >
                        {source.label}
                      </motion.button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Complexity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Complexity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filterOptions.complexity.map((level) => {
                    const isActive = filters.complexity.includes(level.id);
                    return (
                      <motion.button
                        key={level.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => toggleFilter('complexity', level.id)}
                        className={`w-full p-2 rounded-md text-sm text-left transition-all ${
                          isActive 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-muted'
                        }`}
                      >
                        {level.label}
                      </motion.button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Industries */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Industry</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filterOptions.industries.map((industry) => {
                    const isActive = filters.industries.includes(industry.id);
                    return (
                      <motion.button
                        key={industry.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => toggleFilter('industries', industry.id)}
                        className={`w-full p-2 rounded-md text-sm text-left transition-all ${
                          isActive 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-muted'
                        }`}
                      >
                        {industry.label}
                      </motion.button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Toggle Button (when sidebar is closed) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={onToggle}
            className="fixed left-4 top-1/2 transform -translate-y-1/2 z-30 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <Filter className="h-4 w-4" />
            {totalActiveFilters > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalActiveFilters}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

import React, { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
}

export const SearchBar = ({ onSearch, placeholder = "Describe your automation needs...", className, value: initialValue = "" }: SearchBarProps) => {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  // Update query when initialValue changes
  React.useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full max-w-2xl mx-auto", className)}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 pr-24 py-6 text-lg rounded-xl border-2 border-primary/20 focus:border-primary transition-colors"
        />
        <Button 
          type="submit" 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg"
          disabled={!query.trim()}
        >
          Search
        </Button>
      </div>
    </form>
  );
};

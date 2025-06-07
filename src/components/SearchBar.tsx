
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const exampleQueries = [
  "Automate my customer support emails",
  "Create marketing content for social media",
  "Generate product descriptions for my e-commerce store",
  "Analyze sales data and create reports",
  "Write professional meeting summaries"
];

export const SearchBar = ({ onSearch, placeholder = "What do you want to automate or improve?", className = "" }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    onSearch(example);
  };

  return (
    <div className={`w-full max-w-3xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative transition-all duration-300 ${focused ? 'scale-105' : ''}`}>
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            className="w-full pl-12 pr-32 py-6 text-lg border-2 border-border focus:border-primary rounded-2xl shadow-lg focus:shadow-xl transition-all duration-300"
          />
          <Button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 rounded-xl button-glow"
            disabled={!query.trim()}
          >
            Search
          </Button>
        </div>
      </form>
      
      <div className="mt-6">
        <p className="text-sm text-muted-foreground mb-3 text-center">Try these examples:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {exampleQueries.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="px-4 py-2 text-sm bg-muted hover:bg-accent rounded-full transition-all duration-200 hover:scale-105 hover:shadow-md"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

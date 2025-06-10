
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SuggestedQueriesProps {
  queries: string[];
  onSelectQuery: (query: string) => void;
  className?: string;
}

export const SuggestedQueries = ({ queries, onSelectQuery, className = "" }: SuggestedQueriesProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate examples every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % queries.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [queries.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className={`space-y-3 ${className}`}
    >
      <p className="text-sm text-muted-foreground text-center mb-4">
        Popular searches:
      </p>
      
      <div className="max-w-3xl mx-auto">
        <div className="relative h-16 mb-6 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.button
              key={currentIndex}
              onClick={() => onSelectQuery(queries[currentIndex])}
              className="absolute w-full text-center group"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <span className="text-foreground font-medium text-xl hover:text-primary transition-colors">
                {queries[currentIndex]}
              </span>
            </motion.button>
          </AnimatePresence>
        </div>
        
        {/* Progress indicators */}
        <div className="flex justify-center space-x-2">
          {queries.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary w-8' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, Zap, Target, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, needsOnboarding, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);

  // Redirect to onboarding if user needs it
  useEffect(() => {
    if (!authLoading && user && needsOnboarding) {
      navigate("/onboarding");
    }
  }, [user, needsOnboarding, authLoading, navigate]);

  if (showChat) {
    return (
      <div className="h-screen">
        <Header />
        <div className="h-full pt-16">
          <ChatInterface />
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl text-center space-y-8">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-extrabold text-gradient mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Meet OgenticAI
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Your AI-powered discovery assistant. Chat naturally to find the perfect tools, prompts, models, and agents for any task.
            </motion.p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button 
              onClick={() => setShowChat(true)}
              size="lg"
              className="text-lg px-8 py-6 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 transform hover:scale-105"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Start Chatting
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              No signup required • Instant results • Powered by AI
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div 
              className="p-6 rounded-xl bg-card border card-hover"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sparkles className="h-8 w-8 text-primary mb-4 mx-auto" />
              <h3 className="font-semibold mb-2">Conversational Discovery</h3>
              <p className="text-sm text-muted-foreground">
                Simply describe what you need in natural language. Our AI understands context and finds exactly what you're looking for.
              </p>
            </motion.div>
            
            <motion.div 
              className="p-6 rounded-xl bg-card border card-hover"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Zap className="h-8 w-8 text-primary mb-4 mx-auto" />
              <h3 className="font-semibold mb-2">Real-Time Results</h3>
              <p className="text-sm text-muted-foreground">
                Get live, streaming responses with the latest AI tools and prompts. See results appear as our AI searches and analyzes.
              </p>
            </motion.div>
            
            <motion.div 
              className="p-6 rounded-xl bg-card border card-hover"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Target className="h-8 w-8 text-primary mb-4 mx-auto" />
              <h3 className="font-semibold mb-2">Lifecycle Guidance</h3>
              <p className="text-sm text-muted-foreground">
                Not just discovery - get setup guides, optimization tips, and implementation support for every tool.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p className="text-sm text-muted-foreground mb-4">
              Try these example queries:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "Find AI tools for content creation",
                "Best prompts for coding assistance", 
                "Customer support automation agents",
                "Data analysis models"
              ].map((example, index) => (
                <motion.button
                  key={example}
                  onClick={() => setShowChat(true)}
                  className="text-xs px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                >
                  {example}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Index;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { MyStacksView } from "@/components/MyStacksView";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, Zap, Target, MessageCircle, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, needsOnboarding, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const [showMyStacks, setShowMyStacks] = useState(false);

  // Redirect to onboarding if user needs it
  useEffect(() => {
    if (!authLoading && user && needsOnboarding) {
      navigate("/onboarding");
    }
  }, [user, needsOnboarding, authLoading, navigate]);

  if (showMyStacks) {
    return (
      <div className="h-screen">
        <Header />
        <div className="h-full pt-16 overflow-auto">
          <div className="p-4">
            <Button 
              variant="outline" 
              onClick={() => setShowMyStacks(false)}
              className="mb-4"
            >
              ← Back to Chat
            </Button>
            <MyStacksView />
          </div>
        </div>
      </div>
    );
  }

  if (showChat) {
    return (
      <div className="h-screen">
        <Header />
        <div className="h-full pt-16 relative">
          <div className="absolute top-4 right-4 z-10">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowMyStacks(true)}
              className="bg-background/80 backdrop-blur-sm"
            >
              <Bookmark className="h-4 w-4 mr-2" />
              My Stacks
            </Button>
          </div>
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
              Your AI Agent. Your Stack. Your Results.
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Stop wasting time stitching together tools and prompts. Ogentic AI helps you find, deploy, and manage the perfect AI stack — tuned to your exact workflow — in minutes.
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
              Start Building Your Stack
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              No signup required • Deploy in minutes • Driven by outcomes
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
              <h3 className="font-semibold mb-2">Save Time</h3>
              <p className="text-sm text-muted-foreground">
                Stop researching and testing tools. Get a complete AI stack deployed to your workflow in minutes, not weeks.
              </p>
            </motion.div>
            
            <motion.div 
              className="p-6 rounded-xl bg-card border card-hover"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Zap className="h-8 w-8 text-primary mb-4 mx-auto" />
              <h3 className="font-semibold mb-2">Drive Revenue</h3>
              <p className="text-sm text-muted-foreground">
                Focus on results that matter. Every stack is tuned for specific outcomes — more leads, faster QA, better content.
              </p>
            </motion.div>
            
            <motion.div 
              className="p-6 rounded-xl bg-card border card-hover"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Target className="h-8 w-8 text-primary mb-4 mx-auto" />
              <h3 className="font-semibold mb-2">Ship Faster</h3>
              <p className="text-sm text-muted-foreground">
                Deploy complete workflows, not individual tools. Integrate with your existing stack and start seeing results immediately.
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
              Try these popular workflows:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "Automate personalized outbound emails for my SaaS",
                "Speed up QA process for my engineering team", 
                "Summarize customer support tickets weekly",
                "Draft onboarding emails for new users",
                "Auto-generate blog posts from product updates"
              ].map((example, index) => (
                <motion.button
                  key={example}
                  onClick={() => setShowChat(true)}
                  className="text-xs px-3 py-2 rounded-full bg-muted hover:bg-muted/80 transition-colors text-left"
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

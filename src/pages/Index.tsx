
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { MyStacksView } from "@/components/MyStacksView";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, Zap, Target, MessageCircle, Bookmark, ChevronRight } from "lucide-react";
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
      <div className="min-h-screen bg-background">
        
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight leading-tight mb-6">
                Your AI Agent.
                <br />
                <span className="text-muted-foreground">Your Stack.</span>
                <br />
                Your Results.
              </h1>
              
              <motion.p 
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Stop wasting time stitching together tools and prompts. Ogentic AI helps you find, deploy, and manage the perfect AI stack — tuned to your exact workflow — in minutes.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-4"
              >
                <Button 
                  onClick={() => setShowChat(true)}
                  size="lg"
                  className="h-14 px-8 text-lg font-medium rounded-full bg-primary hover:bg-primary/90 transition-all duration-200"
                >
                  Start Building Your Stack
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Button>
                
                <p className="text-sm text-muted-foreground">
                  No signup required • Deploy in minutes • Driven by outcomes
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="text-center p-8 rounded-3xl bg-card border border-border/50 hover:border-border transition-all duration-300"
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Save Time</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Stop researching and testing tools. Get a complete AI stack deployed to your workflow in minutes, not weeks.
                </p>
              </motion.div>
              
              <motion.div 
                className="text-center p-8 rounded-3xl bg-card border border-border/50 hover:border-border transition-all duration-300"
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Drive Revenue</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Focus on results that matter. Every stack is tuned for specific outcomes — more leads, faster QA, better content.
                </p>
              </motion.div>
              
              <motion.div 
                className="text-center p-8 rounded-3xl bg-card border border-border/50 hover:border-border transition-all duration-300"
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Ship Faster</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Deploy complete workflows, not individual tools. Integrate with your existing stack and start seeing results immediately.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Examples Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
                Try these popular workflows
              </h2>
              <p className="text-muted-foreground mb-12 text-lg">
                Get started with proven AI stacks that deliver results
              </p>
              
              <div className="grid gap-4 max-w-3xl mx-auto">
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
                    className="w-full p-4 text-left rounded-2xl bg-muted/50 hover:bg-muted transition-all duration-200 border border-border/30 hover:border-border/50 group"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <span className="text-foreground font-medium">{example}</span>
                    <ChevronRight className="h-4 w-4 float-right mt-0.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-6 tracking-tight">
                Ready to build your
                <br />
                perfect AI stack?
              </h2>
              
              <Button 
                onClick={() => setShowChat(true)}
                size="lg"
                className="h-14 px-8 text-lg font-medium rounded-full bg-primary hover:bg-primary/90 transition-all duration-200"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Get Started Now
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;

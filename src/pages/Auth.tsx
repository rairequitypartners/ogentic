import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, Info, Mail, Lock, User, AlertTriangle } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn, signUp, user, signInWithGithub, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  
  const handleGitHubSignIn = async () => {
    await signInWithGithub();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) return;
    setLoading(true);
    setError(null);

    try {
      let result;
      if (isSignUp) {
        result = await signUp(email, password, fullName);
      } else {
        result = await signIn(email, password);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: isSignUp ? "Account created!" : "Welcome back!",
        description: isSignUp ? "Please check your email to verify your account." : "You've been signed in successfully.",
      });

      if (!isSignUp) {
        navigate("/");
      }

    } catch (err: any) {
      const errorMessage = err.message || "An error occurred. Please try again.";
      setError(errorMessage);
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl bg-background/80 backdrop-blur-sm border-primary/10">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-gradient">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </CardTitle>
           <p className="text-muted-foreground text-sm leading-relaxed">
            {isSignUp 
              ? "Join ZingGPT to create, manage, and deploy AI stacks."
              : "Sign in to access your projects."
            }
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <Button
              onClick={handleGitHubSignIn}
              className="w-full h-11 text-base"
              variant="outline"
              disabled={!isSupabaseConfigured}
            >
              <FaGithub className="mr-3 h-5 w-5" />
              Sign {isSignUp ? 'up' : 'in'} with GitHub
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="pl-10"
                    required={isSignUp}
                    disabled={!isSupabaseConfigured}
                  />
                </div>
              )}
              
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10"
                  required
                  disabled={!isSupabaseConfigured}
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                  minLength={6}
                  disabled={!isSupabaseConfigured}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full button-glow"
                disabled={loading || !isSupabaseConfigured}
              >
                {loading ? "Please wait..." : (isSignUp ? "Create Account" : "Sign In")}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isSupabaseConfigured}
              >
                {isSignUp 
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

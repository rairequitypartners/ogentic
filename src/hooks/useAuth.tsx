import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isInitialized: boolean;
  needsOnboarding: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: any }>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  checkOnboardingStatus: () => Promise<void>;
  isSupabaseConfigured: boolean;
  signInWithGithub: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);

  useEffect(() => {
    const checkSupabaseConfig = () => {
      const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const apiUrl = import.meta.env.VITE_SUPABASE_URL;
      const isConfigured = !!(apiKey && apiKey !== 'your_supabase_anon_key_here' && apiUrl && apiUrl !== 'your_supabase_url_here');
      setIsSupabaseConfigured(isConfigured);
      return isConfigured;
    };

    if (checkSupabaseConfig()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        setIsInitialized(true); 
      });

      // Check initial session
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (error) {
          console.error('[Auth] Error getting session:', error);
        }
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        setIsInitialized(true);
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
      setIsInitialized(true);
    }
  }, []);

  const checkOnboardingStatus = async () => {
    if (!user || !isSupabaseConfigured) {
      setNeedsOnboarding(false);
      return;
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('[Auth] Error checking onboarding status:', error);
        setNeedsOnboarding(false);
        return;
      }

      setNeedsOnboarding(!profile?.onboarding_completed);
    } catch (error) {
      console.error('[Auth] Error checking onboarding status:', error);
      setNeedsOnboarding(false);
    }
  };

  useEffect(() => {
    if (user && isSupabaseConfigured) {
      checkOnboardingStatus();
    }
  }, [user, isSupabaseConfigured]);

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (!isSupabaseConfigured) {
      return { 
        error: { 
          message: "Authentication is not configured. Please set up Supabase credentials in your .env file." 
        } 
      };
    }

    const redirectUrl = `${window.location.origin}/`;
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) {
        console.error('[Auth] Sign up error:', error);
      }
      
      return { error };
    } catch (error) {
      console.error('[Auth] Sign up exception:', error);
      return { 
        error: { 
          message: "An unexpected error occurred during sign up. Please try again." 
        } 
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { 
        error: { 
          message: "Authentication is not configured. Please set up Supabase credentials in your .env file." 
        } 
      };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('[Auth] Sign in error:', error);
      }
      
      return { error };
    } catch (error) {
      console.error('[Auth] Sign in exception:', error);
      return { 
        error: { 
          message: "An unexpected error occurred during sign in. Please try again." 
        } 
      };
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      console.warn('[Auth] Cannot sign out - Supabase not configured');
      return;
    }

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('[Auth] Sign out error:', error);
    }
  };

  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
    if (error) {
      console.error('Error signing in with GitHub:', error);
      toast({
        title: "GitHub Sign In Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isInitialized,
      needsOnboarding,
      signUp,
      signIn,
      signOut,
      checkOnboardingStatus,
      isSupabaseConfigured,
      signInWithGithub
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

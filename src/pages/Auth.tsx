import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Eye, EyeOff, Bot, BarChart3, Coins, Users } from "lucide-react";
import Ambient from "@/components/ui/ambient";
import { toast } from "sonner";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/home");
      }
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/home");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Successfully signed in!");
      } else {
        if (password !== confirmPassword) {
          toast.error("Passwords don't match!");
          return;
        }
        
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl
          }
        });
        if (error) throw error;
        toast.success("Check your email for the confirmation link!");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      if (error.message.includes("User already registered")) {
        toast.error("User already exists. Please sign in instead.");
        setIsLogin(true);
      } else if (error.message.includes("Invalid login credentials")) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.error(error.message || "An error occurred during authentication");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    navigate('/wzrd/studio');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent text-white p-4 relative overflow-hidden">
      <Ambient showAsciiStreams={true} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-background/20 backdrop-blur-sm border border-border rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MusicOS
            </h1>
            <p className="text-muted-foreground text-lg">
              {isLogin ? "Sign in to your account" : "Create your account"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-white/80">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-white/80">Password</Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10"
                  placeholder="Enter your password"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            {!isLogin && (
              <div>
                <Label htmlFor="confirmPassword" className="text-white/80">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="Confirm your password"
                  minLength={6}
                />
              </div>
            )}
            
            <Button 
              type="submit"
              className="w-full bg-accent text-white hover:bg-accent/90 h-12 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")}
            </Button>
          </form>
          
          <div className="text-center mt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:text-primary/80 transition-colors text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
          
          <div className="text-center text-sm text-muted-foreground my-4">
            or continue with
          </div>
          
          <Button
            onClick={handleGuestAccess}
            variant="outline"
            className="w-full h-12 text-base font-medium bg-background/50 border-border hover:bg-background/70"
          >
            Enter as Guest
          </Button>

          {/* Feature Icons */}
          <div className="flex justify-center items-center gap-8 mt-8 pt-6 border-t border-border">
            <motion.div
              className="flex flex-col items-center gap-2 text-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">AI Agents</span>
            </motion.div>

            <motion.div
              className="flex flex-col items-center gap-2 text-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-accent" />
              </div>
              <span className="text-xs text-muted-foreground">Dashboard</span>
            </motion.div>

            <motion.div
              className="flex flex-col items-center gap-2 text-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Coins className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Treasury</span>
            </motion.div>

            <motion.div
              className="flex flex-col items-center gap-2 text-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <span className="text-xs text-muted-foreground">Assistants</span>
            </motion.div>
          </div>

          {/* Legal Text */}
          <div className="text-center mt-6 pt-4">
            <p className="text-xs text-muted-foreground">
              By signing in, you agree to our{' '}
              <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>
              {' '}and{' '}
              <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
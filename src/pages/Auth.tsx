import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Eye, EyeOff, Bot, BarChart3, Coins, Users, Sparkles, Zap, Globe } from "lucide-react";
import CosmicShader from "@/components/ui/shaders/CosmicShader";
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
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (session) {
        navigate("/home");
      }
    };
    checkUser();

    // Listen for auth changes
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
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
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        toast.success("Successfully signed in!");
      } else {
        if (password !== confirmPassword) {
          toast.error("Passwords don't match!");
          return;
        }
        const redirectUrl = `${window.location.origin}/`;
        const {
          error
        } = await supabase.auth.signUp({
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
  return <div className="min-h-screen flex items-center justify-center bg-transparent text-white p-4 relative overflow-hidden">
      <CosmicShader />
      
      <motion.div initial={{
      opacity: 0,
      y: 30,
      scale: 0.95
    }} animate={{
      opacity: 1,
      y: 0,
      scale: 1
    }} transition={{
      duration: 0.8,
      ease: "easeOut"
    }} className="w-full max-w-lg relative z-10">
        <div className="bg-background/10 backdrop-blur-xl border border-border/30 rounded-2xl p-10 shadow-2xl">
          <div className="text-center mb-10">
            <motion.div initial={{
            scale: 0.8,
            opacity: 0
          }} animate={{
            scale: 1,
            opacity: 1
          }} transition={{
            delay: 0.2,
            duration: 0.6
          }} className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">UniversalAI</h1>
            </motion.div>
            <motion.p initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4,
            duration: 0.6
          }} className="text-muted-foreground text-lg font-medium">
              {isLogin ? "Welcome back to the Creator OS" : "Join the Creator OS"}
            </motion.p>
          </div>

          <motion.form onSubmit={handleAuth} className="space-y-7" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.6,
          duration: 0.6
        }}>
            <motion.div initial={{
            x: -20,
            opacity: 0
          }} animate={{
            x: 0,
            opacity: 1
          }} transition={{
            delay: 0.7,
            duration: 0.5
          }}>
              <Label htmlFor="email" className="text-white/90 font-medium text-sm mb-3 block">
                Email Address
              </Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-xl backdrop-blur-sm hover:bg-white/10 focus:bg-white/10 transition-all duration-300" placeholder="Enter your email address" />
            </motion.div>
            
            <motion.div initial={{
            x: -20,
            opacity: 0
          }} animate={{
            x: 0,
            opacity: 1
          }} transition={{
            delay: 0.8,
            duration: 0.5
          }}>
              <Label htmlFor="password" className="text-white/90 font-medium text-sm mb-3 block">
                Password
              </Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-xl backdrop-blur-sm hover:bg-white/10 focus:bg-white/10 transition-all duration-300 pr-12" placeholder="Enter your password" minLength={6} />
                <motion.button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200" whileHover={{
                scale: 1.1
              }} whileTap={{
                scale: 0.9
              }}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </motion.button>
              </div>
            </motion.div>
            
            {!isLogin && <motion.div initial={{
            x: -20,
            opacity: 0
          }} animate={{
            x: 0,
            opacity: 1
          }} transition={{
            delay: 0.9,
            duration: 0.5
          }}>
                <Label htmlFor="confirmPassword" className="text-white/90 font-medium text-sm mb-3 block">
                  Confirm Password
                </Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-xl backdrop-blur-sm hover:bg-white/10 focus:bg-white/10 transition-all duration-300" placeholder="Confirm your password" minLength={6} />
              </motion.div>}
            
            <motion.div initial={{
            y: 20,
            opacity: 0
          }} animate={{
            y: 0,
            opacity: 1
          }} transition={{
            delay: 1.0,
            duration: 0.5
          }}>
              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white h-14 text-base font-semibold rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]" disabled={isLoading}>
                {isLoading ? <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div> : <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    {isLogin ? "Enter UniversalAI" : "Create Account"}
                  </div>}
              </Button>
            </motion.div>
          </motion.form>
          
          <motion.div className="text-center mt-6" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 1.1,
          duration: 0.5
        }}>
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:text-accent transition-colors text-sm font-medium hover:underline">
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </motion.div>
          
          <motion.div className="flex items-center gap-4 my-8" initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: 1.2,
          duration: 0.5
        }}>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border" />
            <span className="text-sm text-muted-foreground font-medium">or continue with</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border" />
          </motion.div>
          
          <motion.div initial={{
          y: 20,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} transition={{
          delay: 1.3,
          duration: 0.5
        }}>
            <Button onClick={handleGuestAccess} variant="outline" className="w-full h-12 text-base font-medium bg-white/5 border-white/20 hover:bg-white/10 text-white rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Enter as Guest
              </div>
            </Button>
          </motion.div>

          {/* Feature Icons */}
          <motion.div className="grid grid-cols-4 gap-4 mt-10 pt-8 border-t border-border/30" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 1.4,
          duration: 0.6
        }}>
            <motion.div className="flex flex-col items-center gap-3 text-center cursor-pointer group" whileHover={{
            scale: 1.1,
            y: -2
          }} whileTap={{
            scale: 0.95
          }} transition={{
            type: "spring",
            stiffness: 400,
            damping: 10
          }}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center backdrop-blur-sm border border-primary/20 group-hover:border-primary/40 transition-all duration-300">
                <Bot className="h-7 w-7 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <span className="text-xs text-muted-foreground font-medium group-hover:text-white transition-colors duration-300">AI Agents</span>
            </motion.div>

            <motion.div className="flex flex-col items-center gap-3 text-center cursor-pointer group" whileHover={{
            scale: 1.1,
            y: -2
          }} whileTap={{
            scale: 0.95
          }} transition={{
            type: "spring",
            stiffness: 400,
            damping: 10
          }}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/40 flex items-center justify-center backdrop-blur-sm border border-accent/20 group-hover:border-accent/40 transition-all duration-300">
                <BarChart3 className="h-7 w-7 text-accent group-hover:text-white transition-colors duration-300" />
              </div>
              <span className="text-xs text-muted-foreground font-medium group-hover:text-white transition-colors duration-300">Analytics</span>
            </motion.div>

            <motion.div className="flex flex-col items-center gap-3 text-center cursor-pointer group" whileHover={{
            scale: 1.1,
            y: -2
          }} whileTap={{
            scale: 0.95
          }} transition={{
            type: "spring",
            stiffness: 400,
            damping: 10
          }}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center backdrop-blur-sm border border-primary/20 group-hover:border-primary/40 transition-all duration-300">
                <Coins className="h-7 w-7 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <span className="text-xs text-muted-foreground font-medium group-hover:text-white transition-colors duration-300">Treasury</span>
            </motion.div>

            <motion.div className="flex flex-col items-center gap-3 text-center cursor-pointer group" whileHover={{
            scale: 1.1,
            y: -2
          }} whileTap={{
            scale: 0.95
          }} transition={{
            type: "spring",
            stiffness: 400,
            damping: 10
          }}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/40 flex items-center justify-center backdrop-blur-sm border border-accent/20 group-hover:border-accent/40 transition-all duration-300">
                <Users className="h-7 w-7 text-accent group-hover:text-white transition-colors duration-300" />
              </div>
              <span className="text-xs text-muted-foreground font-medium group-hover:text-white transition-colors duration-300">Studio</span>
            </motion.div>
          </motion.div>

          {/* Legal Text */}
          <motion.div className="text-center mt-8 pt-6" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 1.6,
          duration: 0.5
        }}>
            <p className="text-xs text-muted-foreground/80 leading-relaxed">
              By signing in, you agree to our{' '}
              <span className="text-primary hover:text-accent cursor-pointer transition-colors duration-200 hover:underline">Terms of Service</span>
              {' '}and{' '}
              <span className="text-primary hover:text-accent cursor-pointer transition-colors duration-200 hover:underline">Privacy Policy</span>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>;
}
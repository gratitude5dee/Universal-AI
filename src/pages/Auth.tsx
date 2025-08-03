import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, BarChart3, Coins, Users } from 'lucide-react';
import Ambient from '@/components/ui/ambient';
import { useAuth } from '@crossmint/client-sdk-react-ui';

const AuthPage = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      if (login) {
        await login();
      } else {
        // Fallback if Crossmint is not available
        navigate('/home');
      }
    } catch (error) {
      console.error('Login failed:', error);
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
              WZRD Studio
            </h1>
            <p className="text-muted-foreground text-lg">
              Sign in to access your creative workspace
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleLogin}
              className="w-full bg-accent text-white hover:bg-accent/90 h-12 text-base font-medium"
            >
              Sign in with Crossmint
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              or continue with
            </div>

            <Button
              onClick={handleGuestAccess}
              variant="outline"
              className="w-full h-12 text-base font-medium bg-background/50 border-border hover:bg-background/70"
            >
              Enter as Guest
            </Button>
          </div>

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
};

export default AuthPage;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const Greeting = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");
  const [timePhrase, setTimePhrase] = useState("");
  
  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      
      if (hour >= 5 && hour < 12) {
        setGreeting("Good morning");
      } else if (hour >= 12 && hour < 17) {
        setGreeting("Good afternoon");
      } else if (hour >= 17 && hour < 21) {
        setGreeting("Good evening");
      } else {
        setGreeting("Good night");
      }
    };
    
    const getTimePhrase = () => {
      const phrases = [
        "Your creative energy is peaking",
        "Ready for another inspired day",
        "Time to bring your ideas to life",
        "Your gallery is growing beautifully"
      ];
      
      setTimePhrase(phrases[Math.floor(Math.random() * phrases.length)]);
    };
    
    getGreeting();
    getTimePhrase();
    
    const intervalId = setInterval(getGreeting, 60000); // Update greeting every minute
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Get user's name from profile or email
  const getUserName = () => {
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return "Artist";
  };
  return (
    <div>
      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-xl md:text-2xl font-medium text-balance mb-1"
      >
        {greeting}, <span className="text-studio-accent">{getUserName()}</span>
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-sm text-muted-foreground"
      >
        {timePhrase}
      </motion.p>
    </div>
  );
};

export default Greeting;

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Link2, 
  Zap, 
  Sparkles, 
  Palette, 
  BookOpen, 
  Brain, 
  Headphones, 
  ExternalLink,
  Database,
  Cpu,
  Shield,
  BookOpenCheck,
  Workflow,
  CreditCard,
  Infinity,
  Code,
  Mail,
  ArrowRight
} from "lucide-react";
import CloudShader from "@/components/ui/shaders/CloudShader";
import Ambient from "@/components/ui/ambient";
import CinematicIntro from "@/components/ui/animations/CinematicIntro";
import { LucideCrop as LucideProps } from "lucide-react";

// Type definition for the FeatureCard component props
type FeatureCardProps = { 
  icon: React.ComponentType<LucideProps>; // Using ComponentType to handle Lucide icons
  title: string;
  description: string;
  colorClass?: string;
};

// Type definition for the ShowcaseItem component props
type ShowcaseItemProps = {
  title: string;
  image: string;
  tag: string;
};

// Type definition for the Partner component props
type PartnerProps = {
  name: string;
  logo: string;
};

const Landing = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const controls = useAnimation();
  const [isLoading, setIsLoading] = useState(true);
  const [typedText, setTypedText] = useState("");
  const [showIntro, setShowIntro] = useState(true);
  const fullText = "Cultivate your Creator";
  const [email, setEmail] = useState("");

  // Handle intro completion
  const handleIntroComplete = () => {
    setShowIntro(false);
    // Start the normal loading animation process after intro finishes
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Shorter loading time after intro
    return () => clearTimeout(timer);
  };

  // ASCII animation effect - only if not showing intro
  useEffect(() => {
    if (!showIntro) {
      // Simulate loading screen with ASCII animation
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  // Typing effect implementation
  useEffect(() => {
    if (!isLoading && typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.substring(0, typedText.length + 1));
      }, 100); // Adjust typing speed here

      return () => clearTimeout(timeout);
    }
  }, [typedText, isLoading, fullText]);

  // Handle mouse movement for the entire container (subtle effect)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from center (normalized from -1 to 1)
      const moveX = (e.clientX - centerX) / (rect.width / 2);
      const moveY = (e.clientY - centerY) / (rect.height / 2);

      // Apply subtle movement
      x.set(moveX * 5);
      y.set(moveY * 5);
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Run entrance animation
    controls.start({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [x, y, controls]);

  // Card tilt effect values
  const rotateX = useTransform(y, [-5, 5], [5, -5]);
  const rotateY = useTransform(x, [-5, 5], [-5, 5]);

  // Partners data
  const partners = [
    { name: "Partner 1", logo: "https://placehold.co/200x80/9b87f5/FFFFFF?text=Partner+1" },
    { name: "Partner 2", logo: "https://placehold.co/200x80/9b87f5/FFFFFF?text=Partner+2" },
    { name: "Partner 3", logo: "https://placehold.co/200x80/9b87f5/FFFFFF?text=Partner+3" },
    { name: "Partner 4", logo: "https://placehold.co/200x80/9b87f5/FFFFFF?text=Partner+4" },
    { name: "Partner 5", logo: "https://placehold.co/200x80/9b87f5/FFFFFF?text=Partner+5" },
    { name: "Partner 6", logo: "https://placehold.co/200x80/9b87f5/FFFFFF?text=Partner+6" },
  ];

  // ASCII Loading Screen Component
  const AsciiLoadingScreen = () => {
    const asciiFrames = [`
                                                                                                                                                          
                                                                                                                                                          
                                                                                                                                                          
                                                                       @@@@@@@@@@@@                                                                       
                                                             @@@@@@@%%@%@@@@@#===*@@@@@@@@@@@                                                             
                                                        @@@@@@@@@@@@@@@==-+%@@@@*==+@@@@@@@@+=+%@@                                                        
                                                   @@@@@@@@@@@@@@@%-::--=+#@@@+++==-==*@@@+=-+@##*##@@@                                                   
                                                %%@@@@@@@@@@@@@%%##*++=-=+#%%%@@@@@@#*#*+=+==-=-=-====#@@@                                                
                                             @**#%@@@@@@@##*#*##*#*#*##*+#%####***+==++=-:-:---=========*##@@                                             
                                          @#*###*#@@@@@%#######*#*+++**#*#****++**+=-:-==-:::::=#@#=---:+==*#%%@                                          
                                        @@%#++##%@@@@@@%%##*#*#**=+*++===*++*+++=-*%%#*-::--:-+@@%-:::::----=**#%@                                        
                                      @@#=-=#@@@@%#%%#%%***+*****+*+++++=+++====-+=--::.::::=@@#-:::::::::----=++**@                                      
                                    #+=::-+%@@@@@@@%%+###*#*##****++*++*#+=+-::::::-::::=**%@@#::::::::::::::=+==+**%@                                    
                                   @-::-+%@@@@@@@@@@%#%%****#%#+**+*+++**=-:-:::::::.::-::-:::::::-*:::::.::::-*****+*@                                   
                                 #+:.:-%@@@@@@@@@@@@@%**+***#*++*+++++==-=-:::.::.:::::::::::::::--::.::::.::-+=+*#*+--*@                                 
                               @=:::-*@#=+@@@@@@@@@@%*++**+****++++=+=+=*#::::::::::::::.:::::.-#*:.::-=-::.:::::-+*+*%%=+#                               
                              =--*@@=:.::+#%%%%%%%#*+*****#*****++=++#@#-:::::.::::-:.::-::::::-*-::.:=@+::::.:-::-*@@@@@#*%                              
                             @-=%#-:-:::==+*##*%@@*#%*+++***=+===++==-=-::::.:::--::::::*-:--:-.:-.:::-*%+::::-=+=-*@@@@@@@@@                             
                            @-:...:.:.==::*+###%%%##*+--*@++@@#*%+*+--+=-::::::::::::::::=:-::--:-:::::::----:::-:-*@@@@@@@@@@                            
                           %::.......=@*::-*%@%###+**--*@@@*@@@+=-----#*:::::-%*::::::::::-::::::::::::::::::=*#=:-*@@@@@@@@@@@                           
                          *::::..:.:::%#:::+#@#=+*#*+=#@@@*##*==-+*###+=:-::-=*=:::::::::::::-=-:::::.:.:::::::*=:=@@@@@@@@@@@@@                          
                         %-.+=%-....-*--:.:::=++++*@@@@@@*#@@%=-=-::::-%%#+--+#=-::::::.::.::::::::.:::::::.::::-:#@@@@@@@@@@@@@@                         
                        ==::::.:.:.::::--:.:--+*#@@@@@@@%#@@%#+====:::=+---=+=-::==+=:--:::::::::.:::::==::::.:::==@@@@@@%@@@@@@@@                        
                        =-::......:.:::::-=%@@@@@@@@@@@*+=+=%@@@=-=:::-=:::::::-=--:::----+-::::::::::::::::::.:::=@@@@@@@@@@@@@@@                        
                        -: ...::.:.:::::+@@@@@@@@@@@@%:--+#@%**++-:::::.:::--+##+::::::::--+=+#@%+-:::::.:.:.::.:@@@@@@@@@@@@@@@@@@                       
                       *  ..:..::.::::--+@@@@@%%@@@@#*=-*%@#@%%@%%@@%=-+#@@@@@@%%#+=:::::::=#@@@%%@%-::::::.:.-+==*%%@@@@@@@@@@@@%@@                      
                #@@   *-::-=-:*%@@#-=%@@@@+::-==*@@@@*.:#@@@@@@@@@@@@+=+%@@@@@@@@@@@@**+==*@@@@@@@@@@@=.:.:.::*@@+:::#%=-*@@@%%@@@%@                      
     @ @@%%%#=*@@*==# #:@@@@+.+@@@%-:=%@@@@=-=+*@@@@%:.:#@@@%*+*+*+%@= =%@@@#++++#@@@@%%##@@@@%++*#@@#=:.:.::=@@@@=...::-#@@@+*%%#**@    @%+=*%#@         
%%%@*-:-*@@%*:=@@@#-:=+.%@@@=.=@@@@:::=@@@@#-++%@@@%=.:-#@@@@=.... .--%+%@@@@.   -*@@@@@##@@@@=..::-=#-::.:.=@@@@@%- .::-*@@@+***+==#   +::-+%@@+=---*%@##
+@@@+:..+@@@*:-@@@@%+::.%@@@=.+@@@%-:.-+@@@@*-*@@@@+: :-#@@@@**#*+=::-#+%@@@@+#++=@@@@@%*+@@@@@#=:.::-:.:.::%@@@@@@*: .:-#@@@+**+==-+  @::-=*@@@-:::=*@@@+
+@@@*:::+@@@+:=@@@@@@*:.%@@@=.+@@@%:::.:*@@@@%@@@@*:.:-+#@@@@@@@@%-.:-++%@@@@@@@@@@@@@*#+:*#@@@@@@@@#@=:.::*@@@%*@@@=.::-#@@@==++-+-=@ -::-+@@@@#::--*@@@=
+@@@+-.:+@@@+.-@@*@@@@@=@@@@=.+@@@%::.. -*@@@@@@@#-:=%@@#@@@@%%%@%+-=#@+@@@@@@@@@@@%+=*@*::-+=+@@@@@@@*-.:+@@@@+%@@@@::--#@@@=::=-=-=#=::-=#@@@@@=-:-+@@@+
+@@@+:.:*@@@=.=@@#-*@@@@@@@@-.+@@@%::..  -%@@@@@%=:-#*@%%@@@@+:::--=*#%+@@@@%==%@@@+:+@@**=::::--=#@@@@+:=%@@@%*#@@@@#:--#@@@=::=----*:.:-*@@@%#@*-::+@@@=
+@@@+:..*@@%+:=@@@*:-%@@@@@@-.+@@@%:::...:=@@@@@+:.:--+##@@@@+..:::-**++%@@@%:-+%@@@##%%+%@@%+--:=%@@@@*=%@@@@@@@@@@@@+--#@@@=:.:----=.:-+%@@@=%@@=.:=@@@=
+@@@+:.:*@@@=.=@@@*: .+@@@@%=.+@@@#::.:   .+@@@#::-==+++#@@@@@@@@@@@@+++@@@@@+::+%@@@%@@+#@@@@@@@@@@@@%+#@@@@*****#@@@%--#@@@=-::-+----==*@@@%=*@@*:.=@@@+
=@@@*-:.*@@@=.=@@@#:.  :%@@%-.+@@@%::.     :#@#-:....::-%@@@@@@@@@@@@+=+@@@@%++:-*@@@@%#=###@@@@@@@@@*=*@@@@*:.  :=@@@@*-#@@@@@@@@@@+*@@%#@@@@@@@@@- -@@@=
+@@@@%*#@@@%: =@@@#:.    =@%- +@@%#:::      -++:.     .-+=+=++=+===++==+==++*+*=-====+++:+---=++++==--=*+++*+.   .-*###%+#@@%@@@@@@+=#@@@#@@=-==+@@+.-@@@=
*+@@@@@@@@*-  -*#@#-.     :*-:+=-==::.         .:.        .  :=-.-..::-::.::-=+=-:-:--=====::...:::-::...:..:   ::::::-:-=-=====-=== :=++##+.  .=%@@--@@@=
 +===+=-:-:...---::....          ..                         .====::        .:-:::   ..:-::..   ....   .:::-::                           .:--   .=-:-==@%#=
   @@*+:::::::-+@#=@@:           ::               :.        : ::.                                         ....                   .::-@@@@+.         ..::--
           @@        %             :.                                            ...                                               :-        @@@@@@       
                      :                            ..   .          .:.           .:-::::::::::.:.::.:::::..                       .:*                     
                      +                           :::.::.. . .....:::==-:....    :-====-==-=-=--=---===--::.                     .:-                      
                       :                        .:. .::::. ..::::-::-=+**=-::::.:.--=+++*+**+*++++*++*++=--..                 .:.:-#                      
                       #.                    ..:::.::-:-:-::::-----:::-==**+---:-:::===-=*#############*==-:.......  .:  .:  .::::*                       
                        -               ....:.::.::-----:--------:::::::-=+#*+==---:--::-*##%%@%@%%%%#*+==::.:.::..:::.......:--:=@                       
                        =:           ....:.::::::=--=--------:::.:..:.:::-=+#@*+---------=*#%@@@@@@%%+=++-:::.:.:.:.:.:::.:.:-:--=                        
                         =:         .....::....:::.:::::--=-:::.:.:.:.:.::::::::-=****==------==*%@@@@@@@#++==:::.:.:.:=+:.:.-::..::--=                         
                          =..        ..:.:.:.::.:::.:-.:--:.:.:.:.:..:.:::-=+=**=---=====+#@@@@@@@*=--::::.:.::-%=.:::---:.:---+                          
                           +:       ..:..:::----:---:--=----:.:.:.:.:..:.:::-=+=+++=-==-====+*%@@@@@#=-:::.:.::.:=-:.::----:::::-*                           
                            #:       .........::----=-=---:.:.:.:.:..:.:::-=**=*+++==+=+=*@@@@@%=:::.::.:::--:.::--------:--#                            
                             @-:      ..:.::.:...::::-----::.:.:.:.:.:::::::=**=*+++==+==+=++@@@@#=:::::.:::::.:.:--------::-=@                             
                              +-:.     ...:::.:::.:...::.:::.:.:.:.:.:.:::=*#+**=++**+=+-=+@%+--:::.:.--:::.:.:.::-------:--=+                              
                                +:::.    ::-*=-=-:..:.......:..:.:.::--::-+#******##*==+#+===-:::.::-+:::.::.::--------:-+#                               
                                 +=: :.  .::+*:::::.:.:..::.::::.-*@%=-#*@@@%####**+=====+--::::.::-=::.::.:.:.:.:.------::=%                                 
                                    *-:--...-#@#::... ..:::.:**+-:=@#*@%@@@@@*#**++=*+*+=::::-:-::::.:.:.:.:.:.:.::-------@                                   
                                     %*#+:.   .-@#-. ....:.:-::-*%%#=*@%#%%#+###**+*==-::::.:.-+:.:.:::.:.:--:.:...:=#                                    
                                       @##+.  ...-*=:..:...:.::::::::::=#*%***###=-::::.::.:.:::.::-::.:.:.:.....:=@                                      
                                         @%*-:: ::. =*+-:-:--:::::::::.::**+#%%*=-:::.:-++:::::::::.:.:.:.:...::*@                                        
                                           @**-:.--:.:-*%#+=-::-:::.:::-=+==##*+-:.:.::--*--:::::::::::::::.:-+#                                          
                                              #=+==--::::+#@@*=::..:::.:-+##*#=-::.:-=@@@+---:--===+****=--=@                                             
                                                ##+-..-==-=++#@@@%+-..:.:-+**=-::--:==*%%%+::.-=+###*++***                                                
                                                    #==++*####%%@*@@@%###===+====+#@%%+-=:+*#####++*@%@                                                   
                                                        #%@@%#%%%%@%@@@@@@@@@@@@@%++**##*=:..-+%@%%                                                       
                                                               @%++++++**#*##***+==::::-+#@@                                                              
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
      `];
    const [frameIndex, setFrameIndex] = useState(0);
    useEffect(() => {
      const interval = setInterval(() => {
        setFrameIndex(prevIndex => (prevIndex + 1) % asciiFrames.length);
      }, 300);
      return () => clearInterval(interval);
    }, []);
    return (
      <div className="fixed inset-0 bg-[#120825] z-50 flex items-center justify-center text-white">
        <div className="relative">
          <pre className="text-xs sm:text-sm md:text-base text-cyan-400 font-mono">
            {asciiFrames[frameIndex]}
          </pre>
          <div className="mt-8 text-center">
            <div className="inline-block h-2 w-2 rounded-full bg-orange-500 mr-1 animate-ping"></div>
            <div className="inline-block h-2 w-2 rounded-full bg-orange-500 mr-1 animate-ping animation-delay-200"></div>
            <div className="inline-block h-2 w-2 rounded-full bg-orange-500 animate-ping animation-delay-400"></div>
          </div>
        </div>
      </div>
    );
  };

  // ASCII data stream animation
  const AsciiStream = ({
    top,
    left,
    delay,
    duration
  }: {
    top: string;
    left: string;
    delay: number;
    duration: number;
  }) => {
    const characters = "10101010101010101010";
    const [streamChars, setStreamChars] = useState(characters);
    useEffect(() => {
      const interval = setInterval(() => {
        setStreamChars(prev => {
          const shifted = prev.substring(1) + prev.charAt(0);
          return shifted;
        });
      }, 150);
      return () => clearInterval(interval);
    }, []);
    return (
      <motion.div 
        className="fixed text-green-500/20 text-xs font-mono pointer-events-none" 
        style={{top, left}} 
        initial={{opacity: 0, y: -50}} 
        animate={{opacity: [0, 0.4, 0], y: [0, 100]}} 
        transition={{repeat: Infinity, duration, delay, ease: "linear"}}
      >
        {streamChars.split('').map((char, i) => (
          <motion.div 
            key={i} 
            animate={{opacity: [0.2, 1, 0.2]}} 
            transition={{duration: 2, repeat: Infinity, delay: i * 0.1}}
          >
            {char}
          </motion.div>
        ))}
      </motion.div>
    );
  };
  
  // Feature Card Component - Using ElementType for the icon
  const FeatureCard = ({ 
    icon: Icon,
    title, 
    description,
    colorClass = "from-teal-400 to-cyan-400"
  }: FeatureCardProps) => {
    return (
      <motion.div 
        className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] transition-all duration-300"
        whileHover={{ y: -5, scale: 1.02 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <div className={`mb-4 p-3 rounded-lg bg-gradient-to-br ${colorClass} w-12 h-12 flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </motion.div>
    );
  };

  const ShowcaseItem = ({ 
    title, 
    image, 
    tag 
  }: ShowcaseItemProps) => {
    return (
      <motion.div 
        className="relative rounded-xl overflow-hidden group"
        whileHover={{ scale: 1.03 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
        <div 
          className="h-72 bg-blue-darker/40" 
          style={{ 
            backgroundImage: `url(${image})`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className="absolute bottom-0 left-0 p-4 z-20 transition-all duration-300 w-full">
          <span className="bg-cyan-500/80 text-white text-xs px-2 py-1 rounded-full">{tag}</span>
          <h4 className="text-white font-semibold mt-2 text-lg">{title}</h4>
          <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
            <p className="text-white/80 text-sm mt-2">Explore how Universal AI empowers creators with this innovative solution.</p>
            <Button variant="ghost" size="sm" className="mt-2 text-white hover:text-cyan-300 hover:bg-white/10 p-0">
              Learn More <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Partner Logo Component
  const PartnerLogo = ({ name, logo }: PartnerProps) => {
    return (
      <motion.div
        className="flex items-center justify-center mx-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img src={logo} alt={name} className="h-12 object-contain" />
      </motion.div>
    );
  };

  // Handle waitlist signup
  const handleWaitlistSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    alert(`Thank you for joining our waitlist with email: ${email}`);
    setEmail("");
  };
  
  return (
    <div className="fixed inset-0 min-h-screen w-full overflow-hidden">
      {/* Cinematic Intro Animation */}
      {showIntro && (
        <CinematicIntro 
          onComplete={handleIntroComplete}
          commandText="install universal.ai"
          noiseColor="270, 90%, 60%"
        />
      )}
      
      {/* Background elements */}
      <Ambient showAsciiStreams={false} />
      
      {/* ASCII loading screen */}
      {!showIntro && isLoading && <AsciiLoadingScreen />}

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 h-full relative z-10 overflow-y-auto">
        {/* Header section */}
        <motion.header 
          className="flex justify-between items-center py-4 sm:py-6 max-w-7xl mx-auto" 
          initial={{opacity: 0, y: -20}} 
          animate={{opacity: 1, y: 0}} 
          transition={{duration: 0.5}}
        >
          <div className="flex items-center gap-2">
            <motion.div 
              animate={{rotate: [0, 10, 0]}} 
              transition={{duration: 2, repeat: Infinity, ease: "easeInOut"}}
            >
              <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-[#f97316]" />
            </motion.div>
            <h1 className="text-lg sm:text-xl font-bold">UniversalAI</h1>
          </div>
          
          <motion.div 
            whileHover={{scale: 1.05}} 
            whileTap={{scale: 0.95}}
          >
            <Button 
              onClick={() => navigate("/home")} 
              className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white px-3 sm:px-5 py-2 rounded-lg border border-orange-300/30 shadow-[0_0_15px_rgba(249,115,22,0.5)] transition-all hover:shadow-[0_0_25px_rgba(249,115,22,0.7)] text-xs sm:text-sm relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-500/0 via-white/20 to-orange-500/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              <Link2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Connect with Crossmint
            </Button>
          </motion.div>
        </motion.header>

        {/* Hero section */}
        <main 
          ref={containerRef} 
          className="flex flex-col lg:flex-row items-center justify-between mt-8 sm:mt-12 lg:mt-20 gap-8 sm:gap-12 max-w-7xl mx-auto"
        >
          {/* Hero content - left side */}
          <motion.div 
            className="lg:w-1/2 text-center lg:text-left" 
            initial={{opacity: 0, y: 20}} 
            animate={controls}
          >
            {/* Hero title */}
            <motion.h1 
              className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6" 
              initial={{opacity: 0, y: 20}} 
              animate={controls}
            >
              {/* Custom typing effect */}
              <span>{typedText}</span>
              <span className="inline-block w-1 h-[1em] bg-teal-400 ml-1 animate-blink"></span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300"></span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.h2 
              className="text-xl sm:text-2xl text-gray-300 mb-6 sm:mb-8" 
              initial={{opacity: 0, y: 20}} 
              animate={controls} 
              transition={{delay: 0.1}}
            >
              Make Magic Real Again 
            </motion.h2>
            
            {/* Hero box */}
            <motion.div 
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-5 mb-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)] relative overflow-hidden" 
              initial={{opacity: 0, y: 20}} 
              animate={controls} 
              transition={{delay: 0.2}}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-purple-500/10 opacity-30"></div>
              <div 
                className="absolute inset-0" 
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  opacity: 0.05,
                  mixBlendMode: 'overlay'
                }} 
              ></div>
              <p className="text-base sm:text-lg text-gray-200 max-w-xl mx-auto lg:mx-0 relative z-10">
                UNIVERSAL.AI IS FOR THE CREATOR, PERPETUAL CREATOR CRYPTO MACHINES, HYPERLIQUID CULTURE FUND
              </p>
            </motion.div>
            
            {/* CTA Button */}
            <motion.div 
              initial={{opacity: 0, y: 20}} 
              animate={controls} 
              transition={{delay: 0.3}} 
              whileHover={{scale: 1.02}} 
              whileTap={{scale: 0.98}}
            >
              <Button 
                onClick={() => navigate("/wzrd/studio")} 
                className="text-sm sm:text-base bg-transparent hover:bg-white/10 border border-white/20 backdrop-blur-sm px-6 sm:px-8 py-5 sm:py-6 h-auto rounded-lg relative overflow-hidden group" 
                variant="outline"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-teal-500/0 via-white/5 to-teal-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></span>
                <span className="relative z-10 flex items-center">
                  Explore Platform
                  <ExternalLink className="ml-2 h-4 w-4 opacity-70" />
                </span>
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Hero visual - right side */}
          <motion.div 
            className="lg:w-1/2" 
            initial={{opacity: 0, scale: 0.95}} 
            animate={{opacity: 1, scale: 1}} 
            transition={{duration: 0.6, delay: 0.2}} 
            style={{perspective: 1000}}
          >
            <div className="relative w-full max-w-lg mx-auto">
              {/* 3D tilting main card container with enhanced shadows */}
              <motion.div 
                className="relative" 
                style={{rotateX, rotateY, transformStyle: "preserve-3d"}}
              >
                {/* Glass card container with improved lighting effects */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 shadow-[0_20px_80px_-10px_rgba(45,212,191,0.3)] transform transition-all duration-200 relative overflow-hidden">
                  {/* Inner noise texture */}
                  <div 
                    className="absolute inset-0" 
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                      opacity: 0.05,
                      mixBlendMode: 'overlay'
                    }} 
                  ></div>
                  
                  {/* Enhanced lighting effect */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
                  
                  {/* Platform mockup interface with improved 3D effect */}
                  <div 
                    className="bg-[#1E1E2E]/70 backdrop-blur-md rounded-xl p-3 sm:p-4 mb-4 sm:mb-5 relative" 
                    style={{transformStyle: 'preserve-3d'}}
                  >
                    {/* Interface header */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex space-x-1.5">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-400"></div>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="text-xs text-gray-400">AI Studio</div>
                    </div>
                    
                    {/* Terminal-like content */}
                    <div className="bg-black/30 rounded p-2 sm:p-3 text-[8px] sm:text-xs font-mono text-green-300 h-32 sm:h-40 overflow-hidden">
                      <div className="opacity-80">$ initializing universal.ai</div>
                      <div className="opacity-70">$ loading creator toolkit...</div>
                      <div className="opacity-90 mt-1">$ initializing neural fabric</div>
                      <div className="opacity-90">$ connecting to decentralized nodes</div>
                      <div className="opacity-100 text-cyan-300 mt-1">[SYSTEM] Creator mode activated</div>
                      <div className="animate-pulse mt-2 text-white">Ready to create magic_<span className="inline-block w-2 h-3 bg-white/70 animate-blink ml-0.5"></span></div>
                    </div>
                  </div>
                  
                  {/* Controls mockup */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex space-x-1.5 sm:space-x-2.5">
                      <div className="h-1.5 sm:h-2 flex-1 rounded-full bg-teal-500/30"></div>
                      <div className="h-1.5 sm:h-2 flex-1 rounded-full bg-cyan-500/20"></div>
                      <div className="h-1.5 sm:h-2 flex-1 rounded-full bg-indigo-500/20"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-2 sm:h-3 w-14 sm:w-20 rounded-full bg-white/10"></div>
                      <div className="h-2.5 sm:h-3.5 w-2.5 sm:w-3.5 rounded-full bg-cyan-400/50 animate-pulse"></div>
                    </div>
                    <div className="flex space-x-1 sm:space-x-2">
                      <div className="h-3 sm:h-4 w-5 sm:w-7 rounded bg-white/10"></div>
                      <div className="h-3 sm:h-4 w-6 sm:w-8 rounded bg-white/10"></div>
                      <div className="h-3 sm:h-4 w-7 sm:w-9 rounded bg-white/10"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Floating elements for enhanced depth perception */}
              <div className="absolute top-1/4 -left-4 sm:-left-6 w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-purple-500/30 to-fuchsia-500/30 backdrop-blur-md border border-white/10 transform rotate-12 shadow-lg"></div>
              <div className="absolute top-1/3 -right-4 sm:-right-8 w-6 h-6 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-cyan-500/30 to-teal-500/30 backdrop-blur-md border border-white/10 transform -rotate-12 shadow-lg"></div>
              <div className="absolute bottom-1/4 left-1/4 w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-orange-500/30 backdrop-blur-md border border-white/10 shadow-lg"></div>
            </div>
          </motion.div>
        </main>

        {/* Partners Section */}
        <section className="max-w-7xl mx-auto py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Trusted by Leading Partners</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Join the ecosystem of innovative companies leveraging UniversalAI to transform their creative workflows
            </p>
          </motion.div>

          <div className="relative overflow-hidden py-6">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F27] via-transparent to-[#0A0F27] z-10 pointer-events-none"></div>
            
            <motion.div 
              className="flex items-center"
              animate={{ x: [0, -1000] }}
              transition={{ 
                repeat: Infinity, 
                duration: 30, 
                ease: "linear",
                repeatType: "loop" 
              }}
            >
              {[...partners, ...partners].map((partner, index) => (
                <PartnerLogo key={`${partner.name}-${index}`} name={partner.name} logo={partner.logo} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Powerful Creator Tools</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              UniversalAI provides a comprehensive suite of tools designed specifically for creators to manage, grow, and monetize their digital assets
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Shield} 
              title="IP Protection" 
              description="Secure your creative assets with blockchain-backed IP protection and rights management"
              colorClass="from-purple-400 to-indigo-500"
            />
            <FeatureCard 
              icon={Wallet} 
              title="Creator Treasury" 
              description="Manage your creative finances with integrated treasury tools and payment scheduling"
              colorClass="from-amber-400 to-orange-500"
            />
            <FeatureCard 
              icon={Database} 
              title="Asset Management" 
              description="Organize and track all your digital assets in one centralized, secure location"
              colorClass="from-emerald-400 to-teal-500"
            />
            <FeatureCard 
              icon={Bot} 
              title="AI Agents" 
              description="Deploy customizable AI agents to automate creative workflows and tasks"
              colorClass="from-blue-400 to-sky-500"
            />
            <FeatureCard 
              icon={Workflow} 
              title="Decentralized Distribution" 
              description="Distribute your content across multiple platforms with built-in analytics"
              colorClass="from-rose-400 to-pink-500"
            />
            <FeatureCard 
              icon={CreditCard} 
              title="Monetization Tools" 
              description="Unlock new revenue streams with flexible monetization options for your creations"
              colorClass="from-yellow-400 to-amber-500"
            />
          </div>
        </section>

        {/* Showcase Section */}
        <section className="max-w-7xl mx-auto py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Explore the Possibilities</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              See how creators are using UniversalAI to transform their creative processes and build sustainable businesses
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ShowcaseItem 
              title="Digital Art Marketplace" 
              image="https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=300&h=200&auto=format" 
              tag="Art"
            />
            <ShowcaseItem 
              title="Music Distribution" 
              image="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=300&h=200&auto=format" 
              tag="Music"
            />
            <ShowcaseItem 
              title="Content Creation" 
              image="https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=300&h=200&auto=format" 
              tag="Content"
            />
          </div>
        </section>

        {/* Waitlist Section */}
        <section className="max-w-7xl mx-auto py-16 sm:py-24">
          <div className="glass-card p-8 sm:p-12 rounded-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Join the Waitlist</h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Be among the first to experience the future of creator tools. Sign up for early access to UniversalAI.
              </p>
            </motion.div>

            <form onSubmit={handleWaitlistSignup} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white px-6 py-3 rounded-lg shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)]"
                >
                  Join Waitlist
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto py-12 sm:py-16 border-t border-white/10 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-[#f97316]" />
                <h3 className="text-xl font-bold">UniversalAI</h3>
              </div>
              <p className="text-white/70 mb-4">
                Cultivate your Creator. Make Magic Real Again.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white/70 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white/70 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-white/70 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-white/70 hover:text-white">Features</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white">Pricing</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white">Roadmap</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white">Documentation</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-white/70 hover:text-white">About</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white">Careers</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-white/70 hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white">Terms of Service</a></li>
                  <li><a href="#" className="text-white/70 hover:text-white">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} UniversalAI. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
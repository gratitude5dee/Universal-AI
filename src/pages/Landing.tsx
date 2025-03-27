
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
  Code
} from "lucide-react";
import CloudShader from "@/components/ui/shaders/CloudShader";
import Ambient from "@/components/ui/ambient";

const Landing = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const controls = useAnimation();
  const [isLoading, setIsLoading] = useState(true);
  const [typedText, setTypedText] = useState("");
  const fullText = "Cultivate your Creator";

  // ASCII animation effect
  useEffect(() => {
    // Simulate loading screen with ASCII animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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
=@@@*-:.*@@@=.=@@@#:.  :%@@%-.+@@@%::.     :#@#-:....::-%@@@@@@@@@@@@+=+@@@@%++:-*@@@@%#=###@@@@@@@@@*=*@@@@*:.  :=#@@@*-#@@@@@@@@@@+*@@%#@@@@@@@@@- -@@@=
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
                         =:         .....::....:::.:::::--=-:::.:.:.:.::::::::-=****==------==*%@@@@@@@#++==:::.:.:.:=+:.:.-::..::--=                         
                          =..        ..:.:.:.::.:::.:-.:--:.:.:.::.:.:.:::-=+=**=---=====+#@@@@@@@*=--::::.:.::-%=.:::---:.:---+                          
                           +:       ..:..:::----:---:--=----:.:.:.:..:.:::-=+=+++=-==-====+*%@@@@@#=-:::.:.::.:=-:.::----:::::-*                           
                            #:       .........::----=-=---:.:.:.:.:..:.:::-=**=*+++==+=+=*@@@@@%=:::.::.:::--:.::--------:--#                            
                             @-:      ..:.::.:...::::-----::.:.:.:.:.:::::::=**=*+++==+==+=++@@@@#=:::::.:::::.:.:--------::-=@                             
                              +-:.     ...:::.:::.:...::.:::.:.:.:.:.:.:::=*#+**=++**+=+-=+@%+--:::.:.--:::.:.:.::-------:--=+                              
                                +:::.    ::-*=-=-:..:.......:..:.:.::--::-+#******##*==+#+===-:::.::-+:::.::.::--------:-+#                               
                                 +=: :.  .::+*:::::.:.:..::.::::.-*@%=-#*@@@%####**+=====+--::::.::-=::.::.:.:.:.::------::=%                                 
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
  
  const FeatureCard = ({ 
    icon: Icon, 
    title, 
    description,
    colorClass = "from-teal-400 to-cyan-400"
  }: { 
    icon: React.ElementType, 
    title: string, 
    description: string,
    colorClass?: string
  }) => {
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
  }: { 
    title: string, 
    image: string, 
    tag: string 
  }) => {
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
  
  return (
    <div className="fixed inset-0 min-h-screen w-full overflow-hidden">
      {/* Background elements */}
      <Ambient showAsciiStreams={false} />
      
      {/* ASCII loading screen */}
      {isLoading && <AsciiLoadingScreen />}

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
          <motion.div 
            className="lg:w-1/2 text-center lg:text-left" 
            initial={{opacity: 0, y: 20}} 
            animate={controls}
          >
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
            
            <motion.h2 
              className="text-xl sm:text-2xl text-gray-300 mb-6 sm:mb-8" 
              initial={{opacity: 0, y: 20}} 
              animate={controls} 
              transition={{delay: 0.1}}
            >
              Make Magic Real Again 
            </motion.h2>
            
            <motion.div 
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-5 mb-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)] relative overflow-hidden" 
              initial={{opacity: 0, y: 20}} 
              animate={controls} 
              transition={{delay: 0.2}}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-purple-500/10 opacity-30" />
              <div 
                className="absolute inset-0" 
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  opacity: 0.05,
                  mixBlendMode: 'overlay'
                }} 
              />
              <p className="text-base sm:text-lg text-gray-200 max-w-xl mx-auto lg:mx-0 relative z-10">
                UNIVERSAL.AI IS FOR THE CREATOR, PERPETUAL CREATOR CRYPTO MACHINES, HYPERLIQUID CULTURE FUND
              </p>
            </motion.div>
            
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
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-teal-500/0 via-white/5 to-teal-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                <span className="relative z-10 flex items-center">
                  Explore Platform
                  <ExternalLink className="ml-2 h-4 w-4 opacity-70" />
                </span>
              </Button>
            </motion.div>
          </motion.div>
          
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
                  />
                  
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
                      <div className="text-xs sm:text-sm text-gray-400">UniversalAI Studio</div>
                    </div>
                    
                    {/* Interface content */}
                    <div className="space-y-3 sm:space-y-4">
                      <div className="h-5 sm:h-6 bg-white/5 rounded w-3/4"></div>
                      <div className="h-5 sm:h-6 bg-white/5 rounded w-1/2"></div>
                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        <div className="h-12 sm:h-16 bg-cyan-400/10 rounded flex items-center justify-center">
                          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400/70" />
                        </div>
                        <div className="h-12 sm:h-16 bg-purple-400/10 rounded flex items-center justify-center">
                          <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400/70" />
                        </div>
                        <div className="h-12 sm:h-16 bg-amber-400/10 rounded flex items-center justify-center">
                          <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400/70" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Secondary cards with data visualizations */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-[#1E1E2E]/70 backdrop-blur-md rounded-xl p-3 sm:p-4 relative">
                      <h4 className="text-xs sm:text-sm text-gray-300 mb-2">AI Agents</h4>
                      <div className="flex space-x-1 mb-3">
                        <div className="h-1 rounded-full bg-cyan-400 w-4/12"></div>
                        <div className="h-1 rounded-full bg-cyan-400/50 w-2/12"></div>
                        <div className="h-1 rounded-full bg-cyan-400/20 w-6/12"></div>
                      </div>
                      <div className="text-lg sm:text-xl font-semibold text-white">82<span className="text-xs text-cyan-400 ml-1">Active</span></div>
                    </div>
                    
                    <div className="bg-[#1E1E2E]/70 backdrop-blur-md rounded-xl p-3 sm:p-4 relative">
                      <h4 className="text-xs sm:text-sm text-gray-300 mb-2">Spells Cast</h4>
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <div className="h-4 w-1 bg-purple-500/20 rounded-t"></div>
                          <div className="h-6 w-1 bg-purple-500/40 rounded-t"></div>
                          <div className="h-8 w-1 bg-purple-500/60 rounded-t"></div>
                          <div className="h-10 w-1 bg-purple-500/80 rounded-t"></div>
                          <div className="h-12 w-1 bg-purple-500 rounded-t"></div>
                        </div>
                        <div className="text-lg sm:text-xl font-semibold text-white">124<span className="text-xs text-purple-400 ml-1">Today</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Decorative elements floating around the card */}
              <motion.div
                className="absolute -right-4 top-1/4 h-8 w-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-sm"
                animate={{ y: [0, 10, 0], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -left-4 top-1/3 h-6 w-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-sm"
                animate={{ y: [0, -10, 0], opacity: [0.5, 0.7, 0.5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              <motion.div
                className="absolute right-1/4 -bottom-2 h-5 w-5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-sm"
                animate={{ x: [0, 8, 0], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
            </div>
          </motion.div>
        </main>
        
        {/* Section 1: The Nexus */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">The Genesis Engine for Digital Creation</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              UniversalAI unifies advanced AI tools, secure asset management, and new forms of creative expression into a seamless ecosystem for the modern creator.
            </p>
          </motion.div>
          
          <div className="flex justify-center">
            <motion.div 
              className="relative w-64 h-64 sm:w-80 sm:h-80"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              {/* Center nexus */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-cyan-400/10 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-cyan-400/20 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-cyan-400/30 rounded-full" />
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-10 w-10 text-cyan-400" />
                  </div>
                </div>
              </div>
              
              {/* Orbiting elements */}
              <motion.div 
                className="absolute w-full h-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 bg-purple-400/30 rounded-full flex items-center justify-center">
                    <Brain className="h-4 w-4 text-purple-400" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                  <div className="w-8 h-8 bg-teal-400/30 rounded-full flex items-center justify-center">
                    <Code className="h-4 w-4 text-teal-400" />
                  </div>
                </div>
                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 bg-amber-400/30 rounded-full flex items-center justify-center">
                    <Palette className="h-4 w-4 text-amber-400" />
                  </div>
                </div>
                <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 bg-pink-400/30 rounded-full flex items-center justify-center">
                    <Cpu className="h-4 w-4 text-pink-400" />
                  </div>
                </div>
              </motion.div>
              
              {/* Connection lines */}
              <div className="absolute inset-0">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  <line x1="100" y1="100" x2="100" y2="0" stroke="rgba(79, 209, 197, 0.2)" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="100" y1="100" x2="100" y2="200" stroke="rgba(79, 209, 197, 0.2)" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="100" y1="100" x2="0" y2="100" stroke="rgba(79, 209, 197, 0.2)" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="100" y1="100" x2="200" y2="100" stroke="rgba(79, 209, 197, 0.2)" strokeWidth="1" strokeDasharray="5,5" />
                </svg>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Section 2: Creative Singularity */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Forge Reality in the Infinite Studio</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Craft your vision with next-generation tools powered by AI and built for creative professionals.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard 
              icon={Palette} 
              title="WZRD.tech Studio" 
              description="Build immersive digital experiences with our intuitive visual development environment." 
              colorClass="from-blue-400 to-cyan-400"
            />
            <FeatureCard 
              icon={Brain} 
              title="Generative Engines" 
              description="Create limitless content with AI-powered generation for audio, video, images, and text." 
              colorClass="from-purple-400 to-pink-400"
            />
            <FeatureCard 
              icon={Database} 
              title="Unified Asset Library" 
              description="Manage your digital DNA with a central repository for all created and imported assets." 
              colorClass="from-amber-400 to-orange-500"
            />
          </div>
        </section>
        
        {/* Section 3: Autonomous Artistry */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Collaborate with Autonomous Intelligence</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              AI agents that assist your creative process, manage workflows, and execute tasks with unprecedented efficiency.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">AI Creation Assistants</h3>
                </div>
                
                <ul className="space-y-3">
                  <motion.li 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <div className="h-2 w-2 rounded-full bg-cyan-400"></div>
                    <span className="text-gray-300">Generate and refine ideas based on your input</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <div className="h-2 w-2 rounded-full bg-cyan-400"></div>
                    <span className="text-gray-300">Co-create content with personalized AI models</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <div className="h-2 w-2 rounded-full bg-cyan-400"></div>
                    <span className="text-gray-300">Learn from your style and preferences</span>
                  </motion.li>
                </ul>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg">
                    <Workflow className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">On-Chain Agent Operations</h3>
                </div>
                
                <ul className="space-y-3">
                  <motion.li 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                    <span className="text-gray-300">Secure blockchain transactions with AI oversight</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                    <span className="text-gray-300">Autonomous digital asset management</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                    <span className="text-gray-300">Smart contract automation and monitoring</span>
                  </motion.li>
                </ul>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Section 4: Hyperliquid Assets */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">True Ownership in the Digital Age</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Secure your creations with blockchain technology that ensures verifiable ownership, transparent transactions, and new economic opportunities.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={Shield} 
              title="Verifiable IP Management" 
              description="Protect your intellectual property with blockchain-backed verification and tracking." 
              colorClass="from-teal-400 to-emerald-500"
            />
            <FeatureCard 
              icon={CreditCard} 
              title="Secure Asset Treasury" 
              description="Store and manage your digital assets in a secure, blockchain-based treasury." 
              colorClass="from-blue-400 to-indigo-500"
            />
            <FeatureCard 
              icon={Headphones} 
              title="Decentralized Distribution" 
              description="Distribute your work through decentralized channels with built-in royalty systems." 
              colorClass="from-purple-400 to-violet-500"
            />
            <FeatureCard 
              icon={BookOpenCheck} 
              title="Programmable Actions" 
              description="Create automated, on-chain workflows for your digital assets and revenue streams." 
              colorClass="from-amber-400 to-red-500"
            />
          </div>
        </section>
        
        {/* Section 5: Showcase */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Creations Without Limits</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover what creators are building with UniversalAI.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ShowcaseItem 
              title="Generative Podcast Network" 
              image="/placeholder.svg" 
              tag="Audio"
            />
            <ShowcaseItem 
              title="Interactive NFT Collection" 
              image="/placeholder.svg" 
              tag="Visual Art"
            />
            <ShowcaseItem 
              title="AI-Powered Story Universe" 
              image="/placeholder.svg" 
              tag="Narrative"
            />
          </div>
        </section>
        
        {/* Section 6: Call to Action */}
        <section className="py-16 sm:py-24 max-w-3xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Cultivate Your Creator?</h2>
            <p className="text-xl text-gray-300 mb-8">Join the next generation of digital creators and shape the future of AI-powered creativity.</p>
            
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => navigate("/wzrd/studio")} 
                className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white px-8 py-4 rounded-lg text-lg font-medium border border-orange-300/30 shadow-[0_0_25px_rgba(249,115,22,0.3)] transition-all hover:shadow-[0_0_35px_rgba(249,115,22,0.5)]"
              >
                Explore Platform
              </Button>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Landing;

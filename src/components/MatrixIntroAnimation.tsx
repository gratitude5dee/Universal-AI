import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import universalAILogo from '@/assets/universal-ai-logo.png';

interface MatrixIntroAnimationProps {
  onComplete: () => void;
}

type MatrixPhase = 'matrix-rain' | 'ascii-art-1' | 'ascii-art-2' | 'fade-to-logo' | 'logo-reveal' | 'complete';

const asciiArt1 = `                                                                                                                                                      

                                                          ~i>+                                                                                        
                                                        ___++__+++_                                                                                   
                                                      ++++__++___+++_+                                                                                
                                                      __++_______+~____                                                                               
                          $$$$@$$$$                  _________+____+__+                                                                               
                       $$$$$    $$$$$$$$              +___+___+__+____+____+                      ________+_                                          
                      $$$          $$$$$$$$            +___++_______+____+__+++                  __+__+_____~                                         
                     $$$             $$$$$$$$         ++_______+++_____+_______+~ +++i  +     i+______+__+_+                                          
                     $$               $$$$$$$$$       "++____+____++_+____+_____+_______++++_____++_____+_+                                           
                     $$$   $$$$        $$$$$$$$$      __+_+__+______i~__+___+_________+_______+_____++___++                                           
                      $$$  $$$$         $$$$$$$$$     +_____+__+__+ l!+++++___++__+_________+___+______++                                             
                       $$$$$$$$         $$$$$$$$$$  ~_+_+__+____++        ___+____+_++__+__+______+__++                                               
                                        $$$$$$$$$$  +__++____++_+         ++_+__+_______+____+_+__+++                                                 
                                         $$$$$$$$$$  +____+_______+         ~ +____+__+___+____+_+<                                                   
                                         $$$$$$$$$$   ++____+__+____       __+__++____++_++++++                                                       
                                         $$$$$$$$$B$W+___+_____+__+        +________+__+_+>                                                           
                                         $$$$$$$$$$a_______+_+____+     ++~___+___+________+_                                                         
                                         $$$$$$$$$$$Q_+__+______+__   +___+++__+__+__+__+____+                                                        
                                   $     $$$$$$$$$$$@____+__+___++   +__+___<+____+______+____+                             @@                        
                                  $$$    $$$$$$$$$$$o__+_____++__+  ________++__+_ +__++___+____+++                       $@@@                        
                                 $$$$$   $$$$$$$$$$$q_____++______+_+__+__+__++__CcxB%#?___+_____+_                     $@@@@@@@                      
                                $$$$$$$$$$$$$$$$$$$BwZ}_+______++_+____+____+  o&BBBBBB8z-__++++__+_                  $@@@@@@@@@@@                    
                             $$$$$$$$$$$$$$$$$$$$$$$$J{_____+__+   ++____+++_@BBBBBBBBBBB8hL)______+++              $@@@@@@@@@@@@@@@$                 
                          $$$$$$$$$$$$$$$$$$$$$$$$$$W*_+__+___+<     _+__+ @BBBBBBBBBB@BB#Xz1__+_______           $@@@@@@@@@@@@@@@@@@@@@@$            
                      $$$$$$$$$$$$$$$$$$$$$$$$$$$$$h+____+___++      +__+CBBB $BBB@BBBBBBBBBBMm]__++__+_~_       $@@@@ @@@@@@@@@@@@@@@@@@@             
                 $$$$$$$$$$$$$$ $$$$$$$$$$$$$$$$$$$$x_+____+_+      ~+__YBBBB   BBBB@BBBBBBBBBp/__________+     @@@@@@@   @@@@@@@@@@@@@@@$              
             $$$$$$$$$$$$$$$$$$    $$$$$$$$$$$$$$$$$@b{___+++       __?jk&BBB     @BBBBB@BBBM[_++__+__+__ $@@@@@@@@@@    $@@@@@@@@@@@@                
                 $$$$$$$$$$$$$$         $$$$$$$$$$$$$$0__+___+_+   +__j&BMBBB      $BBBBBBB@  ++____+____M@@@@@@@@@@@      $@@@@@@@@                  
                  $$$$$$$$$$$$$          $$$$$$$$oULW$?_________+[}_|q%BBBBBB         @@BBB  _++_  +++__+\@@@@@@@@@@@         $@@@$                   
                  $$$$$$$$$$$$$          $$$$$$$$$$Bh$X_+__+__+__j&_#CXQBBBBB         @BB  <<~__++___+____j@@@@@@@@@@         @@$                     
                  $$$$$$$$$$$$$          $$$$$$$$$$$$p____+______BBBBBBBB@BB  $$   $BB$     <___+____++_[M@@@@@@@@@@       @@@                       
                  $$$$$$$$$$$$$          $$$$$$$$$$$$$&__+___+__+wBBBBBBBBBBB BBBB@BB$       ++____+_____&@@@@@@@@@@@ @@@@@@@                         
                  $$$$$$$$$$$$$          $$$$$$$$$$$$$o+______+__WBBBB@BB@BBB @BBB@          ++__++__+__]@@@@@@@@@@@@ @@@@@                           
                  $$$$$$$$$$$$$          $$$$$$$$$$$$$$+__+_+___+BBBBBBBBBBBB                +_+~  ~++__+8@@@@@@@@@@@                                 
                  $$$$$$$$$$$$$          $$$$$$$$$$$$$$+_______+        ,++ ++~+~          I++ <+~++           ++   "~~++++++~                              
                                    +++       +++    ~++     +++       ++~<+~       ++++ _+ ++~        <+++ ++~       ++                              
                                    ,+++++++++++     +++      ++++++++++~ <+++++++++++<  +_  ++++++~+++++,  ~+++++++++++                              
                                       "~+~++                   -~~~~~~   -++++++++I            I~++~~"        >+~~~~~                                `;

const asciiArt2 = `                                                                                                                                      

                                              @@@@@@@@@@                                                              
                                     @@@@@#**#*%@@@+. :*@@@@@@#@@                                                     
                               @@@@@@@@@@@@@@*-::=#@%+:.:#@@@@@#::--=*#                                               
                            @@@@@@%%@@@@%=     .:*@@%@%-. .:--:..::=#:-=%@                                            
                        @+==#@@@%%#+++++++====.=++++++*###*=:-:: ... ....:++*%                                        
                      #++++%%%%**+=======--=-++=+===-=-:.  ::      .*-... .=-=+#                                      
                   @*==:-=*#####*+++=++=-::--::------::+%*-.      :%#=        -==*%                                   
                 @#=. -*#%*++*+*+==--=----=::::::-:.:. : .      :%@-            :--=#                                 
                =   :+%%%%%#*+-======+===-:--:=-::           -==@#:            ::.:-=+#                               
              -   .+###%%%%##*++=---=+------:--:.                     :          ===-:-*#                             
             :   =@+*%%%#%##%%+:--=-=-----::-: :-                   .           +:=+=:  =%                            
           .  ==:   -***#**#+---=-=-----::::=*+:                   *+    :#         -*%%#-:+                          
          -:**::   .-=*++*#+-++--=++--::::::          .      .           =#=     -: =%#@@@##=                         
        :.        : ::-+=+*+==:  -=:+*--+-:  -:              : :            .:      -##%@@%@%%                        
       =         *:  -=#*+=--=. *@@+*## : .  +:     *                          :=-  =%@@@%@@@%%                       
       :         ==   ===:-=+-:+@@*=++::.:==+-.    :-             :              - .#@@@@@@@@@%%                      
      :  .-     + :    .::-+%@@@@%=%#+:.     .+=::===:::                .::        :@@@%%%%@@@%#@                     
     :                :-+%@@@@@@%+++=-=:..                ..:                       #@##*#*#@@@##                     
                   :*@@@@@@@@@@:. :=*+-:.           :=.       ::  :--             +%@@#%@%@%%@@##@                    
    #              -#@@@%%%@%=.  :+=--==-==-. ::=+-+=-:.        =%*=:++            +#%@%%%@@#%@@*#                    
              =@   @      :+++-:+@@@+   ..*@@@= .#@@@@@@@@@%::-@@@@@@@@@@#-::.:#@@@@@@@@*       *@=   *= -*##+#@#+#                   
    @ @#*++ -@*- + = #@#= :%@#-  +@@%- :-=@@@*  .*@@*:::::-*. -@@@=::::*@@@+*+%@@@-.:-*@=      =@@@-     -%@@-+*+-=@   @+:.=+*        
+##+   =@%+  %@%=  . #@%= :%@%-  .#@@#: -#@@*:  .*@@%:       *-@@@#    :@@@**=%@@%     .-     -%@@@#     -%@@-=-::.-  :   =%@:   .+##+
-@@+   =@@+  %@@@+.  #@%= :@@#-   :%@@*:*@@#-   :*@@@%%@%-   +-@@@#-==-#@@%++:=@@@@@*-  :     #@@#@@+    -%@@::=:. - :   :*@@=   :+@@:
-@@+   =@@=  #@%@@@- #@%- :@@#-    :%@@*@@%+  :*=#@@@@@@%-   +=@@@@@@@@@@#--+. :=#@@@@@@=    *@@%=%@@-   -%@@. ... -=   .=@@@%   :+@@-
-@@=   +@@=  %@:=@@@*%@%- :@@#:     =@@@@@+  -=%+#@@#:  :- =*#=%@@*-+%@%- :#*-     .:*@@@+  =@@@=:*@@#.  -%@@      :=   :%@@+@+   +@@-
-@@=   +@@=  %@*  *@@@@#- :@@#:      *@@@#:    :-#@@@-     :---@@@* .-%@@=**+=@#+:   =@@@#.-@@@@@@@@@@*: -%@@      .   .+@@#=%#   +@@:
-@@=   +@@=  #@#.  :%@@#- :@@*:       *@%-  :.-::#@@@@@@@@@%:-=%@@*: .=%@@+##=@@@@@@@@@@%=:#@@#---==#@@- -%@@    - :  .-%@@--*@-  +@@:
-@@*:  *@@=  #@#:    +@#- -@@*:       :#+       :##%%#######::=*+**-: :+++#+--=:=%@@@@#+:.*@%@-     =@@# -%@@@@@@@%-+@@-@@%@@@@%  =@@:
-%@@%##@@+.  #@#:     .+- :===-        :                     :   .:--.     .      ...    . ..:.     --:---+--==+*%: +#*=@+   .+@= =@@:
::*@@@%=-     .-:                                   .:.           ..     ..:                                         .  .   .=** =@@:`;

export function MatrixIntroAnimation({ onComplete }: MatrixIntroAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<MatrixPhase>('matrix-rain');
  const phaseRef = useRef<MatrixPhase>('matrix-rain');
  const [showSkip, setShowSkip] = useState(false);
  const [statusText, setStatusText] = useState('◆ NEURAL NETWORK INITIALIZING ◆');
  const [loadingText, setLoadingText] = useState('INITIALIZING CORE');
  const [imageError, setImageError] = useState(false);
  const [hasError, setHasError] = useState(false);
  const phaseStartTimeRef = useRef(Date.now());
  const animationFrameRef = useRef<number>();
  const intervalRef = useRef<NodeJS.Timeout>();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleSkip = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    onComplete();
  };

  // Sync phaseRef with phase state
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Loading text sequence
  useEffect(() => {
    if (prefersReducedMotion) return;

    const messages = [
      'INITIALIZING CORE',      // 3s
      'LOADING AI MODELS',       // 4.8s
      'NEURAL NETS ACTIVE',      // 6.6s
      'CALIBRATING SYSTEMS',     // 8.4s
      'ESTABLISHING LINKS',      // 10.2s
      'SYSTEM ONLINE'            // 12s
    ];

    let currentMsg = 0;

    const startTimer = setTimeout(() => {
      const msgInterval = setInterval(() => {
        currentMsg++;
        if (currentMsg < messages.length) {
          setLoadingText(messages[currentMsg]);
        } else {
          clearInterval(msgInterval);
        }
      }, 1800);

      intervalRef.current = msgInterval;
    }, 3000);

    return () => {
      clearTimeout(startTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }

    const skipTimer = setTimeout(() => setShowSkip(true), 2000);

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleSkip();
    };
    window.addEventListener('keydown', handleEscape);

    return () => {
      clearTimeout(skipTimer);
      window.removeEventListener('keydown', handleEscape);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onComplete, prefersReducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const asciiLines1 = asciiArt1.split('\n');
    const asciiLines2 = asciiArt2.split('\n');

    const fontSize = 5;
    const charWidth = fontSize * 0.6;

    const columns = Math.floor(canvas.width / charWidth);
    const drops = new Array(columns).fill(1);
    const speeds = new Array(columns).fill(0).map(() => 0.5 + Math.random() * 1);

    const uniqueChars = [...new Set([...asciiArt1, ...asciiArt2])].filter(c => c !== '\n' && c !== ' ');

    const draw = () => {
      // Stop drawing if animation is complete
      if (phaseRef.current === 'complete') {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        return;
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;

      if (phaseRef.current === 'matrix-rain') {
        for (let i = 0; i < drops.length; i++) {
          const char = uniqueChars[Math.floor(Math.random() * uniqueChars.length)];
          const brightness = 150 + Math.random() * 105;
          ctx.fillStyle = `rgb(0, ${brightness}, 0)`;
          ctx.fillText(char, i * charWidth, drops[i] * fontSize);

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i] += speeds[i];
        }
      } else if (phaseRef.current === 'ascii-art-1') {
        const startX = Math.max(50, (canvas.width - (120 * charWidth)) / 2);
        const startY = Math.max(50, (canvas.height - (asciiLines1.length * fontSize)) / 2);

        asciiLines1.forEach((line, y) => {
          for (let x = 0; x < line.length; x++) {
            const char = line[x];
            if (char !== ' ') {
              const revealProgress = (Date.now() - phaseStartTimeRef.current) / 3000;
              const charProgress = (y / asciiLines1.length + x / line.length) / 2;

              if (charProgress < revealProgress) {
                const brightness = 180 + Math.sin(Date.now() / 150 + x + y) * 75;
                ctx.fillStyle = `rgb(0, ${brightness}, 0)`;
                ctx.fillText(char, startX + x * charWidth, startY + y * fontSize);
              }
            }
          }
        });
      } else if (phaseRef.current === 'ascii-art-2') {
        const startX = Math.max(50, (canvas.width - (120 * charWidth)) / 2);
        const startY = Math.max(50, (canvas.height - (asciiLines2.length * fontSize)) / 2);

        asciiLines2.forEach((line, y) => {
          for (let x = 0; x < line.length; x++) {
            const char = line[x];
            if (char !== ' ') {
              const revealProgress = (Date.now() - phaseStartTimeRef.current) / 3500;
              const charProgress = (y / asciiLines2.length + x / line.length) / 2;

              if (charProgress < revealProgress) {
                const brightness = 180 + Math.sin(Date.now() / 150 + x + y) * 75;
                ctx.fillStyle = `rgb(0, ${brightness}, 0)`;
                ctx.fillText(char, startX + x * charWidth, startY + y * fontSize);
              }
            }
          }
        });
      } else if (phaseRef.current === 'fade-to-logo') {
        const fadeProgress = (Date.now() - phaseStartTimeRef.current) / 1500;
        if (fadeProgress < 1) {
          ctx.globalAlpha = 1 - fadeProgress;

          const startX = Math.max(50, (canvas.width - (120 * charWidth)) / 2);
          const startY = Math.max(50, (canvas.height - (asciiLines2.length * fontSize)) / 2);

          asciiLines2.forEach((line, y) => {
            for (let x = 0; x < line.length; x++) {
              const char = line[x];
              if (char !== ' ') {
                const brightness = 180 + Math.sin(Date.now() / 150 + x + y) * 75;
                ctx.fillStyle = `rgb(0, ${brightness}, 0)`;
                ctx.fillText(char, startX + x * charWidth, startY + y * fontSize);
              }
            }
          });

          ctx.globalAlpha = 1;
        }
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    animationFrameRef.current = requestAnimationFrame(draw);

    // Simplified phase transitions (7 second total)
    const logoTimer = setTimeout(() => {
      setPhase('logo-reveal');
      phaseStartTimeRef.current = Date.now();
      setStatusText('◆ SYSTEM ONLINE ◆');
    }, 3000);

    const completeTimer = setTimeout(() => {
      setPhase('complete');
      onComplete();
    }, 7000);

    // Failsafe timeout
    const maxDurationTimer = setTimeout(() => {
      console.warn('Animation exceeded max duration, forcing completion');
      handleSkip();
    }, 10000);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(completeTimer);
      clearTimeout(maxDurationTimer);
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
    } catch (error) {
      console.error('Matrix animation error:', error);
      setHasError(true);
      onComplete();
    }
  }, [onComplete, prefersReducedMotion]);

  if (prefersReducedMotion || hasError) {
    return null;
  }

  return (
    <AnimatePresence>
      {phase !== 'complete' && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <canvas ref={canvasRef} className="absolute inset-0" />

          <div className="relative z-10 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {(phase === 'logo-reveal' || phase === 'fade-to-logo') && (
                <motion.div
                  key="logo"
                  className="flex flex-col items-center gap-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.img
                    src={universalAILogo}
                    alt="Universal.AI Logo"
                    onError={() => setImageError(true)}
                    className="max-w-[600px] w-[90vw] h-auto matrix-logo-pulse"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  {imageError && (
                    <div className="text-4xl font-bold text-green-400 text-center px-4">
                      UNIVERSAL.AI
                    </div>
                  )}

                  <div className="text-green-400 text-sm font-mono tracking-wider animate-pulse">
                    {loadingText}
                  </div>

                  <div className="text-green-500/60 text-xs font-mono mt-2">
                    The Future of Artificial Intelligence
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-green-400 text-xs font-mono tracking-wider animate-pulse">
            {statusText}
          </div>

          {showSkip && (
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 text-green-500/70 hover:text-green-400 text-xs font-mono tracking-wider transition-colors duration-200 px-3 py-1.5 border border-green-500/30 hover:border-green-400/50 rounded"
            >
              SKIP [ESC]
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useEffect, useRef, useState, useCallback } from 'react';
import Vapi from '@vapi-ai/web';
import { supabase } from '@/integrations/supabase/client';

interface VapiConfig {
  publicKey: string;
  assistantId: string;
}
 
const useVapi = () => {
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [conversation, setConversation] = useState<{ role: string, text: string }[]>([]);
  const [vapiConfig, setVapiConfig] = useState<VapiConfig | null>(null);
  const vapiRef = useRef<any>(null);

  // Fetch VAPI configuration securely from backend
  useEffect(() => {
    const fetchVapiConfig = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase.functions.invoke('get-vapi-config');
        if (error) {
          console.error('Failed to fetch VAPI config:', error);
          return;
        }
        setVapiConfig(data);
      } catch (error) {
        console.error('Error fetching VAPI config:', error);
      }
    };
    
    fetchVapiConfig();
  }, []);
 
  const initializeVapi = useCallback(() => {
    if (!vapiConfig?.publicKey || !vapiConfig?.assistantId) {
        console.warn("Vapi configuration not available.");
        return;
    }
    if (!vapiRef.current) {
      const vapiInstance = new Vapi(vapiConfig.publicKey);
      vapiRef.current = vapiInstance;
 
      vapiInstance.on('call-start', () => {
        setIsSessionActive(true);
      });
 
      vapiInstance.on('call-end', () => {
        setIsSessionActive(false);
        setConversation([]);
      });
 
      vapiInstance.on('volume-level', (volume: number) => {
        setVolumeLevel(volume);
      });
 
      vapiInstance.on('message', (message: any) => {
        if (message.type === 'transcript' && message.transcriptType === 'final') {
          setConversation((prev) => [
            ...prev,
            { role: message.role, text: message.transcript },
          ]);
        }
      });
 
      vapiInstance.on('error', (e: Error) => {
        console.error('Vapi error:', e);
        setIsSessionActive(false);
      });
    }
  }, [vapiConfig]);
 
  useEffect(() => {
    initializeVapi();
 
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current = null;
      }
    };
  }, [initializeVapi]);
 
  const toggleCall = async () => {
    if (!vapiRef.current) {
        console.error("Vapi not initialized. Check your API keys.");
        return;
    }
    try {
      if (isSessionActive) {
        await vapiRef.current.stop();
      } else {
        await vapiRef.current.start(vapiConfig?.assistantId);
      }
    } catch (err) {
      console.error('Error toggling Vapi session:', err);
    }
  };
 
  return { volumeLevel, isSessionActive, conversation, toggleCall };
};
 
export default useVapi;
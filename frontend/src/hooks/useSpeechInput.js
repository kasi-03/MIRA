import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * useSpeechInput
 * State-driven voice interaction hook with Web Speech API integration,
 * permission handling, error states, and text fallback.
 */
export function useSpeechInput({ onTranscript, onError } = {}) {
  const [voiceState, setVoiceState] = useState('ready'); // 'ready' | 'requesting_permission' | 'listening' | 'transcribing' | 'reviewing' | 'error'
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setVoiceState('listening');
          setErrorMessage(null);
        };

        recognition.onresult = (event) => {
          setVoiceState('transcribing');
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
          if (onTranscript) {
            onTranscript(currentTranscript);
          }
        };

        recognition.onerror = (event) => {
          setVoiceState('error');
          let errText = 'Speech recognition error';
          if (event.error === 'not-allowed') {
            errText = 'Microphone permission denied. You can continue by typing your request.';
          } else if (event.error === 'no-speech') {
            errText = 'No speech detected. Please try speaking again or type your prompt.';
          } else if (event.error === 'network') {
            errText = 'Network connection required for voice transcription.';
          }
          setErrorMessage(errText);
          if (onError) onError(errText);
        };

        recognition.onend = () => {
          setVoiceState('ready');
        };

        recognitionRef.current = recognition;
      } catch (e) {
        setIsSupported(false);
        setErrorMessage('Speech recognition initialization failed on this device.');
      }
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [onTranscript, onError]);

  const startListening = useCallback(() => {
    setErrorMessage(null);
    if (!isSupported) {
      setVoiceState('error');
      setErrorMessage('Voice input is not supported in this browser. Please use text input.');
      return;
    }

    if (recognitionRef.current) {
      try {
        setVoiceState('requesting_permission');
        recognitionRef.current.start();
      } catch (e) {
        // Recognition already started or error
        try {
          recognitionRef.current.stop();
        } catch (stopErr) {}
      }
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setVoiceState('ready');
  }, []);

  const resetVoiceState = useCallback(() => {
    setVoiceState('ready');
    setTranscript('');
    setErrorMessage(null);
  }, []);

  return {
    voiceState,
    transcript,
    isSupported,
    errorMessage,
    startListening,
    stopListening,
    resetVoiceState,
  };
}

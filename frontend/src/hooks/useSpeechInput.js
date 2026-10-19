import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useSpeechInput hook provides real Web Speech API microphone integration
 * with live streaming transcription and graceful error handling.
 */
export function useSpeechInput({ onTranscript, onError } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [permissionState, setPermissionState] = useState('prompt'); // 'prompt', 'granted', 'denied'
  const recognitionRef = useRef(null);

  const isSupported = typeof window !== 'undefined' && 
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  // Clean up recognition instance on component unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback((customOnTranscript) => {
    setError(null);
    setTranscript('');

    if (!isSupported) {
      const msg = 'Web Speech API is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.';
      setError(msg);
      if (onError) onError(msg);
      return false;
    }

    try {
      // Abort any existing instance
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = navigator.language || 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setPermissionState('granted');
      };

      recognition.onresult = (event) => {
        let liveTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          liveTranscript += event.results[i][0].transcript;
        }
        setTranscript(liveTranscript);
        if (customOnTranscript) {
          customOnTranscript(liveTranscript);
        } else if (onTranscript) {
          onTranscript(liveTranscript);
        }
      };

      recognition.onerror = (event) => {
        let msg = `Microphone error: ${event.error}`;
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          msg = 'Microphone permission denied. Please allow microphone access in your browser address bar.';
          setPermissionState('denied');
        } else if (event.error === 'no-speech') {
          msg = 'No speech was detected. Please check your microphone input volume and try again.';
        } else if (event.error === 'audio-capture') {
          msg = 'No microphone device was detected on your computer.';
        } else if (event.error === 'network') {
          msg = 'Network communication issue with speech recognition service.';
        }
        setError(msg);
        setIsListening(false);
        if (onError) onError(msg);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      return true;
    } catch (err) {
      const msg = err.message || 'Could not start microphone.';
      setError(msg);
      setIsListening(false);
      if (onError) onError(msg);
      return false;
    }
  }, [isSupported, onTranscript, onError]);

  const toggleListening = useCallback((customOnTranscript) => {
    if (isListening) {
      stopListening();
    } else {
      return startListening(customOnTranscript);
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    error,
    isSupported,
    permissionState,
    startListening,
    stopListening,
    toggleListening
  };
}

export default useSpeechInput;

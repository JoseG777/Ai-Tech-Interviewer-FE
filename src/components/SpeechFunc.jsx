import React, { useState, useEffect, useCallback } from 'react';

function SpeechRecognitionComponent({ language = 'en-US', onMessageReceived }) {
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('Speech Recognition API is not supported in this browser.');
      return;
    }
    
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = language;
    recognitionInstance.interimResults = false;
    recognitionInstance.maxAlternatives = 1;

    recognitionInstance.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      handleSpeechEnd(speechResult);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    // Cleanup on unmount
    return () => {
      recognitionInstance.abort();
      speechSynthesis.cancel();
    };
  }, [language]);

  // Toggle listening state
  const toggleListening = useCallback(() => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
        setIsListening(false);
      } else {
        recognition.start();
        setIsListening(true);
      }
    }
  }, [recognition, isListening]);

  // Handle speech recognition completion
  const handleSpeechEnd = useCallback((speechResult) => {
    speechSynthesis.cancel();  // Ensure any ongoing speech synthesis is canceled

    fetch(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: speechResult,
        problem: sessionStorage.getItem('problem'),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const aiResponse = data.ai_response;
        onMessageReceived(speechResult, aiResponse);
        speakAIResponse(aiResponse);
      })
      .catch((error) => {
        console.error('Error processing speech:', error);
      });
  }, [onMessageReceived]);

  // Handle AI response speaking
  const speakAIResponse = useCallback((aiResponse) => {
    if (!aiResponse) return;

    const utterance = new SpeechSynthesisUtterance(aiResponse);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
    };

    speechSynthesis.speak(utterance);
  }, []);

  // Interrupt AI response
  const interruptAI = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return (
    <div className="speech-recognition-controls" style={{ display: 'flex', gap: '10px' }}>
      <button onClick={toggleListening} disabled={isSpeaking}>
        {isListening ? 'Stop Speaking' : 'Start Speaking'}
      </button>
      {isSpeaking && (
        <button onClick={interruptAI}>
          Interrupt AI
        </button>
      )}
    </div>
  );
}

export default SpeechRecognitionComponent;

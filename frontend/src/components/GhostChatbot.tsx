import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Volume, VolumeX, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  text: string;
  sender: "user" | "ghost";
  isTyping?: boolean;
};

// Sound effects
const playSound = (sound: "whoosh" | "moan" | "possess") => {
  const sounds = {
    whoosh: "http://localhost:8080/sounds/whoosh.mp3",
    moan: "http://localhost:8080/sounds/moan.mp",
    possess: "http://localhost:8080/sounds/whoosh.mp",
  };
  const audio = new Audio(sounds[sound]);
  audio.volume = 0.3;
  audio.play();
};

// Seasonal responses
const getSeasonalResponse = () => {
  const now = new Date();
  const isHalloween = now.getMonth() === 9 && now.getDate() === 31; // October 31

  if (isHalloween) {
    const halloweenResponses = [
      "Happy Halloween! The veil between worlds is thinnest tonight...",
      "All Hallow's Eve special: 13% off all cursed items!",
      "The spirits are especially active tonight... ask away!",
      "Boo! ...Oh pardon me, just getting into the spirit of the season!",
    ];
    return halloweenResponses[
      Math.floor(Math.random() * halloweenResponses.length)
    ];
  }
  return null;
};

export const GhostChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Greetings, mortal... or should I say, fellow undead! How may I assist with your dining experience today?",
      sender: "ghost",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPossessed, setIsPossessed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Ghost typing effect
  const ghostTypingEffect = (text: string, id: string) => {
    let i = 0;
    const speed = 30 + Math.random() * 70; // Random typing speed

    typingIntervalRef.current = setInterval(() => {
      if (i < text.length) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === id
              ? { ...msg, text: text.substring(0, i + 1), isTyping: true }
              : msg
          )
        );
        i++;
      } else {
        clearInterval(typingIntervalRef.current);
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, isTyping: false } : msg))
        );
        if (!isMuted) speak(text);
      }
    }, speed);
  };

  const speak = (text: string) => {
    if (isMuted || !("speechSynthesis" in window)) return;

    // Create creepy voice settings
    const utterance = new SpeechSynthesisUtterance(text);

    // 1. Pitch Modulation (more variation)
    const basePitch = 0.5; // Much lower pitch (0-2 scale)
    const pitchFluctuation = Math.random() * 0.3; // Random fluctuations
    utterance.pitch = basePitch + pitchFluctuation;

    // 2. Slower, uneven rate
    utterance.rate = 0.7 + Math.random() * 0.2; // 0.7-0.9 speed

    // 3. Add whisper effect via volume modulation
    utterance.volume = 0.8; // Slightly quieter
    const volumeVariation = setInterval(() => {
      utterance.volume = 0.7 + Math.random() * 0.3; // Pulsing volume
    }, 300);

    // 4. Find the creepiest available voice
    const voices = speechSynthesis.getVoices();
    const creepyVoices = voices.filter(
      (v) =>
        v.name.includes("Ghost") ||
        v.name.includes("Spooky") ||
        v.lang.includes("en-GB") // British voices often sound creepier
    );

    if (creepyVoices.length > 0) {
      utterance.voice =
        creepyVoices[Math.floor(Math.random() * creepyVoices.length)];
    } else {
      // Fallback to lowest-pitched available voice
      utterance.voice = voices.reduce((lowest, current) =>
        current.voiceURI.includes("low") ||
        (current.name && current.name.toLowerCase().includes("male"))
          ? current
          : lowest
      );
    }

    // Clean up volume modulation
    utterance.onend = () => clearInterval(volumeVariation);

    speechSynthesis.speak(utterance);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Check for seasonal response first
    const seasonalResponse = getSeasonalResponse();
    if (seasonalResponse && Math.random() > 0.7) {
      // 30% chance to use seasonal response
      const ghostMessage: Message = {
        id: Date.now().toString() + "-seasonal",
        text: seasonalResponse,
        sender: "ghost",
        isTyping: true,
      };
      setMessages((prev) => [...prev, ghostMessage]);
      ghostTypingEffect(seasonalResponse, ghostMessage.id);
      return;
    }

    // Simulate ghost thinking
    setTimeout(() => {
      let responses = [
        "I'm afraid I don't have that information in my spectral memory...",
      ];

      // Enhanced keyword responses with variations
      if (/(menu|food|eat|drink|order)/i.test(inputMessage)) {
        responses = [
          "Our menu offers delicacies from beyond the grave...",
          "The cursed kitchen prepares meals that will haunt your taste buds!",
          "Tonight's special: Ectoplasm Elixir with Shadow Garnish",
        ];
      } else if (/(brain|brains|cerebral|grey matter)/i.test(inputMessage)) {
        responses = [
          "Our Brain Tasting Chamber is down the haunted hallway...",
          "Zombies rate our cerebral selections 5 out of 5 rotting stars!",
          "Try the Frontal Lobe Flambé - it's to die for!",
        ];
      } else if (/(mummy|egypt|sarcophagus)/i.test(inputMessage)) {
        responses = [
          "The Sarcophagus Lounge serves ancient Egyptian spirits...",
          "Mummy patrons receive 10% off all bandaged beverages!",
          "Our hieroglyphic menu requires a moonlight decoder...",
        ];
      } else if (/(hello|hi|greetings)/i.test(inputMessage)) {
        responses = [
          "Welcome, spectral friend! The dead are listening...",
          "Boo! Oh... sorry, just my way of saying hello!",
          "The spirits sense your presence... how may I assist?",
        ];
      }

      const ghostMessage: Message = {
        id: Date.now().toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: "ghost",
        isTyping: true,
      };

      setMessages((prev) => [...prev, ghostMessage]);
      ghostTypingEffect(ghostMessage.text, ghostMessage.id);
    }, 1000 + Math.random() * 2000); // Random delay for realism
  };

  const toggleListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition not supported in your browser");
      return;
    }

    if (!isListening) {
      playSound("moan");
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInputMessage(transcript);
      };
      recognition.onerror = (e: any) => {
        console.error("Voice recognition error", e.error);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } else {
      setIsListening(false);
    }
  };

  const togglePossession = () => {
    if (!isPossessed) {
      playSound("possess");
      setIsPossessed(true);
      const possessedText = "The spirits compel me to type... ";
      setInputMessage(possessedText); // Set the full text immediately
      // Remove the interval typing for possession since we want instant effect
      setTimeout(() => setIsPossessed(false), 3000);
    }
  };

  const toggleChat = () => {
    if (!isOpen) playSound("whoosh");
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-undead-purple text-white flex items-center justify-center shadow-lg hover:bg-undead-lightPurple transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Chat modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-undead-dark rounded-lg shadow-xl border border-undead-purple overflow-hidden"
          >
            {/* Header */}
            <div className="bg-undead-purple p-3 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-undead-dark flex items-center justify-center mr-2">
                  <span className="text-lg">👻</span>
                </div>
                <h3 className="text-white font-medium">Ghost Waiter</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                className="text-white hover:text-undead-blood"
              >
                &times;
              </Button>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 bg-undead-charcoal bg-opacity-95">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{
                    opacity: 0,
                    y: message.sender === "user" ? 10 : -10,
                  }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`mb-3 ${
                    message.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block rounded-lg py-2 px-3 max-w-[80%] relative ${
                      message.sender === "user"
                        ? "bg-undead-purple text-white"
                        : "bg-undead-aged text-undead-charcoal"
                    }`}
                  >
                    {message.text}
                    {message.isTyping && (
                      <div className="absolute -bottom-2 left-0 flex space-x-1">
                        <div
                          className="w-2 h-2 rounded-full bg-undead-purple animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-undead-purple animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-undead-purple animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-undead-dark border-t border-undead-purple flex items-center">
              <div className="flex">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`mr-2 ${
                    isListening ? "text-undead-blood" : "text-white"
                  }`}
                  onClick={toggleListening}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`mr-2 ${
                    isPossessed ? "text-undead-blood" : "text-white"
                  }`}
                  onClick={togglePossession}
                >
                  {isPossessed ? "👻" : "💀"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2 text-white"
                  onClick={() => setIsMuted((prev) => !prev)}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume size={20} />}
                </Button>
              </div>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask the ghost waiter..."
                className="flex-1 bg-undead-charcoal text-undead-bone"
              />
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 bg-undead-purple text-white hover:bg-undead-lightPurple"
                onClick={handleSendMessage}
              >
                Send
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

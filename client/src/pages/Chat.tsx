import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { THEMES, type ThemeId, type ChatMessage } from "@shared/matti-types";

export default function Chat() {
  const { user } = useAuth();
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>("general");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentTheme = THEMES.find((t) => t.id === currentThemeId)!;

  // Fetch conversation for current theme
  const { data: conversation, refetch: refetchConversation } = trpc.chat.getConversation.useQuery(
    { themeId: currentThemeId },
    { enabled: !!user }
  );

  // Load messages from conversation
  useEffect(() => {
    if (conversation?.messages) {
      const loadedMessages: ChatMessage[] = (conversation.messages as Array<{
        role: "user" | "assistant";
        content: string;
        timestamp: string;
      }>).map((msg, index) => ({
        id: `${conversation.id}-${index}`,
        content: msg.content,
        isAI: msg.role === "assistant",
        timestamp: msg.timestamp,
      }));
      setMessages(loadedMessages);
    } else if (user) {
      // Show welcome message if no conversation exists
      const greetings = ["Hé", "Hey", "Yo"];
      const phrases = [
        "Chill dat je er bent!",
        "Goed dat je er bent!",
        "Leuk dat je er bent!",
        "Wat fijn dat je er bent!",
      ];
      const emojis = ["👋", "✨", "😊", "💬", "🎯"];

      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

      const welcomeMsg: ChatMessage = {
        id: Date.now().toString(),
        content: `${randomGreeting} ${user.name || "daar"}! ${randomPhrase} ${randomEmoji}\n\nWaar wil je het over hebben?`,
        isAI: true,
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMsg]);
    }
  }, [conversation, user]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Mutations
  const sendToAssistant = trpc.assistant.send.useMutation();
  const saveMessage = trpc.chat.saveMessage.useMutation();

  const handleSendMessage = async () => {
    if (!inputText.trim() || !user) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      content: inputText.trim(),
      isAI: false,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const messageText = inputText.trim();
    setInputText("");
    setIsTyping(true);

    try {
      // Save user message to database
      await saveMessage.mutateAsync({
        themeId: currentThemeId,
        role: "user",
        content: messageText,
      });

      // Build context from recent messages
      const recentMessages = messages.slice(-8);
      const context = recentMessages
        .map((m) => `${m.isAI ? "Matti" : "Gebruiker"}: ${m.content}`)
        .join("\n");

      // Send to OpenAI Assistant
      const response = await sendToAssistant.mutateAsync({
        message: messageText,
        threadId: conversation?.threadId || undefined,
        context,
        themeId: currentThemeId,
        userProfile: user.age && user.gender && user.gender !== "none"
          ? {
              name: user.name || "",
              age: user.age,
              gender: user.gender,
            }
          : undefined,
      });

      // Save assistant response and threadId
      await saveMessage.mutateAsync({
        themeId: currentThemeId,
        role: "assistant",
        content: response.reply,
        threadId: response.threadId,
      });

      // Add assistant response to UI
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.reply,
        isAI: true,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);

      // Refresh conversation to get updated threadId
      refetchConversation();
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, er ging iets mis. Probeer het nog eens! 🔄",
        isAI: true,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    if (!user) return;

    const greetings = ["Hé", "Hey", "Yo"];
    const phrases = [
      "Chill dat je er bent!",
      "Goed dat je er bent!",
      "Leuk dat je er bent!",
      "Wat fijn dat je er bent!",
    ];
    const emojis = ["👋", "✨", "😊", "💬", "🎯"];

    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      content: `${randomGreeting} ${user.name || "daar"}! ${randomPhrase} ${randomEmoji}\n\nWaar wil je het over hebben?`,
      isAI: true,
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMessage]);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header with gradient */}
      <div
        className={`theme-${currentThemeId}-gradient px-6 py-4`}
        style={{
          background: `linear-gradient(90deg, ${currentTheme.colors.gradient[0]} 0%, ${currentTheme.colors.gradient[1]} 100%)`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{currentTheme.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold text-white">Matti</h1>
              <p className="text-xs text-white/80">AI Chatbuddy</p>
            </div>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="bg-white/20 px-4 py-2 rounded-full hover:opacity-70 transition-opacity"
          >
            <span className="text-white font-semibold text-sm">
              Nieuw Gesprek
            </span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 px-4 pt-4 pb-4 overflow-y-auto bg-background"
      >
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Input Area */}
      <div className="px-4 pb-4 pt-2 border-t border-border bg-background">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type je bericht..."
            maxLength={500}
            disabled={isTyping}
            className="flex-1 bg-surface text-foreground px-4 py-3 rounded-full text-base placeholder:text-muted-foreground border-0 outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              !inputText.trim() || isTyping ? "opacity-50" : "hover:opacity-80"
            } transition-opacity`}
            style={{
              background: `linear-gradient(90deg, ${currentTheme.colors.gradient[0]} 0%, ${currentTheme.colors.gradient[1]} 100%)`,
            }}
          >
            <span className="text-white text-xl">↑</span>
          </button>
        </div>
      </div>

      {/* Bottom Tab Navigation */}
      <TabNavigation currentTab="chat" />
    </div>
  );
}

// Chat Bubble Component (exact from original)
function ChatBubble({ message }: { message: ChatMessage }) {
  const time = new Date(message.timestamp).toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`mb-4 flex ${message.isAI ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[80%] ${
          message.isAI ? "items-start" : "items-end"
        } flex flex-col`}
      >
        {/* AI Avatar */}
        {message.isAI && (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mb-1">
            <span className="text-lg">✨</span>
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            message.isAI
              ? "bg-surface rounded-tl-sm border border-border"
              : "bg-primary rounded-tr-sm"
          }`}
        >
          <p
            className={`text-base leading-relaxed whitespace-pre-wrap ${
              message.isAI ? "text-foreground" : "text-white"
            }`}
          >
            {message.content}
          </p>
        </div>

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground mt-1 px-1">{time}</p>
      </div>
    </div>
  );
}

// Typing Indicator Component (exact from original)
function TypingIndicator() {
  return (
    <div className="mb-4 flex justify-start">
      <div className="max-w-[80%] items-start flex flex-col">
        {/* AI Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mb-1">
          <span className="text-lg">✨</span>
        </div>

        {/* Typing Bubble */}
        <div className="bg-surface px-4 py-3 rounded-2xl rounded-tl-sm">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary typing-dot" />
            <div className="w-2 h-2 rounded-full bg-primary typing-dot" />
            <div className="w-2 h-2 rounded-full bg-primary typing-dot" />
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-1 px-1">
          Matti is aan het typen...
        </p>
      </div>
    </div>
  );
}

// Tab Navigation Component
function TabNavigation({ currentTab }: { currentTab: string }) {
  const tabs = [
    { id: "chat", label: "Chat", icon: "💬", path: "/chat" },
    { id: "history", label: "Geschiedenis", icon: "📜", path: "/history" },
    { id: "themes", label: "Thema's", icon: "🎨", path: "/themes" },
    { id: "profile", label: "Profiel", icon: "👤", path: "/profile" },
    { id: "parent", label: "Ouders", icon: "👨‍👩‍👧", path: "/parent-info" },
  ];

  return (
    <div className="border-t border-border bg-background">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            href={tab.path}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-opacity ${
              currentTab === tab.id ? "opacity-100" : "opacity-50 hover:opacity-75"
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs font-medium text-foreground">
              {tab.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

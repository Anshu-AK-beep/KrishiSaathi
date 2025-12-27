// src/components/analytics/AIChatbotPanel.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Plus,
  History,
  Loader2,
  Sparkles
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface AIChatbotPanelProps {
  userId: string;
  farms: any[];
  predictions: any[];
}

export default function AIChatbotPanel({ userId, farms, predictions }: AIChatbotPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, [userId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  const loadChatHistory = async () => {
    try {
      const response = await fetch(`/api/chat/history?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setChats(data.chats || []);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Conversation",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCurrentChat(newChat);
    setShowHistory(false);
  };

  const loadChat = (chat: Chat) => {
    setCurrentChat(chat);
    setShowHistory(false);
  };

  const saveChat = async (chat: Chat) => {
    try {
      await fetch("/api/chat/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, chat }),
      });
      loadChatHistory();
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    // Create new chat if none exists
    if (!currentChat) {
      const newChat: Chat = {
        id: Date.now().toString(),
        title: input.substring(0, 50) + (input.length > 50 ? "..." : ""),
        messages: [userMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCurrentChat(newChat);
      setInput("");
      
      // Get AI response
      await getAIResponse(newChat, input);
      return;
    }

    // Add message to existing chat
    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, userMessage],
      updatedAt: new Date(),
    };
    setCurrentChat(updatedChat);
    setInput("");

    // Get AI response
    await getAIResponse(updatedChat, input);
  };

  const getAIResponse = async (chat: Chat, userInput: string) => {
    setIsLoading(true);

    try {
      // Prepare context about farms and predictions
      const context = {
        farms: farms.map(f => ({
          name: f.name,
          location: f.location,
          area: f.totalArea,
          soilType: f.soilType,
          irrigationType: f.irrigationType,
        })),
        predictions: predictions.slice(0, 5).map(p => ({
          crop: p.cropType,
          area: p.fieldArea,
          predictedYield: p.predictedYield,
          confidence: p.confidenceLevel,
          temperature: p.avgTemperature,
          rainfall: p.totalRainfall,
        })),
      };

      const response = await fetch("/api/chat/ai-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userInput,
          context,
          chatHistory: chat.messages.slice(-5), // Last 5 messages for context
        }),
      });

      if (!response.ok) throw new Error("AI response failed");

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      const updatedChat = {
        ...chat,
        messages: [...chat.messages, aiMessage],
        updatedAt: new Date(),
      };

      setCurrentChat(updatedChat);
      
      // Save chat to history
      await saveChat(updatedChat);

    } catch (error) {
      console.error("Error getting AI response:", error);
      
      // Fallback response
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };

      setCurrentChat({
        ...chat,
        messages: [...chat.messages, errorMessage],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="w-6 h-6" />
          {chats.length > 0 && (
            <Badge className="absolute -top-1 -right-1 px-2 py-0.5 bg-red-500">
              {chats.length}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-64 shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <CardTitle className="text-sm">AI Assistant</CardTitle>
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsMinimized(false)}
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-96 h-[600px] shadow-2xl flex flex-col">
        {/* Header */}
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
              </div>
              <div>
                <CardTitle className="text-base">AI Farm Assistant</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Ask me anything about your farm
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowHistory(!showHistory)}
              >
                <History className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={createNewChat}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsMinimized(true)}
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Chat History Sidebar */}
        {showHistory ? (
          <CardContent className="flex-1 p-4 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-2">
                <h3 className="font-semibold mb-3">Chat History</h3>
                {chats.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No previous chats
                  </p>
                ) : (
                  chats.map(chat => (
                    <div
                      key={chat.id}
                      className="p-3 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => loadChat(chat)}
                    >
                      <p className="text-sm font-semibold truncate">{chat.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(chat.updatedAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {chat.messages.length} messages
                      </p>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        ) : (
          <>
            {/* Messages */}
            <CardContent className="flex-1 p-4 overflow-hidden">
              <ScrollArea className="h-full">
                {!currentChat || currentChat.messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Sparkles className="w-16 h-16 text-purple-600 mb-4 animate-pulse" />
                    <h3 className="text-lg font-semibold mb-2">
                      Welcome to AI Farm Assistant!
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ask me about:
                    </p>
                    <div className="space-y-2 text-sm text-left">
                      <div className="flex items-start gap-2">
                        <span>🌾</span>
                        <span>Crop recommendations</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span>💧</span>
                        <span>Irrigation scheduling</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span>🌡️</span>
                        <span>Weather impact</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span>📈</span>
                        <span>Yield optimization</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentChat.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg p-3">
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about your farm..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
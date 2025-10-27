"use client";

import { vapi } from "@/lib/actions/vapi";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Mic, MicOff, Send, Loader2, Volume2 } from "lucide-react";
import Image from "next/image";

interface Message {
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

function VapiWidget() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { user, isLoaded } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Setup VAPI event listeners
  useEffect(() => {
    function handleCallStart() {
      setIsListening(true);
    }

    function handleCallEnd() {
      setIsListening(false);
      setIsSpeaking(false);
      setIsProcessing(false);
    }

    function handleSpeechStart() {
      setIsSpeaking(true);
    }

    function handleSpeechEnd() {
      setIsSpeaking(false);
      setIsListening(false);
    }

    // Improved: Handles both user and assistant events reliably
    function handleMessage(message: any) {
      if (message.type === "transcript" && message.transcriptType === "final") {
        // User message
        if (message.role === "user") {
          setMessages(prev => [
            ...prev,
            {
              content: message.transcript,
              role: "user",
              timestamp: new Date()
            }
          ]);
        }
        // Assistant reply
        if (message.role === "assistant") {
          setMessages(prev => [
            ...prev,
            {
              content: message.transcript,
              role: "assistant",
              timestamp: new Date()
            }
          ]);
          setIsProcessing(false);
        }
      }
      // Fallback: Sometimes assistant comes under type 'message'
      if (message.type === "message" && message.role === "assistant") {
        setMessages(prev => [
          ...prev,
          {
            content: message.text || message.content,
            role: "assistant",
            timestamp: new Date()
          }
        ]);
        setIsProcessing(false);
      }
    }

    function handleError(error: any) {
      // Log and reset
      console.error("Vapi Error:", error);
      setIsListening(false);
      setIsSpeaking(false);
      setIsProcessing(false);
    }

    vapi
      .on("call-start", handleCallStart)
      .on("call-end", handleCallEnd)
      .on("speech-start", handleSpeechStart)
      .on("speech-end", handleSpeechEnd)
      .on("message", handleMessage)
      .on("error", handleError);

    // Clean up
    return () => {
      vapi
        .off("call-start", handleCallStart)
        .off("call-end", handleCallEnd)
        .off("speech-start", handleSpeechStart)
        .off("speech-end", handleSpeechEnd)
        .off("message", handleMessage)
        .off("error", handleError);
    };
  }, []);

  // Handle text message send
  const handleSendMessage = async () => {
    const message = inputValue.trim();
    if (!message) return;

    setMessages(prev => [
      ...prev,
      {
        content: message,
        role: "user",
        timestamp: new Date()
      }
    ]);
    setInputValue("");
    setIsProcessing(true);

    try {
      await vapi.send({
        type: "add-message",
        message: {
          role: "user",
          content: message
        }
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsProcessing(false);
    }
  };

  // Handle voice input toggle
  const toggleVoiceInput = async () => {
    if (isListening) {
      vapi.stop();
      setIsListening(false);
    } else {
      try {
        setIsListening(true);
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);
      } catch (error) {
        console.error("Failed to start voice:", error);
        setIsListening(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      <Card className="border-2 shadow-xl">
        <CardContent className="p-0">
          <div className="h-[600px] overflow-y-auto p-6 space-y-4 bg-muted/20">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Volume2 className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Start a Conversation</h3>
                <p className="text-muted-foreground max-w-sm">
                  Type your farming question or click the microphone to speak
                </p>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Image
                            src="/LOGO-ONLY.png"
                            alt="AI"
                            width={24}
                            height={24}
                            className="w-6 h-6"
                          />
                        </div>
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-card border border-border rounded-tl-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                    {message.role === "user" && (
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                          {user?.imageUrl ? (
                            <Image
                              src={user.imageUrl}
                              alt="User"
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                              <span className="text-sm font-semibold">
                                {user?.firstName?.[0] || "U"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Image
                        src="/LOGO-ONLY.png"
                        alt="AI"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </div>
                    <div className="bg-card border border-border rounded-2xl rounded-tl-none px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                {isSpeaking && (
                  <div className="flex gap-2 items-center text-sm text-muted-foreground">
                    <Volume2 className="w-4 h-4 text-primary animate-pulse" />
                    <span>AI is speaking...</span>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t bg-background p-4">
            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your farming question here..."
                  className="pr-12 h-12 text-base"
                  disabled={isListening || isProcessing}
                />
              </div>
              <Button
                onClick={toggleVoiceInput}
                size="lg"
                variant={isListening ? "destructive" : "outline"}
                className={`h-12 px-4 ${
                  isListening
                    ? "bg-red-500 hover:bg-red-600"
                    : "hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                  </>
                )}
              </Button>
              <Button
                onClick={handleSendMessage}
                size="lg"
                disabled={!inputValue.trim() || isProcessing || isListening}
                className="h-12 px-6 bg-primary"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground text-center">
              {isListening ? (
                <span className="text-red-500 font-medium">
                  🎤 Listening... Click mic to stop
                </span>
              ) : (
                <span>Type or click the microphone to speak</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default VapiWidget;

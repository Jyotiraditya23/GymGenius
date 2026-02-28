import React, { useState, useEffect, useRef } from "react";
import { streamChat } from "../services/ChatbotService";

import ChatHeader from "../components/chatbot/ChatHeader";
import ChatMessage from "../components/chatbot/ChatMessage";
import ChatInput from "../components/chatbot/ChatInput";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, content: "Hi 👋 How can I help you today?", isUser: false },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage = { id: Date.now(), content: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);

    const aiId = Date.now() + 1;
    setMessages((prev) => [
      ...prev,
      { id: aiId, content: "", isUser: false, isLoading: true },
    ]);

    setIsStreaming(true);

    let fullText = "";

    streamChat(input, (data) => {
      if (data.type === "content") {
        fullText += data.content;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiId ? { ...msg, content: fullText, isLoading: false } : msg
          )
        );
      }
      if (data.type === "end") {
        setIsStreaming(false);
        inputRef.current?.focus();
      }
    });

    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} msg={msg} />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isStreaming={isStreaming}
        inputRef={inputRef}
      />
    </div>
  );
};

export default Chatbot;
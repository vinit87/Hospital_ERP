import React, { useState } from "react";
import "./AIChatbot.css";

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! 👋 How can I help you with the hospital data?",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://localhost:7146/api/AI/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.response,
        },
      ]);
    } catch (error) {
      console.error(error);



      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, I couldn't process your request.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          className="ai-floating-button"
          onClick={() => setIsOpen(true)}
        >
          🤖
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chatbot">

          {/* Header */}
          <div className="ai-header">
            <div>
              <strong>AI Assistant</strong>
              <small>Hospital ERP</small>
            </div>

            <button
              className="ai-close"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="ai-messages">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.sender === "user"
                    ? "message user-message"
                    : "message ai-message"
                }
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="message ai-message">
                Thinking...
              </div>
            )}

          </div>

          {/* Input */}
          <div className="ai-input-area">

            <input
              type="text"
              placeholder="Ask about hospital data..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
            >
              ➤
            </button>

          </div>

        </div>
      )}
    </>
  );
}

export default AIChatbot;
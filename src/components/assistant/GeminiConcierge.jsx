/**
 * CampuSphere - Google Gemini AI Campus Concierge View
 * Interactive conversational assistant powered by Google Gemini with graceful grounded fallback.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  SparklesIcon,
  SearchIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ClockIcon
} from '../common/Icons';
import { askGeminiAssistant } from '../../services/geminiService';

export function GeminiConcierge() {
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: "👋 Hi Alex! I'm your CampuSphere AI Concierge, powered by Google Gemini. Ask me anything about classroom locations (e.g. *TH-101*), quiet study desks, shuttle schedules, campus health services, or exam schedules.",
      timestamp: 'Just now',
      source: 'Campus Intelligence System'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef(null);

  const quickPrompts = [
    'Where is room TH-101 in Turing Hall?',
    'Which library floor has quiet desks and open power outlets?',
    'Are there any campus shuttle delays today?',
    'How do I connect to campus eduroam Wi-Fi?',
    'What are the Student Health Center hours?'
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (queryText) => {
    const textToSend = (queryText || inputValue).trim();
    if (!textToSend || loading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await askGeminiAssistant(textToSend);
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: response.source,
        isLiveGemini: response.isLiveGemini,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: "I encountered a network issue while retrieving campus information. Please try again or contact the Campus IT Help Desk at 650-725-4357.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'Error Fallback'
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'msg-welcome-reset',
        sender: 'assistant',
        text: "Chat cleared! How can I assist you with your campus day?",
        timestamp: 'Just now',
        source: 'Campus Intelligence System'
      }
    ]);
  };

  // Safe formatting for markdown-like bold text without dangerous innerHTML
  const formatMessageText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, lIdx) => {
      // Split by bold markers (**text**)
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={lIdx} className="chat-line">
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <section className="gemini-assistant-section" aria-labelledby="assistant-heading">
      <div className="section-title-bar">
        <div>
          <div className="gemini-header-tag">
            <h2 id="assistant-heading">Google Gemini Campus Concierge</h2>
            <span className="pill pill-purple">
              <SparklesIcon size={12} />
              AI Driven
            </span>
          </div>
          <p>Instant natural-language answers for room directions, library occupancy, shuttle alerts, and academic policies.</p>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={handleClearHistory}
          aria-label="Clear chat history"
        >
          Reset Chat
        </button>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="quick-prompts-row" aria-label="Suggested questions">
        <span className="quick-prompts-label">Quick Suggestions:</span>
        <div className="quick-prompts-scroll">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              className="prompt-chip"
              onClick={() => handleSendMessage(prompt)}
              disabled={loading}
            >
              <SparklesIcon size={13} className="text-amber" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="chat-container card" role="log" aria-live="polite" aria-label="Campus Concierge Chat">
        <div className="chat-messages-area">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-bubble-wrapper ${msg.sender === 'user' ? 'user-wrapper' : 'assistant-wrapper'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="assistant-avatar" aria-hidden="true">
                  <SparklesIcon size={16} />
                </div>
              )}

              <div className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'assistant-bubble'}`}>
                <div className="bubble-content">
                  {formatMessageText(msg.text)}
                </div>

                <div className="bubble-meta">
                  <span className="bubble-time">{msg.timestamp}</span>
                  {msg.source && (
                    <span className="bubble-source">
                      <ShieldCheckIcon size={11} className="inline-icon" /> {msg.source}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-bubble-wrapper assistant-wrapper animate-fade-in">
              <div className="assistant-avatar" aria-hidden="true">
                <SparklesIcon size={16} />
              </div>
              <div className="chat-bubble assistant-bubble loading-bubble">
                <div className="typing-indicator">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
                <span className="loading-text">Google Gemini is thinking…</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="chat-input-row">
          <label htmlFor="gemini-input" className="sr-only">Ask Google Gemini Campus Concierge</label>
          <input
            id="gemini-input"
            type="text"
            className="chat-text-input"
            placeholder="Type your campus question (e.g., 'Where is Turing Hall TH-101?')..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            maxLength={400}
          />
          <button
            type="button"
            className="btn btn-primary chat-submit-btn"
            onClick={() => handleSendMessage()}
            disabled={loading || !inputValue.trim()}
            aria-label="Send query to Gemini assistant"
          >
            <SparklesIcon size={16} />
            <span>Ask</span>
          </button>
        </div>
      </div>
    </section>
  );
}

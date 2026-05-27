"use client";

import { askChatbot } from "@/src/services/chatbot_service";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";
import { FormEvent, useMemo, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

const suggestedQuestions = [
  "How do I create a laundry request?",
  "How do vendor offers work?",
  "How can I pay?",
  "How do I track my order?",
  "How do I raise a dispute?",
  "How can I contact support?",
];

const welcomeMessage =
  "Hi, I am the Dhune.np Help Assistant. Ask me general questions about requests, offers, orders, payments, reviews, disputes, or vendor registration.";

export default function HelpChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: welcomeMessage,
    },
  ]);
  const sessionId = useRef<string>("");

  const visibleSuggestions = useMemo(() => {
    const asked = new Set(
      messages
        .filter((message) => message.role === "user")
        .map((message) => message.text.toLowerCase())
    );

    return suggestedQuestions.filter(
      (question) => !asked.has(question.toLowerCase())
    );
  }, [messages]);

  const ensureSessionId = () => {
    if (!sessionId.current) {
      sessionId.current =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
    return sessionId.current;
  };

  const sendMessage = async (text: string) => {
    const message = text.trim();
    if (!message || loading) {
      return;
    }

    setInput("");
    setLoading(true);
    setMessages((current) => [
      ...current,
      { id: `${Date.now()}-user`, role: "user", text: message },
    ]);

    try {
      const response = await askChatbot({
        message,
        session_id: ensureSessionId(),
      });

      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          text:
            response.data.reply ||
            "I could not answer that right now. Please contact Dhune.np support.",
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          text: "I could not reach Dhune.np help right now. Please try again or contact support@dhune.np.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-5 right-4 z-50 sm:bottom-6 sm:right-6">
      {open ? (
        <section className="flex h-[min(620px,calc(100vh-2rem))] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 dark:border-white/10 dark:bg-[#1d1d1a]">
          <header className="flex items-center justify-between bg-[#040947] px-4 py-3 text-white dark:bg-[#ebbc01] dark:text-[#111827]">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 dark:bg-black/10">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-sm font-bold">Dhune Help Center</h2>
                <p className="text-xs text-white/75 dark:text-[#111827]/70">
                  General support only
                </p>
              </div>
            </div>
            <button
              aria-label="Close help chat"
              className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15 dark:hover:bg-black/10"
              onClick={() => setOpen(false)}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#F7F5EE] px-4 py-4 dark:bg-[#18212b]">
            {messages.map((message) => (
              <div
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
                key={message.id}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "bg-[#040947] text-white dark:bg-[#ebbc01] dark:text-[#111827]"
                      : "border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-[#242420] dark:text-[#F7F5EE]/80"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {loading ? (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 dark:border-white/10 dark:bg-[#242420] dark:text-[#F7F5EE]/75">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking
                </div>
              </div>
            ) : null}
          </div>

          <div className="border-t border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-[#1d1d1a]">
            {visibleSuggestions.length > 0 ? (
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {visibleSuggestions.slice(0, 4).map((question) => (
                  <button
                    className="shrink-0 rounded-full border border-[#040947]/15 bg-[#fff7d6] px-3 py-2 text-xs font-semibold text-[#040947] transition hover:border-[#040947]/40 dark:border-[#ebbc01]/25 dark:bg-[#ebbc01]/10 dark:text-[#ebbc01]"
                    disabled={loading}
                    key={question}
                    onClick={() => sendMessage(question)}
                    type="button"
                  >
                    {question}
                  </button>
                ))}
              </div>
            ) : null}

            <form className="flex items-end gap-2" onSubmit={handleSubmit}>
              <textarea
                aria-label="Ask Dhune Help Center"
                className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#040947] dark:border-white/10 dark:bg-[#242420] dark:text-white dark:focus:border-[#ebbc01]"
                disabled={loading}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage(input);
                  }
                }}
                placeholder="Ask a support question"
                rows={1}
                value={input}
              />
              <button
                aria-label="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ebbc01] text-[#111827] transition hover:bg-[#ffd84d] disabled:opacity-60"
                disabled={loading || input.trim() === ""}
                type="submit"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </form>
          </div>
        </section>
      ) : (
        <button
          aria-label="Open Dhune Help Center chat"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#040947] text-white shadow-2xl shadow-slate-950/25 transition hover:-translate-y-0.5 hover:bg-[#121008ea] dark:bg-[#ebbc01] dark:text-[#111827] dark:hover:bg-[#ffd84d]"
          onClick={() => setOpen(true)}
          type="button"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}


"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowUp,
  MessageSquarePlus,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { motion } from "framer-motion";

import { PageHeader } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/feedback";
import { mentorSuggestedPrompts } from "@/lib/data";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
};

type Feedback = "like" | "dislike";

export default function AiMentorPage() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<
    Record<string, Feedback>
  >({});

  const endRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, thinking]);

  const requestAI = async (
    value: string,
    history: Message[] = []
  ) => {
    const response = await fetch("/api/mentor/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: value,
        history: history
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({
            role: m.role,
            content: m.content,
          })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "AI request failed");
    }

    if (typeof data.reply !== "string") {
      throw new Error("Invalid AI response");
    }

    return data.reply;
  };

  const send = async (text: string) => {
    const value = text.trim();

    if (!value || thinking) return;

    setInput("");

    const userMessage: Message = {
      id: `u-${crypto.randomUUID()}`,
      role: "user",
      content: value,
      time: "now",
    };

    setMessages((prev) => [...prev, userMessage]);
    setThinking(true);

    try {
      const reply = await requestAI(value, messages);

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${crypto.randomUUID()}`,
          role: "assistant",
          content: reply,
          time: "now",
        },
      ]);
    } catch (error) {
      console.error("AI Mentor error:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: `e-${crypto.randomUUID()}`,
          role: "assistant",
          content:
            error instanceof Error
              ? `AI Error: ${error.message}`
              : "Unable to connect to DevHub AI.",
          time: "now",
        },
      ]);
    } finally {
      setThinking(false);
      textareaRef.current?.focus();
    }
  };

  const regenerate = async (messageId: string) => {
    if (thinking) return;

    const messageIndex = messages.findIndex(
      (message) => message.id === messageId,
    );

    const previousUser = messages
      .slice(0, messageIndex)
      .reverse()
      .find((message) => message.role === "user");

    if (!previousUser) return;

    setMessages((prev) => prev.slice(0, messageIndex));
    setThinking(true);

    try {
      const reply = await requestAI(previousUser.content);

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${crypto.randomUUID()}`,
          role: "assistant",
          content: reply,
          time: "now",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${crypto.randomUUID()}`,
          role: "assistant",
          content:
            error instanceof Error
              ? `AI Error: ${error.message}`
              : "Unable to regenerate response.",
          time: "now",
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  const copyMessage = async (message: Message) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedId(message.id);

      window.setTimeout(() => {
        setCopiedId((current) =>
          current === message.id ? null : current,
        );
      }, 1800);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const startNewChat = () => {
    if (thinking) return;

    setMessages([]);
    setInput("");
    setFeedback({});
    setCopiedId(null);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="AI Mentor"
        description="Your intelligent developer assistant."
        actions={
          <>
            <Badge variant="accent">
              <Sparkles className="mr-1 h-3 w-3" />
              Local AI · Qwen3
            </Badge>

            <Button
              variant="secondary"
              size="sm"
              data-testid="mentor-new-chat"
              onClick={startNewChat}
              disabled={thinking}
            >
              <MessageSquarePlus className="mr-1 h-3.5 w-3.5" />
              New chat
            </Button>
          </>
        }
      />

      <section className="flex min-h-0 flex-1 flex-col">
        <div
          data-testid="mentor-messages"
          className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6"
        >
          <div className="mx-auto max-w-[800px] space-y-6">

            {messages.length === 0 && (
              <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface">
                  <Sparkles className="h-7 w-7 text-accent" />
                </div>

                <h2 className="text-xl font-semibold text-text-primary">
                  How can I help you today?
                </h2>

                <p className="mt-2 max-w-md text-sm text-text-muted">
                  Ask about coding, architecture, debugging,
                  projects or your development roadmap.
                </p>

                <div className="mt-7 flex max-w-xl flex-wrap justify-center gap-2">
                  {mentorSuggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => send(prompt)}
                      disabled={thinking}
                      className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-secondary transition hover:border-accent hover:bg-surface-hover hover:text-text-primary disabled:opacity-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex",
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start",
                )}
              >
                <div className="max-w-[90%] sm:max-w-[85%]">

                  {message.role === "assistant" && (
                    <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-accent">
                      <Sparkles className="h-3.5 w-3.5" />
                      DevHub AI
                    </div>
                  )}

                  <div
                    className={cn(
                      "rounded-xl border px-4 py-3 text-[13px] leading-7",
                      message.role === "user"
                        ? "rounded-br-sm border-accent-border bg-accent-subtle text-text-primary"
                        : "rounded-bl-sm border-border bg-card text-text-secondary",
                    )}
                  >
                    {message.role === "assistant" ? (
                      <div className="max-w-none break-words [&_h1]:mb-3 [&_h1]:mt-4 [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:text-text-primary [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-text-primary [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:font-semibold [&_h3]:text-text-primary [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_strong]:font-semibold [&_strong]:text-text-primary [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-3 [&_blockquote]:text-text-muted [&_a]:text-accent [&_a]:underline [&_hr]:my-4 [&_hr]:border-border [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:bg-surface [&_th]:p-2 [&_td]:border [&_td]:border-border [&_td]:p-2 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-[#08090A] [&_pre]:p-3 [&_code]:rounded [&_code]:bg-surface [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[12px] [&_pre_code]:bg-transparent [&_pre_code]:p-0">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap break-words">
                        {message.content}
                      </div>
                    )}
                  </div>

                  {message.role === "assistant" && (
                    <div className="mt-2 flex items-center gap-1 text-text-muted">

                      <button
                        onClick={() => copyMessage(message)}
                        title="Copy response"
                        aria-label="Copy response"
                        className="rounded-md p-1.5 transition hover:bg-surface-hover hover:text-text-primary"
                      >
                        {copiedId === message.id ? (
                          <Check className="h-3.5 w-3.5 text-success" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() =>
                          regenerate(message.id)
                        }
                        disabled={thinking}
                        title="Regenerate response"
                        aria-label="Regenerate response"
                        className="rounded-md p-1.5 transition hover:bg-surface-hover hover:text-text-primary disabled:opacity-40"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() =>
                          setFeedback((prev) => ({
                            ...prev,
                            [message.id]: "like",
                          }))
                        }
                        title="Good response"
                        aria-label="Like response"
                        className={cn(
                          "rounded-md p-1.5 transition hover:bg-surface-hover hover:text-text-primary",
                          feedback[message.id] === "like" &&
                          "text-success",
                        )}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() =>
                          setFeedback((prev) => ({
                            ...prev,
                            [message.id]: "dislike",
                          }))
                        }
                        title="Bad response"
                        aria-label="Dislike response"
                        className={cn(
                          "rounded-md p-1.5 transition hover:bg-surface-hover hover:text-text-primary",
                          feedback[message.id] === "dislike" &&
                          "text-danger",
                        )}
                      >
                        <ThumbsDown className="h-3.5 w-3.5" />
                      </button>

                      {copiedId === message.id && (
                        <span className="ml-1 text-[10px] text-success">
                          Copied
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {thinking && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-xs text-text-muted">
                  <Spinner />
                  DevHub AI is thinking...
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>
        </div>

        <div className="shrink-0 border-t border-border px-4 py-3 sm:px-6">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              send(input);
            }}
            className="mx-auto max-w-[800px]"
          >
            <div className="flex items-end gap-2 rounded-xl border border-border bg-surface p-2 transition-colors focus-within:border-accent">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                placeholder="Ask DevHub AI anything..."
                data-testid="mentor-input"
                className="max-h-32 min-h-[28px] flex-1 resize-none bg-transparent px-1.5 py-1 text-[13px] text-text-primary outline-none placeholder:text-text-muted"
              />

              <Button
                type="submit"
                variant="primary"
                size="icon"
                aria-label="Send message"
                disabled={!input.trim() || thinking}
                data-testid="mentor-send"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
            </div>

            <p className="mt-2 text-center text-[10px] text-text-muted">
              Powered by Local AI · Qwen3
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}

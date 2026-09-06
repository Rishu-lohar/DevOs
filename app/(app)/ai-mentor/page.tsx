"use client";

import * as React from "react";
import { ArrowUp, MessageSquarePlus, Sparkles, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/feedback";
import {
  mentorConversations,
  mentorSeedThread,
  mentorSuggestedPrompts,
} from "@/lib/data";
import { cn } from "@/lib/utils";

type Message = { id: string; role: "user" | "assistant"; content: string; time: string };

const cannedReply = (q: string) =>
  `Here is how I would approach “${q.replace(/\?$/, "")}”.\n\nBased on the six repositories indexed in your workspace, the most relevant context is your current sprint work on authentication and the mobile shell. I would start by isolating the smallest reproducible surface, add a regression test, and only then refactor the surrounding module so the change stays reviewable.\n\nThis response is generated from local dummy data — the reasoning engine arrives in a later phase.`;

export default function AiMentorPage() {
  const [messages, setMessages] = React.useState<Message[]>([...mentorSeedThread]);
  const [input, setInput] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const [activeThread, setActiveThread] = React.useState(mentorConversations[0].id);
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking]);

  const send = async (text: string) => {
    const value = text.trim();
    if (!value || thinking) return;
    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", content: value, time: "now" },
    ]);
    setThinking(true);
    await new Promise((r) => setTimeout(r, 700));
    setMessages((prev) => [
      ...prev,
      { id: `a-${Date.now()}`, role: "assistant", content: cannedReply(value), time: "now" },
    ]);
    setThinking(false);
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="AI Mentor"
        description="Context-aware engineering guidance grounded in your repositories."
        actions={
          <>
            <Badge variant="accent">
              <Sparkles className="h-3 w-3" />
              6 repos indexed
            </Badge>
            <Button
              variant="secondary"
              size="sm"
              data-testid="mentor-new-chat"
              onClick={() => setMessages([...mentorSeedThread])}
            >
              <MessageSquarePlus className="h-3 w-3" />
              New chat
            </Button>
          </>
        }
      />

      <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[240px_1fr]">
        {/* Conversation history */}
        <aside className="hidden min-h-0 flex-col border-r border-border lg:flex">
          <div className="border-b border-border px-4 py-2.5">
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-text-muted">
              Conversations
            </p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {mentorConversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveThread(c.id)}
                data-testid={`mentor-thread-${c.id}`}
                className={cn(
                  "group mb-px flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors duration-[140ms]",
                  activeThread === c.id
                    ? "bg-surface-active text-text-primary"
                    : "text-text-secondary hover:bg-surface-hover hover:text-text-primary",
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px]">{c.title}</span>
                  <span className="block text-[10px] text-text-muted">{c.time}</span>
                </span>
                <Trash2 className="h-3 w-3 shrink-0 text-text-muted opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </aside>

        {/* Chat surface */}
        <section className="flex min-h-0 flex-col">
          <div
            data-testid="mentor-messages"
            className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6"
          >
            <div className="mx-auto max-w-[720px] space-y-4">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[86%] rounded-xl border px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-line",
                      m.role === "user"
                        ? "rounded-br-sm border-accent-border bg-accent-subtle text-text-primary"
                        : "rounded-bl-sm border-border bg-card text-text-secondary",
                    )}
                  >
                    {m.role === "assistant" && (
                      <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium text-accent">
                        <Sparkles className="h-3 w-3" />
                        DevOS Mentor
                      </span>
                    )}
                    {m.content}
                  </div>
                </motion.div>
              ))}

              {thinking && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-xl rounded-bl-sm border border-border bg-card px-3.5 py-2.5 text-[12px] text-text-muted">
                    <Spinner />
                    Analysing your workspace…
                  </div>
                </div>
              )}

              {messages.length <= 1 && (
                <div className="pt-2">
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.06em] text-text-muted">
                    Suggested prompts
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {mentorSuggestedPrompts.map((p) => (
                      <button
                        key={p}
                        onClick={() => send(p)}
                        data-testid={`mentor-prompt-${p.toLowerCase().replace(/\s+/g, "-")}`}
                        className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-[12px] text-text-secondary transition-colors duration-[140ms] hover:border-border-strong hover:bg-surface-hover hover:text-text-primary"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </div>
          </div>

          {/* Composer */}
          <div className="shrink-0 border-t border-border px-4 py-3 sm:px-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="mx-auto max-w-[720px]"
            >
              <div className="flex items-end gap-2 rounded-xl border border-border bg-surface p-2 transition-colors duration-[140ms] focus-within:border-accent">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  rows={1}
                  placeholder="Ask about your architecture, a diff, or your roadmap…"
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
              <p className="mt-1.5 text-center text-[10px] text-text-muted">
                Responses are generated from local dummy data in Phase-1.
              </p>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

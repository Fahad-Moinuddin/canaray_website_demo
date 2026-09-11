"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Alert, Badge, EmptyState } from "@/components/ui/Badge";
import { CONVERSATIONS, MESSAGES, formatDateTime } from "@/lib/mock-data";
import { delay } from "@/lib/storage";
import type { ChatMessage, MessageAttachmentStatus } from "@/lib/types";

type LocalMessage = ChatMessage;

export default function MessagesPage() {
  const [conversations] = useState(CONVERSATIONS);
  const [activeId, setActiveId] = useState(conversations[0]?.id ?? "");
  const [messages, setMessages] = useState<LocalMessage[]>(MESSAGES);
  const [text, setText] = useState("");
  const [forceFailNext, setForceFailNext] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const thread = useMemo(
    () =>
      messages
        .filter((m) => m.conversationId === activeId)
        .sort((a, b) => a.timestamp.localeCompare(b.timestamp)),
    [messages, activeId],
  );

  const active = conversations.find((c) => c.id === activeId);

  async function sendText() {
    if (!text.trim() || !activeId) return;
    const msg: LocalMessage = {
      id: `msg-local-${Date.now()}`,
      conversationId: activeId,
      sender: "Dr. Sarah Chen",
      senderRole: "dentist",
      body: text.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((m) => [...m, msg]);
    setText("");
  }

  async function simulateUpload(file: File) {
    if (!activeId) return;
    const id = `msg-upload-${Date.now()}`;
    const base: LocalMessage = {
      id,
      conversationId: activeId,
      sender: "Dr. Sarah Chen",
      senderRole: "dentist",
      body: `Attached ${file.name}`,
      timestamp: new Date().toISOString(),
      attachment: {
        name: file.name,
        sizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        status: "uploading",
        progress: 0,
      },
    };
    setMessages((m) => [...m, base]);

    const shouldFail = forceFailNext || file.name.toLowerCase().includes("fail");
    setForceFailNext(false);

    for (const progress of [18, 42, 67, 88]) {
      await delay(280);
      setMessages((all) =>
        all.map((m) =>
          m.id === id && m.attachment
            ? { ...m, attachment: { ...m.attachment, progress, status: "uploading" as const } }
            : m,
        ),
      );
    }

    await delay(350);
    const status: MessageAttachmentStatus = shouldFail ? "failed" : "uploaded";
    setMessages((all) =>
      all.map((m) =>
        m.id === id && m.attachment
          ? {
              ...m,
              attachment: {
                ...m.attachment,
                progress: shouldFail ? m.attachment.progress : 100,
                status,
              },
            }
          : m,
      ),
    );
  }

  async function retryUpload(messageId: string) {
    setMessages((all) =>
      all.map((m) =>
        m.id === messageId && m.attachment
          ? {
              ...m,
              attachment: { ...m.attachment, status: "uploading", progress: 0 },
            }
          : m,
      ),
    );
    for (const progress of [25, 55, 80, 100]) {
      await delay(250);
      setMessages((all) =>
        all.map((m) =>
          m.id === messageId && m.attachment
            ? {
                ...m,
                attachment: {
                  ...m.attachment,
                  progress,
                  status: progress === 100 ? "uploaded" : "uploading",
                },
              }
            : m,
        ),
      );
    }
  }

  return (
    <div className="animate-fade-up space-y-4">
      <div>
        <p className="text-sm font-medium text-accent">Messages</p>
        <h1 className="mt-1 font-display text-3xl text-ink">Office ↔ Canaray</h1>
        <p className="mt-2 text-sm text-muted">
          Uploads always show progress, success, or failure — never a silent fail.
        </p>
      </div>

      <Alert tone="accent" title="Demo upload tip">
        Attach any file to simulate upload. Name a file with &quot;fail&quot; (or toggle the button)
        to demonstrate a recoverable error with retry.
        <div className="mt-2">
          <Button
            size="sm"
            variant={forceFailNext ? "danger" : "secondary"}
            onClick={() => setForceFailNext((v) => !v)}
          >
            {forceFailNext ? "Next upload will fail" : "Force next upload to fail"}
          </Button>
        </div>
      </Alert>

      <div className="grid min-h-[560px] overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-sm)] lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-line lg:border-b-0 lg:border-r">
          <h2 className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted">
            Conversations
          </h2>
          {conversations.length === 0 ? (
            <div className="p-4">
              <EmptyState
                title="No conversations"
                description="When you message Canaray about a case, threads appear here."
              />
            </div>
          ) : (
            <ul>
              {conversations.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(c.id)}
                    className={`flex w-full flex-col gap-1 border-b border-line px-4 py-3 text-left ${
                      activeId === c.id ? "bg-accent-soft" : "hover:bg-background"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-ink">{c.title}</span>
                      {c.unread > 0 ? <Badge tone="warning">{c.unread}</Badge> : null}
                    </span>
                    <span className="text-xs text-muted">{formatDateTime(c.lastMessageAt)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <section className="flex min-h-[420px] flex-col">
          <header className="border-b border-line px-4 py-3">
            <h2 className="text-sm font-semibold text-ink">{active?.title ?? "Select a conversation"}</h2>
            <p className="text-xs text-muted">{active?.participants.join(" · ")}</p>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-background px-4 py-4">
            {thread.length === 0 ? (
              <EmptyState
                title="No messages yet"
                description="Send a note or attach a file to start the thread."
              />
            ) : (
              thread.map((m) => {
                const mine = m.senderRole === "dentist" || m.senderRole === "office";
                return (
                  <div
                    key={m.id}
                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm sm:max-w-[70%] ${
                        mine
                          ? "bg-accent text-white"
                          : "border border-line bg-surface text-ink"
                      }`}
                    >
                      <p className={`text-[11px] font-semibold ${mine ? "text-white/75" : "text-muted"}`}>
                        {m.sender}
                      </p>
                      <p className="mt-1 leading-relaxed">{m.body}</p>
                      {m.attachment ? (
                        <div
                          className={`mt-2 rounded-xl px-3 py-2 ${
                            mine ? "bg-white/15" : "bg-background"
                          }`}
                        >
                          <p className="text-xs font-semibold">{m.attachment.name}</p>
                          <p className={`text-[11px] ${mine ? "text-white/70" : "text-muted"}`}>
                            {m.attachment.sizeLabel}
                          </p>
                          {m.attachment.status === "uploading" ? (
                            <div className="mt-2">
                              <div className="h-1.5 overflow-hidden rounded-full bg-black/20">
                                <div
                                  className="h-full rounded-full bg-white transition-all"
                                  style={{ width: `${m.attachment.progress ?? 0}%` }}
                                />
                              </div>
                              <p className="mt-1 text-[11px]">
                                Uploading… {m.attachment.progress ?? 0}%
                              </p>
                            </div>
                          ) : null}
                          {m.attachment.status === "uploaded" ? (
                            <p className="mt-1 text-[11px] font-semibold text-emerald-200">
                              Uploaded successfully
                            </p>
                          ) : null}
                          {m.attachment.status === "failed" ? (
                            <div className="mt-2 space-y-1">
                              <p className={`text-[11px] font-semibold ${mine ? "text-amber-100" : "text-danger"}`}>
                                Upload failed — your message draft was kept.
                              </p>
                              <Button
                                size="sm"
                                variant={mine ? "soft" : "secondary"}
                                onClick={() => retryUpload(m.id)}
                              >
                                Retry upload
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                      <time
                        className={`mt-1 block text-[10px] ${mine ? "text-white/60" : "text-muted"}`}
                      >
                        {formatDateTime(m.timestamp)}
                      </time>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <footer className="border-t border-line p-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void sendText();
                  }
                }}
                placeholder="Write a message…"
                aria-label="Message"
                className="h-11 flex-1 rounded-xl border border-line bg-surface px-3.5 text-sm"
              />
              <div className="flex gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf,.stl,.ply"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void simulateUpload(file);
                    e.target.value = "";
                  }}
                />
                <Button variant="secondary" onClick={() => fileRef.current?.click()}>
                  Attach
                </Button>
                <Button onClick={() => void sendText()} disabled={!text.trim()}>
                  Send
                </Button>
              </div>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}

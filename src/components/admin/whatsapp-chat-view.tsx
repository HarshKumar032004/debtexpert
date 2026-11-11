"use client";

import * as React from "react";
import {
  Search,
  Phone,
  MessageCircle,
  ExternalLink,
  FolderOpen,
  Send,
  Check,
  CheckCheck,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  FileText,
  User,
  Scale,
  Calendar,
  X,
  Filter,
} from "lucide-react";
import { LeadDrawer } from "@/components/admin/lead-drawer";
import { calculateLeadScore } from "@/lib/lead-scoring";

export interface ConversationItem {
  id: string;
  referenceId: string;
  fullName: string;
  phone: string;
  city?: string | null;
  status: string;
  totalDebtRange?: string | null;
  harassmentLevel?: string | null;
  legalIssue: string;
  unreadCount: number;
  lastMessageAt: string;
  assignedTo?: { id: string; name: string } | null;
  whatsAppMessages?: Array<{
    id: string;
    content: string;
    direction: string;
    status: string;
    createdAt: string;
  }>;
}

export interface ChatMessage {
  id: string;
  leadId: string;
  direction: "INBOUND" | "OUTBOUND" | string;
  type: string;
  content: string;
  status: "SENT" | "DELIVERED" | "READ" | "FAILED" | string;
  errorMessage?: string | null;
  createdAt: string;
}

interface WhatsAppChatViewProps {
  initialConversations: ConversationItem[];
  initialActiveLeadId?: string | null;
  staffMembers: Array<{ id: string; name: string; role: string }>;
}

export function WhatsAppChatView({
  initialConversations,
  initialActiveLeadId,
  staffMembers,
}: WhatsAppChatViewProps) {
  const [conversations, setConversations] = React.useState<ConversationItem[]>(initialConversations);
  const [activeLeadId, setActiveLeadId] = React.useState<string | null>(
    initialActiveLeadId || (initialConversations[0]?.id ?? null)
  );
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = React.useState(false);
  const [inputText, setInputText] = React.useState("");
  const [sending, setSending] = React.useState(false);

  // Filters
  const [search, setSearch] = React.useState("");
  const [filterTab, setFilterTab] = React.useState<"ALL" | "UNREAD" | "HOT">("ALL");

  // CRM Drawer
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Scroll ref
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Dynamic Quick-Reply Templates
  const [quickTemplates, setQuickTemplates] = React.useState<Array<{ id: string; title: string; content: string }>>([
    {
      id: "fallback_1",
      title: "📋 Document Checklist",
      content: "Kindly share your loan sanction letters, latest statement of accounts, and any collection notices you have received.",
    },
    {
      id: "fallback_2",
      title: "⏰ Working Hours",
      content: "Our legal team is available Mon–Fri, 9 AM – 5 PM IST. Our senior advocate panel is actively auditing your loan portfolio.",
    },
    {
      id: "fallback_3",
      title: "⚖️ Notice Audit",
      content: "Please send a clear photo or PDF of the legal notice / Section 138 demand letter you received so our advocate can inspect the statutory timelines.",
    },
    {
      id: "fallback_4",
      title: "🛑 Direct Payment Warning",
      content: "CRITICAL WARNING: Never pay any recovery agent via personal UPI or cash. All legitimate settlement payments are made directly to the bank account against a verified OTS sanction letter.",
    },
  ]);

  React.useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch("/api/admin/templates?activeOnly=true");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.templates) && data.templates.length > 0) {
            setQuickTemplates(data.templates);
          }
        }
      } catch (err) {
        console.warn("Could not load dynamic templates, using default legal quick-replies:", err);
      }
    }
    fetchTemplates();
  }, []);


  // Active Lead Object
  const activeConversation = React.useMemo(() => {
    return conversations.find((c) => c.id === activeLeadId) || null;
  }, [conversations, activeLeadId]);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch messages for active lead
  const fetchMessages = React.useCallback(async (leadId: string, isSilent = false) => {
    if (!isSilent) setLoadingMessages(true);
    try {
      const res = await fetch(`/api/admin/whatsapp/messages?leadId=${leadId}`);
      const data = await res.json();
      if (data.success && data.messages) {
        setMessages((prev) => {
          // Retain any pending optimistic messages that haven't been reconciled yet
          const pendingOptimistic = prev.filter(
            (m) => m.id.startsWith("temp_") && m.leadId === leadId
          );
          return [...data.messages, ...pendingOptimistic];
        });
        // Clear unread badge in local state
        setConversations((prev) =>
          prev.map((c) => (c.id === leadId ? { ...c, unreadCount: 0 } : c))
        );
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      if (!isSilent) setLoadingMessages(false);
    }
  }, []);

  // Poll conversations roster
  const pollConversations = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/whatsapp/conversations");
      const data = await res.json();
      if (data.success && data.conversations) {
        setConversations(data.conversations);
      }
    } catch (err) {
      console.error("Error polling conversations:", err);
    }
  }, []);

  // Load messages when activeLeadId changes
  React.useEffect(() => {
    if (activeLeadId) {
      fetchMessages(activeLeadId);
    }
  }, [activeLeadId, fetchMessages]);

  // Scroll to bottom when messages change
  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Live polling interval (every 4s)
  React.useEffect(() => {
    const interval = setInterval(() => {
      pollConversations();
      if (activeLeadId) {
        fetchMessages(activeLeadId, true);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [activeLeadId, fetchMessages, pollConversations]);

  // Handle Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeLeadId || sending) return;

    // Sub-50ms Optimistic Message
    const tempId = `temp_${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      id: tempId,
      leadId: activeLeadId,
      direction: "OUTBOUND",
      type: "text",
      content: text,
      status: "SENT",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setInputText("");
    setSending(true);

    try {
      const res = await fetch("/api/admin/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: activeLeadId,
          messageText: text,
        }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        // Replace temp optimistic message with real DB message
        setMessages((prev) => {
          const hasTemp = prev.some((m) => m.id === tempId);
          if (hasTemp) {
            return prev.map((m) => (m.id === tempId ? data.message : m));
          }
          const alreadyHas = prev.some((m) => m.id === data.message.id);
          return alreadyHas ? prev : [...prev, data.message];
        });
      }
    } catch (err) {
      console.error("Error sending WhatsApp message:", err);
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, status: "FAILED" } : m))
      );
    } finally {
      setSending(false);
    }
  };

  // Keyboard shortcut: Enter to send, Shift+Enter for newline
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Filter conversations list
  const filteredConversations = React.useMemo(() => {
    return conversations.filter((c) => {
      // Search check
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          c.fullName.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.referenceId.toLowerCase().includes(q) ||
          (c.city && c.city.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Filter tabs
      if (filterTab === "UNREAD") return c.unreadCount > 0;
      if (filterTab === "HOT") return calculateLeadScore(c).tier === "HOT";

      return true;
    });
  }, [conversations, search, filterTab]);

  // Determine Meta 24-hour customer care session window
  const is24hWindowActive = React.useMemo(() => {
    if (!messages.length) return false;
    const lastInbound = [...messages]
      .reverse()
      .find((m) => m.direction === "INBOUND");
    if (!lastInbound) return false;

    const diffHours =
      (Date.now() - new Date(lastInbound.createdAt).getTime()) / (1000 * 60 * 60);
    return diffHours <= 24;
  }, [messages]);

  // Group messages by Date
  const groupedMessages = React.useMemo(() => {
    const groups: { [dateStr: string]: ChatMessage[] } = {};
    messages.forEach((msg) => {
      const dateKey = new Date(msg.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(msg);
    });
    return groups;
  }, [messages]);

  return (
    <div className="h-[calc(100vh-8.5rem)] flex rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
      {/* 1. LEFT PANE: Conversations Roster (320px - 380px) */}
      <div className="w-80 sm:w-96 border-r border-slate-800 bg-slate-950/60 flex flex-col shrink-0">
        {/* Roster Header & Search */}
        <div className="p-3.5 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-emerald-400" />
              <h2 className="font-extrabold text-sm text-white">WhatsApp Inbox</h2>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              v21.0 Cloud Desk
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search chat name, phone, or Ref ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-100 text-xs placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-[11px] font-semibold">
            <button
              onClick={() => setFilterTab("ALL")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterTab === "ALL"
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              All Chats
            </button>
            <button
              onClick={() => setFilterTab("UNREAD")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterTab === "UNREAD"
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilterTab("HOT")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterTab === "HOT"
                  ? "bg-red-500 text-white font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              Hot / Harassment
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => {
              const isSelected = conv.id === activeLeadId;
              const lastMsg = conv.whatsAppMessages?.[0];
              const score = calculateLeadScore(conv);

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveLeadId(conv.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-slate-800/80 border-l-4 border-amber-400"
                      : "hover:bg-slate-900/80"
                  }`}
                >
                  {/* Avatar / Scale Icon */}
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs uppercase">
                    {conv.fullName.slice(0, 2)}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xs text-white truncate">
                        {conv.fullName}
                      </h3>
                      <span className="text-[10px] text-slate-500 shrink-0">
                        {new Date(conv.lastMessageAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-[10px] text-amber-400 font-bold">
                        {conv.referenceId}
                      </span>
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                          score.tier === "HOT"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        {score.tier}
                      </span>
                    </div>

                    {/* Last message snippet */}
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] text-slate-400 truncate">
                        {lastMsg ? (
                          <>
                            {lastMsg.direction === "OUTBOUND" && (
                              <span className="text-slate-500 font-semibold mr-1">You:</span>
                            )}
                            {lastMsg.content}
                          </>
                        ) : (
                          "Case initialized"
                        )}
                      </p>

                      {conv.unreadCount > 0 && (
                        <span className="h-4 min-w-[16px] px-1 rounded-full bg-emerald-500 text-slate-950 font-mono font-extrabold text-[10px] flex items-center justify-center shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              No conversations found.
            </div>
          )}
        </div>
      </div>

      {/* 2. CENTER PANE: Active Chat Window */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col bg-slate-900/90 relative">
          {/* Active Chat Header */}
          <div className="h-16 px-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                {activeConversation.fullName.slice(0, 2)}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-extrabold text-sm text-white truncate">
                    {activeConversation.fullName}
                  </h2>
                  <span className="font-mono text-xs font-bold text-amber-400 px-1.5 rounded bg-slate-800">
                    {activeConversation.referenceId}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {activeConversation.status.replace("_", " ")}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>+{activeConversation.phone}</span>
                  {activeConversation.city && <span>📍 {activeConversation.city}</span>}
                  {activeConversation.totalDebtRange && (
                    <span className="text-slate-300 font-semibold">
                      💰 {activeConversation.totalDebtRange}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex items-center gap-2">
              <a
                href={`tel:${activeConversation.phone}`}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                title="Direct Phone Call"
              >
                <Phone className="h-4 w-4 text-emerald-400" />
              </a>

              <a
                href={`https://wa.me/${activeConversation.phone}?text=${encodeURIComponent(
                  `Hello ${activeConversation.fullName}, this is Advocate desk at Debt Support Expert regarding your Case Ref #${activeConversation.referenceId}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                title="Open Direct in WhatsApp Web"
              >
                <ExternalLink className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold border border-slate-700 transition-colors"
                title="Open 360° Case Portfolio"
              >
                <FolderOpen className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">CRM File</span>
              </button>
            </div>
          </div>

          {/* Meta 24-Hour Customer Care Window Banner */}
          <div
            className={`px-4 py-2 text-[11px] font-semibold border-b flex items-center justify-between ${
              is24hWindowActive
                ? "bg-emerald-950/40 border-emerald-900/60 text-emerald-300"
                : "bg-amber-950/40 border-amber-900/60 text-amber-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{is24hWindowActive ? "🟢" : "🟡"}</span>
              <span>
                {is24hWindowActive
                  ? "Meta 24h Session Window Active: Customer service free-form messaging enabled."
                  : "Meta 24h Session Window Inactive: Sending approved message template or direct WhatsApp."}
              </span>
            </div>
            <span className="text-[10px] font-mono opacity-80 hidden md:inline">
              Cloud API Policy Standard
            </span>
          </div>

          {/* Message Thread Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {loadingMessages && messages.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                Loading encrypted legal transcripts...
              </div>
            ) : Object.keys(groupedMessages).length > 0 ? (
              Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
                <div key={dateLabel} className="space-y-3">
                  {/* Date Badge */}
                  <div className="flex justify-center">
                    <span className="px-3 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400">
                      {dateLabel}
                    </span>
                  </div>

                  {/* Messages for this date */}
                  {msgs.map((msg) => {
                    const isOutbound = msg.direction === "OUTBOUND";

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOutbound ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3.5 text-xs shadow-md space-y-1 ${
                            isOutbound
                              ? "bg-emerald-950/90 border border-emerald-800/70 text-slate-100 rounded-tr-none"
                              : "bg-slate-950 border border-slate-800 text-slate-100 rounded-tl-none"
                          }`}
                        >
                          {/* Message Content */}
                          <p className="whitespace-pre-wrap leading-relaxed">
                            {msg.content}
                          </p>

                          {/* Footer: Timestamp & Delivery Status */}
                          <div
                            className={`flex items-center gap-1.5 text-[10px] justify-end ${
                              isOutbound ? "text-emerald-400/80" : "text-slate-500"
                            }`}
                          >
                            <span>
                              {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>

                            {isOutbound && (
                              <span>
                                {msg.status === "READ" ? (
                                  <CheckCheck className="h-3.5 w-3.5 text-emerald-400 inline" />
                                ) : msg.status === "DELIVERED" ? (
                                  <CheckCheck className="h-3.5 w-3.5 text-slate-400 inline" />
                                ) : msg.status === "FAILED" ? (
                                  <span title={msg.errorMessage || "Failed"}>
                                    <AlertCircle className="h-3.5 w-3.5 text-red-400 inline" />
                                  </span>
                                ) : (
                                  <Check className="h-3.5 w-3.5 text-slate-400 inline" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                No chat history yet. Send an opening message below.
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Legal Reply Action Bar */}
          <div className="p-2.5 bg-slate-950/70 border-t border-slate-800/80 overflow-x-auto flex items-center gap-2 text-xs shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 shrink-0">
              Quick Replies:
            </span>

            {quickTemplates.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => setInputText(tmpl.content)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap text-[11px] border transition-colors ${
                  tmpl.title.includes("Warning") || tmpl.title.includes("Direct Payment")
                    ? "bg-red-950/50 hover:bg-red-900/60 text-red-200 border-red-900"
                    : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700"
                }`}
              >
                {tmpl.title}
              </button>
            ))}
          </div>

          {/* Composer Box */}
          <div className="p-3 border-t border-slate-800 bg-slate-950 shrink-0">
            <div className="flex items-end gap-2.5">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your legal response... (Press Enter to send, Shift+Enter for new line)"
                rows={2}
                className="flex-1 p-3 rounded-xl border border-slate-800 bg-slate-900 text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400 placeholder:text-slate-600 resize-none"
              />

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={sending || !inputText.trim()}
                className="h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-emerald-950"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center space-y-2">
          <MessageCircle className="h-12 w-12 text-slate-700" />
          <h3 className="text-base font-bold text-slate-400">No Chat Selected</h3>
          <p className="text-xs max-w-sm">
            Select a borrower from the roster on the left to review encrypted WhatsApp transcripts and reply.
          </p>
        </div>
      )}

      {/* 360 Client Case Drawer */}
      <LeadDrawer
        leadId={activeLeadId}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        staffMembers={staffMembers}
        onLeadUpdated={(updated) => {
          if (updated.status && activeLeadId) {
            setConversations((prev) =>
              prev.map((c) =>
                c.id === activeLeadId ? { ...c, status: updated.status! } : c
              )
            );
          }
        }}
      />
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { Link, useParams, useLocation } from "wouter";
import { MessageCircle, Send, ArrowLeft, Search, Phone } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function MessagesPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) { setLocation("/login"); return; }
    const load = async () => {
      try {
        const data = await api.get("/conversations");
        setConversations(data.conversations || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  useEffect(() => {
    if (selectedConv) loadMessages(selectedConv.id);
  }, [selectedConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async (convId: string) => {
    try {
      const data = await api.get(`/conversations/${convId}/messages`);
      setMessages(data.messages || []);
    } catch (e) {
      console.error(e);
    }
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !selectedConv || sending) return;
    setSending(true);
    const text = newMsg;
    setNewMsg("");
    try {
      const msg = await api.post(`/conversations/${selectedConv.id}/messages`, { content: text });
      setMessages(prev => [...prev, msg]);
    } catch (e) {
      console.error(e);
      setNewMsg(text);
    } finally {
      setSending(false);
    }
  };

  const filteredConvs = conversations.filter(c => {
    const other = c.participants?.find((p: any) => p.id !== user?.id);
    return !search || other?.name?.toLowerCase().includes(search.toLowerCase());
  });

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 h-[calc(100vh-120px)]">
      <div className="flex h-full bg-card border border-card-border rounded-2xl overflow-hidden shadow-lg">
        {/* Sidebar — conversations list */}
        <div className={`${selectedConv ? "hidden sm:flex" : "flex"} flex-col w-full sm:w-72 border-r border-border`}>
          <div className="p-4 border-b border-border">
            <h2 className="font-black text-base mb-3">Messages</h2>
            <div className="flex items-center gap-2 bg-background border border-input rounded-lg px-3 py-2">
              <Search size={13} className="text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="flex-1 text-sm outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-muted rounded w-1/2" />
                      <div className="h-3 bg-muted rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConvs.length === 0 ? (
              <div className="text-center py-12 px-4">
                <MessageCircle size={32} className="text-muted-foreground mx-auto mb-2 opacity-30" />
                <p className="text-sm text-muted-foreground">No conversations yet</p>
                <p className="text-xs text-muted-foreground mt-1">Book a service to start chatting</p>
              </div>
            ) : (
              filteredConvs.map(conv => {
                const other = conv.participants?.find((p: any) => p.id !== user.id);
                const last = conv.lastMessage;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConv(conv)}
                    className={`w-full flex items-center gap-3 p-3 hover:bg-muted transition-all text-left border-b border-border/50 ${selectedConv?.id === conv.id ? "bg-muted" : ""}`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {other?.name?.charAt(0) || "?"}
                      </div>
                      {other?.isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold truncate">{other?.name || "Unknown"}</span>
                        {last && <span className="text-xs text-muted-foreground">{new Date(last.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>}
                      </div>
                      {last && <p className="text-xs text-muted-foreground truncate">{last.content}</p>}
                    </div>
                    {conv.unreadCount > 0 && (
                      <div className="w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center font-bold shrink-0">
                        {conv.unreadCount}
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat area */}
        {selectedConv ? (
          <div className="flex-1 flex flex-col">
            {/* Chat header */}
            {(() => {
              const other = selectedConv.participants?.find((p: any) => p.id !== user.id);
              return (
                <div className="flex items-center gap-3 p-4 border-b border-border">
                  <button onClick={() => setSelectedConv(null)} className="sm:hidden text-muted-foreground hover:text-foreground">
                    <ArrowLeft size={18} />
                  </button>
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {other?.name?.charAt(0)}
                    </div>
                    {other?.isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">{other?.name}</div>
                    <div className="text-xs text-muted-foreground">{other?.isOnline ? "Online" : "Offline"}</div>
                  </div>
                  {other?.phone && (
                    <a href={`tel:${other.phone}`} className="p-2 hover:bg-muted rounded-lg transition-all">
                      <Phone size={16} className="text-muted-foreground" />
                    </a>
                  )}
                </div>
              );
            })()}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => {
                const isMine = msg.senderId === user.id;
                return (
                  <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${isMine ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-foreground rounded-bl-none"}`}>
                      {msg.content}
                      <div className={`text-xs mt-1 ${isMine ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMsg.trim() || sending}
                  className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden sm:flex flex-1 items-center justify-center">
            <div className="text-center">
              <MessageCircle size={48} className="text-muted-foreground mx-auto mb-3 opacity-30" />
              <h3 className="font-bold text-muted-foreground">Select a conversation</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

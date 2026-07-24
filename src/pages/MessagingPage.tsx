import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ChatBox from "@/components/messaging/ChatBox";
import { getConversations, getMessages, sendMessage, Conversation, markAllConversationsRead } from "@/api/conversations";
import { markMessagesAsRead } from "@/api/messages";
import { MessageSquare, Search } from "lucide-react";
import { toast } from "sonner";

const MessagingPage = ({ role = "client" }: { role?: "client" | "operator" }) => {
  const userId = role === "operator" ? "op1" : "user1";
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => getConversations(),
    refetchInterval: 10000,
  });

  const selectedConv = conversations.find((c) => c.id === selectedId);

  const { data: messages = [] } = useQuery({
    queryKey: ["conversation-messages", selectedId],
    queryFn: () => getMessages(selectedId!),
    enabled: !!selectedId,
    refetchInterval: 5000,
  });

  const sendMutation = useMutation({
    mutationFn: (body: string) => sendMessage(selectedId!, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversation-messages", selectedId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: () => toast.error("Failed to send message"),
  });

  const filtered = conversations.filter((c) =>
    c.subject.toLowerCase().includes(search.toLowerCase()) ||
    c.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
    c.clientName.toLowerCase().includes(search.toLowerCase())
  );

  const priorityColors: Record<string, string> = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-warning text-warning-foreground",
    high: "bg-destructive text-destructive-foreground",
  };

  useEffect(() => {
    if (selectedId) {
      markMessagesAsRead(selectedId).then(() => {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      });
    }
  }, [selectedId, queryClient]);

  const chatMessages = messages.map((m) => ({
    id: m.id,
    senderId: m.senderId || "",
    senderName: m.sender?.name || (m.senderRole === "client" ? "You" : "Support"),
    senderRole: m.senderRole,
    content: m.body,
    timestamp: m.createdAt,
    read: m.readAt !== null,
  }));

  return (
    <DashboardLayout role={role}>
      <div className="flex h-full">
        <div className="w-80 border-r border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border space-y-2">
            <h2 className="font-display font-semibold">Conversations</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {filtered.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`w-full text-left p-4 border-b border-border hover:bg-muted/50 transition-colors ${
                  selectedId === conv.id ? "bg-muted" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm truncate">{conv.subject}</span>
                  {conv.unreadCount > 0 && (
                    <Badge className="gradient-accent text-accent-foreground border-0 text-xs">{conv.unreadCount}</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-mono">{conv.trackingNumber}</p>
                {role === "operator" && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{conv.clientName}</span>
                    <Badge className={`${priorityColors[conv.priority]} border-0 text-[10px]`}>{conv.priority}</Badge>
                  </div>
                )}
                <p className="text-xs text-muted-foreground truncate mt-1">{conv.lastMessage}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedConv ? (
            <>
              <div className="p-4 border-b border-border bg-card">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-semibold">{selectedConv.subject}</h3>
                    <p className="text-xs text-muted-foreground">{selectedConv.trackingNumber} • {selectedConv.clientName}</p>
                  </div>
                  <Badge className="bg-accent text-accent-foreground border-0">Open</Badge>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <ChatBox
                  messages={chatMessages}
                  currentUserId={userId}
                  onSend={(content) => sendMutation.mutate(content)}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Select a conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagingPage;

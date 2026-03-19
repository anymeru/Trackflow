import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ChatBox from "@/components/messaging/ChatBox";
import { mockConversations } from "@/data/mockData";
import { MessageSquare } from "lucide-react";

const MessagingPage = ({ role = "client" }: { role?: "client" | "operator" }) => {
  const [selectedId, setSelectedId] = useState<string | null>(mockConversations[0]?.id || null);
  const selected = mockConversations.find((c) => c.id === selectedId);

  const priorityColors: Record<string, string> = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-warning text-warning-foreground",
    high: "bg-destructive text-destructive-foreground",
  };

  return (
    <DashboardLayout role={role}>
      <div className="flex h-full">
        {/* Conversation list */}
        <div className="w-80 border-r border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="font-display font-semibold">Conversations</h2>
          </div>
          <div className="flex-1 overflow-auto">
            {mockConversations.map((conv) => (
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

        {/* Chat */}
        <div className="flex-1 flex flex-col">
          {selected ? (
            <>
              <div className="p-4 border-b border-border bg-card">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-semibold">{selected.subject}</h3>
                    <p className="text-xs text-muted-foreground">{selected.trackingNumber} • {selected.clientName}</p>
                  </div>
                  <Badge className={`${selected.status === "resolved" ? "bg-success text-success-foreground" : "bg-accent text-accent-foreground"} border-0`}>
                    {selected.status === "resolved" ? "Résolu" : selected.status === "pending" ? "En attente" : "Ouvert"}
                  </Badge>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <ChatBox messages={selected.messages} currentUserId={role === "operator" ? "op1" : "user1"} />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Sélectionnez une conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagingPage;

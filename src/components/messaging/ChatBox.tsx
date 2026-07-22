import { useEffect, useRef, useState } from "react";
import { Message } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatBoxProps {
  messages: Message[];
  currentUserId?: string;
}

const ChatBox = ({ messages, currentUserId = "user1" }: ChatBoxProps) => {
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState(messages);

  // Sync when the parent switches to a different conversation
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [localMessages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setLocalMessages([
      ...localMessages,
      {
        id: `m-${Date.now()}`,
        senderId: currentUserId,
        senderName: "Vous",
        senderRole: "client",
        content: input,
        timestamp: new Date().toISOString(),
        read: true,
      },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-3">
        {localMessages.map((msg) => {
          const isOwn = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                isOwn
                  ? "gradient-accent text-accent-foreground rounded-br-sm"
                  : "bg-muted text-foreground rounded-bl-sm"
              }`}>
                {!isOwn && <p className="text-xs font-semibold mb-1 opacity-70">{msg.senderName}</p>}
                <p className="text-sm">{msg.content}</p>
                <p className={`text-[10px] mt-1 ${isOwn ? "text-accent-foreground/60" : "text-muted-foreground"}`}>
                  {new Date(msg.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-border p-3 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Votre message..."
          className="flex-1"
        />
        <Button variant="accent" size="icon" onClick={handleSend}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatBox;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Package, Clock, CheckCircle, CreditCard, AlertTriangle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getConversations, markAllConversationsRead, Conversation } from "@/api/conversations";

const typeIcons: Record<string, React.ReactNode> = {
  message: <MessageSquare className="w-4 h-4 text-info" />,
};

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => getConversations(),
    refetchInterval: 10000,
    enabled: open,
  });

  const unreadCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const notifications = conversations
    .filter((c) => c.unreadCount > 0)
    .map((c) => ({
      id: c.id,
      title: c.subject,
      message: c.lastMessage,
      time: c.lastMessageTime,
      link: `/${window.location.pathname.includes("operator") ? "operator" : window.location.pathname.includes("admin") ? "admin" : "dashboard"}/messages`,
      read: false,
    }));

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const markAllRead = async () => {
    await markAllConversationsRead();
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold min-w-[18px] h-[18px]">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b border-border flex items-center justify-between">
          <h3 className="font-display font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={markAllRead}>
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">No notifications</p>
          ) : (
            notifications.map((notif) => (
              <button
                key={notif.id}
                onClick={() => { navigate(notif.link); setOpen(false); }}
                className="w-full text-left p-3 flex gap-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0 bg-accent/5"
              >
                <div className="shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4 text-info" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{notif.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{timeAgo(notif.time)}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1.5" />
              </button>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;

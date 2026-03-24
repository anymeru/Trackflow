import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Package, Clock, CheckCircle, CreditCard, AlertTriangle, RotateCcw, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockNotifications, type AppNotification } from "@/data/mockData";

const typeIcons: Record<string, React.ReactNode> = {
  status_change: <Package className="w-4 h-4 text-accent" />,
  eta_update: <Clock className="w-4 h-4 text-warning" />,
  delivery: <CheckCircle className="w-4 h-4 text-success" />,
  fees: <CreditCard className="w-4 h-4 text-warning" />,
  incident: <AlertTriangle className="w-4 h-4 text-destructive" />,
  return: <RotateCcw className="w-4 h-4 text-info" />,
  message: <MessageSquare className="w-4 h-4 text-info" />,
};

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleClick = (notif: AppNotification) => {
    setNotifications(notifications.map((n) => n.id === notif.id ? { ...n, read: true } : n));
    if (notif.link) navigate(notif.link);
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}j`;
  };

  return (
    <Popover>
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
              Tout marquer lu
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">Aucune notification</p>
          ) : (
            notifications.map((notif) => (
              <button
                key={notif.id}
                onClick={() => handleClick(notif)}
                className={`w-full text-left p-3 flex gap-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0 ${!notif.read ? "bg-accent/5" : ""}`}
              >
                <div className="shrink-0 mt-0.5">{typeIcons[notif.type]}</div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm ${!notif.read ? "font-medium" : ""}`}>{notif.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{timeAgo(notif.createdAt)}</p>
                </div>
                {!notif.read && <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1.5" />}
              </button>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;

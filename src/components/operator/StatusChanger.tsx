import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { statusLabels } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";

interface StatusChangerProps {
  currentStatus: string;
  trackingNumber: string;
  onStatusChange?: (newStatus: string) => void;
}

const allowedStatuses = [
  "created", "picked_up", "in_transit", "out_for_delivery",
  "delivered", "delayed", "lost", "customs_hold",
  "fees_pending", "fees_paid", "returned",
];

const StatusChanger = ({ currentStatus, trackingNumber, onStatusChange }: StatusChangerProps) => {
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [comment, setComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdate = () => {
    if (newStatus === currentStatus && !comment) return;
    toast({
      title: "Statut mis à jour",
      description: `Le tracking ${trackingNumber} est maintenant "${statusLabels[newStatus]}".`,
    });
    onStatusChange?.(newStatus);
    setComment("");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <RefreshCw className="w-4 h-4 mr-1" />
        Changer le statut
      </Button>
    );
  }

  return (
    <div className="border border-border rounded-lg p-3 space-y-3 bg-muted/30">
      <div className="flex items-center gap-2">
        <RefreshCw className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Modifier le statut</span>
      </div>
      <Select value={newStatus} onValueChange={setNewStatus}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {allowedStatuses.map((s) => (
            <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Textarea
        placeholder="Commentaire interne (optionnel)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={handleUpdate}>
          Mettre à jour
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Annuler
        </Button>
      </div>
    </div>
  );
};

export default StatusChanger;

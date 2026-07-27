import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { STATUS_LABELS } from "@/components/tracking/StatusBadge";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

interface StatusChangerProps {
  currentStatus: string;
  trackingNumber: string;
  onStatusChange?: (newStatus: string, reason: string) => void;
}

const allowedStatuses = [
  "in_transit",
  "out_for_delivery",
  "delivered",
  "delayed",
  "customs_hold",
  "fees_pending",
  "returned",
  "lost",
];

const StatusChanger = ({ currentStatus, trackingNumber, onStatusChange }: StatusChangerProps) => {
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [reason, setReason] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdate = () => {
    if (!reason.trim()) {
      toast.error("Reason is required");
      return;
    }
    toast.success(`Status updated for ${trackingNumber}`);
    onStatusChange?.(newStatus, reason);
    setReason("");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <RefreshCw className="w-4 h-4 mr-1" />
        Change Status
      </Button>
    );
  }

  return (
    <div className="border border-border rounded-lg p-3 space-y-3 bg-muted/30">
      <div className="flex items-center gap-2">
        <RefreshCw className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Edit Status</span>
      </div>
      <Select value={newStatus} onValueChange={setNewStatus}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {allowedStatuses.map((s) => (
            <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Textarea
        placeholder="Reason required..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={2}
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={handleUpdate} disabled={!reason.trim()}>
          Update
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default StatusChanger;

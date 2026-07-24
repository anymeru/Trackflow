import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RotateCcw, Plus, Package } from "lucide-react";
import { returnReasonLabels, type ReturnRequest } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

interface ReturnRequestBlockProps {
  returns: ReturnRequest[];
  trackingId: string;
  canReturn: boolean;
}

const returnStatusLabels: Record<string, string> = {
  requested: "Requested",
  approved: "Approved",
  in_transit: "Return In Progress",
  received: "Received",
  refunded: "Refunded",
  rejected: "Refused",
};

const returnStatusColors: Record<string, string> = {
  requested: "bg-warning text-warning-foreground",
  approved: "bg-info text-info-foreground",
  in_transit: "bg-accent text-accent-foreground",
  received: "bg-success text-success-foreground",
  refunded: "bg-success text-success-foreground",
  rejected: "bg-destructive text-destructive-foreground",
};

const ReturnRequestBlock = ({ returns, trackingId, canReturn }: ReturnRequestBlockProps) => {
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!reason || !description) return;
    toast({
      title: "Return Request Submitted",
      description: "Your request will be reviewed within 24-48h. You will receive a notification.",
    });
    setShowForm(false);
    setReason("");
    setDescription("");
  };

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-info" />
          <h2 className="font-display font-semibold">Returns</h2>
        </div>
        {canReturn && !showForm && (
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Request Return
          </Button>
        )}
      </div>

      {returns.length > 0 && (
        <div className="space-y-3">
          {returns.map((ret) => (
            <div key={ret.id} className="border border-border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{returnReasonLabels[ret.reason]}</span>
                <Badge className={`${returnStatusColors[ret.status]} border-0 text-xs`}>
                  {returnStatusLabels[ret.status]}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{ret.description}</p>
              {ret.returnTrackingNumber && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Package className="w-3 h-3" />
                  <span>Return: {ret.returnTrackingNumber}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {returns.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground">
          {canReturn ? "No return requests." : "Return is not available for this status."}
        </p>
      )}

      {showForm && (
        <div className="space-y-3 border border-border rounded-lg p-3">
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger>
              <SelectValue placeholder="Return Reason" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(returnReasonLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Describe the reason for return..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSubmit} disabled={!reason || !description}>
              Submit Request
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ReturnRequestBlock;

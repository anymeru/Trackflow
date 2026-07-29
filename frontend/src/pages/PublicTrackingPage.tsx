import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import StatusBadge from "@/components/tracking/StatusBadge";
import TrackingMap from "@/components/tracking/TrackingMap";
import TrackingTimeline from "@/components/tracking/TrackingTimeline";
import ETABlock from "@/components/tracking/ETABlock";
import { getPublicTracking, computeProgress } from "@/api/trackings";
import { openDisputePublic } from "@/api/disputes";
import { getMessagesPublic, sendMessagePublic, Message } from "@/api/messages";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Truck, MessageSquare, AlertTriangle, Send } from "lucide-react";
import { toast } from "sonner";

const MESSAGING_STATUSES = ["delayed", "customs_hold", "fees_pending", "lost"];

function DisputeDialog({
  trackingId,
  open,
  onOpenChange,
}: {
  trackingId: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      openDisputePublic({
        trackingId,
        reason,
        description,
      }),
    onSuccess: () => {
      toast.success("Dispute opened successfully");
      setReason("");
      setDescription("");
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border border-black/[0.04] rounded-[1rem]">
        <DialogHeader>
          <DialogTitle>Open a Dispute</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Reason</label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="damaged_package">Damaged package</SelectItem>
                <SelectItem value="lost_package">Lost package</SelectItem>
                <SelectItem value="wrong_item">Wrong item</SelectItem>
                <SelectItem value="delivery_delay">Delivery delay</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Describe the issue (min. 10 characters)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <p className="text-xs text-gray-400">
            You can create an account later to track your dispute status.
          </p>
          <Button
            className="w-full rounded-full transition-all duration-500 ease-out-expo"
            onClick={() => mutation.mutate()}
            disabled={!reason || description.length < 10 || mutation.isPending}
          >
            {mutation.isPending ? "Sending..." : "Open Dispute"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ChatPanel({ trackingId, status }: { trackingId: string; status: string }) {
  const [newMsg, setNewMsg] = useState("");

  const { data: messages = [] } = useQuery({
    queryKey: ["public-messages", trackingId],
    queryFn: () => getMessagesPublic(trackingId),
    enabled: !!trackingId && MESSAGING_STATUSES.includes(status),
    refetchInterval: 5000,
  });

  const sendMsg = useMutation({
    mutationFn: () => sendMessagePublic(trackingId, newMsg),
    onSuccess: () => {
      setNewMsg("");
    },
  });

  if (!MESSAGING_STATUSES.includes(status)) {
    return (
      <div className="p-[1px] rounded-[2rem] bg-black/[0.03]">
        <div className="rounded-[calc(2rem-1px)] bg-white p-5 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)]">
          <p className="text-gray-500 text-sm">
            Messaging is available when the shipment requires special attention.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-[1px] rounded-[2rem] bg-black/[0.03]">
      <div className="rounded-[calc(2rem-1px)] bg-white p-5 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)]">
        <h2 className="font-display font-semibold mb-4 flex items-center gap-2 tracking-tight">
          <MessageSquare className="w-4 h-4" />
          Messages
        </h2>
        <div className="space-y-2 max-h-60 overflow-y-auto mb-3">
          {messages.length === 0 && (
            <p className="text-sm text-gray-400">No messages yet.</p>
          )}
          {messages.map((msg: Message) => (
            <div
              key={msg.id}
              className={`p-2 rounded-xl text-sm ${
                msg.senderRole === "admin" || msg.senderRole === "operator"
                  ? "bg-primary/10 ml-4"
                  : "bg-black/5 mr-4"
              }`}
            >
              <p className="font-medium text-xs text-gray-500">
                {msg.senderRole === "admin" ? "Support" : "You"}
              </p>
              <p>{msg.body}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Your message..."
            onKeyDown={(e) => e.key === "Enter" && newMsg && sendMsg.mutate()}
          />
          <Button
            size="sm"
            onClick={() => sendMsg.mutate()}
            disabled={!newMsg || sendMsg.isPending}
            className="rounded-full transition-all duration-500 ease-out-expo"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

const PublicTrackingPage = () => {
  const { id } = useParams();
  const [showDispute, setShowDispute] = useState(false);

  const { data: tracking, isLoading } = useQuery({
    queryKey: ["public-tracking", id],
    queryFn: () => getPublicTracking(id!),
    enabled: !!id,
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-6 h-6 rounded-full border-2 border-black/10 border-t-black/60 animate-spin" />
      </div>
    );
  }

  if (!tracking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="p-[1px] rounded-[2rem] bg-black/[0.03] max-w-md w-full">
          <div className="rounded-[calc(2rem-1px)] bg-white p-10 text-center shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)]">
            <Truck className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <h1 className="text-xl font-semibold tracking-tight mb-2">Tracking not found</h1>
            <p className="text-sm text-gray-500">This tracking link is invalid or has expired.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-black/[0.04] bg-white/80 backdrop-blur-2xl">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <img src="/trace-logo.svg" alt="TRACE" className="h-7 w-auto" />
          <span className="font-semibold text-lg tracking-tight">TRACE</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h1 className="text-xl font-semibold tracking-tight">{tracking.clientName}</h1>
            <StatusBadge status={tracking.status} />
          </div>
          <p className="text-sm text-gray-500 font-mono">{tracking.trackingNumber}</p>
        </div>

        <div className="p-[1px] rounded-[2rem] bg-black/[0.03]">
          <div className="rounded-[calc(2rem-1px)] bg-white p-5 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)]">
            <ETABlock
              eta={tracking.eta ?? null}
              status={tracking.status}
              progressPercent={computeProgress(tracking)}
              originAddress={tracking.originAddress ?? undefined}
              destinationAddress={tracking.destinationAddress ?? undefined}
            />
          </div>
        </div>

        <div className="h-[300px] rounded-[2rem] overflow-hidden border border-black/[0.04]">
          <TrackingMap items={[tracking]} selectedId={tracking.id} showRoute className="h-full" />
        </div>

        <ChatPanel trackingId={tracking.id} status={tracking.status} />

        <div className="p-[1px] rounded-[2rem] bg-black/[0.03]">
          <div className="rounded-[calc(2rem-1px)] bg-white p-6 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)]">
            <h2 className="font-display font-semibold mb-4 tracking-tight">Information</h2>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="text-gray-500">Origin:</span>
                <span className="font-medium text-gray-900">{tracking.originAddress || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 shrink-0 text-gray-700" />
                <span className="text-gray-500">Destination:</span>
                <span className="font-medium text-gray-900">{tracking.destinationAddress || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Truck className="w-4 h-4 shrink-0" />
                <span className="text-gray-500">Carrier:</span>
                <span className="font-medium text-gray-900">{tracking.carrierRef || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Truck className="w-4 h-4 shrink-0" />
                <span className="text-gray-500">Description:</span>
                <span className="font-medium text-gray-900">{tracking.packageDescription || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-red-300 text-red-600 hover:bg-red-50 rounded-full transition-all duration-500 ease-out-expo"
            onClick={() => setShowDispute(true)}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Open a Dispute
          </Button>
        </div>

        <div className="p-[1px] rounded-[2rem] bg-black/[0.03]">
          <div className="rounded-[calc(2rem-1px)] bg-white p-6 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)]">
            <h2 className="font-display font-semibold mb-4 tracking-tight">History</h2>
            <TrackingTimeline events={tracking.statusHistory || []} />
          </div>
        </div>

        <p className="text-xs text-center text-gray-400 pb-4">
          Tracking provided by TRACE
        </p>
      </main>

      <DisputeDialog trackingId={tracking.id} open={showDispute} onOpenChange={setShowDispute} />
    </div>
  );
};

export default PublicTrackingPage;

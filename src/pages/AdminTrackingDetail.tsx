import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Clock, MessageSquare, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TrackingMap from "@/components/tracking/TrackingMap";
import { getTracking, updateStatus, updatePosition, Tracking, computeProgress } from "@/api/trackings";
import { getMessages, sendMessage, markMessagesAsRead, Message } from "@/api/messages";
import { getDisputes, openDispute, resolveDispute, Dispute } from "@/api/disputes";
import { toast } from "sonner";

const STATUS_LABELS: Record<string, string> = {
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  delayed: "Delayed",
  customs_hold: "Customs Hold",
  fees_pending: "Fees Pending",
  returned: "Returned",
  lost: "Lost",
};

const STATUS_COLORS: Record<string, string> = {
  in_transit: "bg-cyan-500",
  out_for_delivery: "bg-blue-500",
  delivered: "bg-green-500",
  delayed: "bg-amber-500",
  customs_hold: "bg-orange-500",
  fees_pending: "bg-amber-700",
  returned: "bg-purple-500",
  lost: "bg-red-500",
};

function ChatPanel({
  trackingId,
  status,
}: {
  trackingId: string;
  status: string;
}) {
  const [newMsg, setNewMsg] = useState("");
  const queryClient = useQueryClient();

  const { data: messages } = useQuery({
    queryKey: ["messages", trackingId],
    queryFn: () => getMessages(trackingId),
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (messages && messages.length > 0) {
      markMessagesAsRead(trackingId);
    }
  }, [trackingId, messages?.length]);

  const sendMsg = useMutation({
    mutationFn: () => sendMessage(trackingId, newMsg),
    onSuccess: () => {
      setNewMsg("");
      queryClient.invalidateQueries({ queryKey: ["messages", trackingId] });
    },
  });

  if (!["delayed", "customs_hold", "fees_pending", "lost"].includes(status)) {
    return (
      <Card className="p-4 text-muted-foreground text-sm">
        Messaging is available when the shipment requires special attention.
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        Messages
      </h3>
      <div className="space-y-2 max-h-60 overflow-y-auto mb-3">
        {messages?.map((msg: Message) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg text-sm ${
              msg.senderRole === "admin" || msg.senderRole === "operator"
                ? "bg-primary/10 ml-4"
                : "bg-muted mr-4"
            }`}
          >
            <p className="font-medium text-xs text-muted-foreground">
              {msg.senderRole === "admin" ? "Admin" : "Client"}
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
          onKeyDown={(e) => e.key === "Enter" && sendMsg.mutate()}
        />
        <Button size="sm" onClick={() => sendMsg.mutate()} disabled={!newMsg}>
          Send
        </Button>
      </div>
    </Card>
  );
}

function DisputePanel({ trackingId }: { trackingId: string }) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [response, setResponse] = useState("");
  const queryClient = useQueryClient();

  const { data: disputes } = useQuery({
    queryKey: ["disputes", trackingId],
    queryFn: () => getDisputes(trackingId),
  });

  const open = useMutation({
    mutationFn: () => openDispute(trackingId, { reason, description }),
    onSuccess: () => {
      toast.success("Dispute opened");
      setReason("");
      setDescription("");
      queryClient.invalidateQueries({ queryKey: ["disputes", trackingId] });
    },
  });

  const resolve = useMutation({
    mutationFn: async (disputeId: string) => {
      const result = await resolveDispute(disputeId, response);
      await sendMessage(trackingId, `✅ Dispute resolved: ${result.adminResponse}`);
      return result;
    },
    onSuccess: () => {
      toast.success("Dispute resolved");
      setResponse("");
      queryClient.invalidateQueries({ queryKey: ["disputes", trackingId] });
      queryClient.invalidateQueries({ queryKey: ["messages", trackingId] });
    },
  });

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        Disputes
      </h3>

      {disputes?.map((d: Dispute) => (
        <div key={d.id} className="mb-3 p-3 border rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <Badge variant={d.status === "open" ? "destructive" : "default"}>
              {d.status === "open" ? "Open" : "Resolved"}
            </Badge>
          </div>
          <p className="font-medium text-sm">{d.reason}</p>
          <p className="text-sm text-muted-foreground">{d.description}</p>
          {d.status === "open" && (
            <div className="mt-2 space-y-2">
              <Textarea
                placeholder="Admin response..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              />
              <Button
                size="sm"
                onClick={() => resolve.mutate(d.id)}
                disabled={!response || resolve.isPending}
              >
                Resolve Dispute
              </Button>
            </div>
          )}
          {d.adminResponse && (
            <div className="mt-2 p-2 bg-muted rounded text-sm">
              <span className="font-medium">Response: </span>
              {d.adminResponse}
            </div>
          )}
        </div>
      ))}
    </Card>
  );
}

export default function AdminTrackingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [position, setPosition] = useState(50);
  const [newStatus, setNewStatus] = useState("");
  const [statusReason, setStatusReason] = useState("");

  const { data: tracking, isLoading } = useQuery({
    queryKey: ["tracking", id],
    queryFn: () => getTracking(id!),
    enabled: !!id,
    refetchInterval: 5000,
  });

  const progress = tracking ? computeProgress(tracking) : 0;

  useEffect(() => {
    if (tracking) setPosition(progress);
  }, [tracking?.currentLat, tracking?.currentLng]);

  const updateStatusMutation = useMutation({
    mutationFn: () =>
      updateStatus(id!, { status: newStatus, reason: statusReason }),
    onSuccess: () => {
      toast.success("Status updated");
      setNewStatus("");
      setStatusReason("");
      queryClient.invalidateQueries({ queryKey: ["tracking", id] });
    },
  });

  const updatePosMutation = useMutation({
    mutationFn: (progress: number) => updatePosition(id!, progress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracking", id] });
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex justify-center p-8">Loading...</div>
      </DashboardLayout>
    );
  }

  if (!tracking) {
    return (
      <DashboardLayout role="admin">
        <div className="p-8">Tracking not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/trackings")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{tracking.trackingNumber}</h1>
            <p className="text-muted-foreground">{tracking.clientName}</p>
          </div>
          <Badge
            className={`${STATUS_COLORS[tracking.status] || "bg-gray-500"} text-white ml-auto`}
          >
            {STATUS_LABELS[tracking.status] || tracking.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Position
              </h3>
              <div className="h-[300px] rounded-lg overflow-hidden mb-4">
                <TrackingMap
                  items={[tracking]}
                  selectedId={tracking.id}
                  showRoute={true}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Progress: {position}%
                </label>
                <Slider
                  value={[position]}
                  onValueChange={([val]) => {
                    setPosition(val);
                    updatePosMutation.mutate(val);
                  }}
                  min={0}
                  max={100}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{tracking.originAddress || "Origin"}</span>
                  <span>{tracking.destinationAddress || "Destination"}</span>
                </div>
              </div>
            </Card>

            <ChatPanel trackingId={tracking.id} status={tracking.status} />
            <DisputePanel trackingId={tracking.id} />
          </div>

          <div className="space-y-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Status Control
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">New Status</label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Reason (required)</label>
                  <Textarea
                    placeholder="Ex: Missing customs document..."
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={() => updateStatusMutation.mutate()}
                  disabled={
                    !newStatus || !statusReason || updateStatusMutation.isPending
                  }
                >
                  Update Status
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client</span>
                  <span>{tracking.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>{tracking.clientEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Origin</span>
                  <span className="text-right">{tracking.originAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Destination</span>
                  <span className="text-right">{tracking.destinationAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Description</span>
                  <span>{tracking.packageDescription || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weight</span>
                  <span>{tracking.weight ? `${tracking.weight} kg` : "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Speed</span>
                  <span>{tracking.avgSpeedKmh} km/h</span>
                </div>
                {tracking.eta && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ETA</span>
                    <span>
                      {new Date(tracking.eta).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import TrackingMap from "@/components/tracking/TrackingMap";
import TrackingTimeline from "@/components/tracking/TrackingTimeline";
import { TimelineSkeleton, MapSkeleton } from "@/components/tracking/DashboardSkeleton";
import StatusBadge from "@/components/tracking/StatusBadge";
import ETABlock from "@/components/tracking/ETABlock";
import ChatBox from "@/components/messaging/ChatBox";
import { getTracking, Tracking, computeProgress } from "@/api/trackings";
import { getMessages, sendMessage, markMessagesAsRead, Message } from "@/api/messages";
import { getDisputes, openDispute, Dispute } from "@/api/disputes";
import { useAuth } from "@/context/AuthContext";
import { Conversation } from "@/api/conversations";
import { getSettings } from "@/api/settings";
import {
  ArrowLeft, MapPin, Truck, Calendar, MessageSquare,
  Phone, Send, AlertTriangle, Smartphone,
} from "lucide-react";
import { toast } from "sonner";

const MESSAGING_STATUSES = ["delayed", "customs_hold", "fees_pending", "lost"];
const WHATSAPP_STATUSES = ["customs_hold", "fees_pending", "lost"];

function WhatsAppModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");

  useEffect(() => {
    if (open) {
      getSettings().then((s) => {
        setPhone(s.supportPhone || "Not configured");
        setTelegram(s.supportPhone || "Not configured");
      }).catch(() => {
        setPhone("Not configured");
        setTelegram("Not configured");
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border border-black/[0.04] rounded-[1rem]">
        <DialogHeader>
          <DialogTitle>Contact Support</DialogTitle>
        </DialogHeader>
        <div className="p-[1px] rounded-[2rem] bg-black/[0.03]">
          <div className="rounded-[calc(2rem-1px)] bg-gray-50 p-5 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)] text-sm space-y-2">
            <p className="font-medium">Contact admin support via:</p>
            <p> WhatsApp : <span className="text-gray-500">{phone}</span></p>
            <p> Telegram : <span className="text-gray-500">{telegram}</span></p>
          </div>
        </div>
        <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full transition-all duration-500 ease-out-expo">Close</Button>
      </DialogContent>
    </Dialog>
  );
}

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
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const dispute = await openDispute(trackingId, { reason, description });
      await sendMessage(
        trackingId,
        `🚩 Dispute opened: ${reason}\n\n${description}`
      );
      return dispute;
    },
    onSuccess: () => {
      toast.success("Dispute opened successfully");
      setReason("");
      setDescription("");
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["disputes", trackingId] });
      queryClient.invalidateQueries({ queryKey: ["messages", trackingId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.setQueriesData<Conversation[]>(
        { queryKey: ["conversations"] },
        (old) =>
          old?.map((c) =>
            c.trackingId === trackingId ? { ...c, type: "dispute" as const } : c
          )
      );
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

export default function TrackingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showContact, setShowContact] = useState(false);
  const [showDispute, setShowDispute] = useState(false);
  const [newMsg, setNewMsg] = useState("");
  const queryClient = useQueryClient();

  const { data: tracking, isLoading } = useQuery({
    queryKey: ["tracking", id],
    queryFn: () => getTracking(id!),
    enabled: !!id,
    refetchInterval: 5000,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => getMessages(id!),
    enabled: !!id && MESSAGING_STATUSES.includes(tracking?.status || ""),
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (id && messages.length > 0) {
      markMessagesAsRead(id);
    }
  }, [id, messages.length]);

  const { data: disputes = [] } = useQuery({
    queryKey: ["disputes", id],
    queryFn: () => getDisputes(id!),
    enabled: !!id,
  });

  const sendMsg = useMutation({
    mutationFn: () => sendMessage(id!, newMsg),
    onSuccess: () => {
      setNewMsg("");
      queryClient.invalidateQueries({ queryKey: ["messages", id] });
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout role="client">
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex items-start gap-4">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="flex-1">
              <Skeleton className="w-48 h-8 mb-2" />
              <Skeleton className="w-32 h-4" />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="p-[1px] rounded-[2rem] bg-black/[0.03]">
                <div className="rounded-[calc(2rem-1px)] bg-white p-5 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)]">
                  <Skeleton className="w-full h-20" />
                </div>
              </div>

              <MapSkeleton />

              <div className="space-y-3">
                <Skeleton className="w-full h-10 rounded-full" />
                <Skeleton className="w-full h-10 rounded-full" />
              </div>

              <div className="p-[1px] rounded-[2rem] bg-black/[0.03]">
                <div className="rounded-[calc(2rem-1px)] bg-white p-5 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)] space-y-4">
                  <Skeleton className="w-24 h-6" />
                  <div className="space-y-3">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-full h-4" />
                  </div>
                </div>
              </div>

              <div className="p-[1px] rounded-[2rem] bg-black/[0.03]">
                <div className="rounded-[calc(2rem-1px)] bg-white p-5 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)]">
                  <Skeleton className="w-32 h-6 mb-4" />
                  <TimelineSkeleton />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Skeleton className="h-40 rounded-[1rem]" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!tracking) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">
          <p className="text-gray-500">Tracking not found.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 rounded-full bg-gray-900 text-white px-6 py-2 text-sm font-medium transition-all duration-700 ease-out-expo hover:bg-gray-800 active:scale-[0.97]"
          >
            Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const messagingEnabled = MESSAGING_STATUSES.includes(tracking.status);
  const whatsappVisible = WHATSAPP_STATUSES.includes(tracking.status);

  return (
    <DashboardLayout role="client">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="rounded-full transition-all duration-500 ease-out-expo">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display text-lg sm:text-2xl font-bold tracking-tight">{tracking.clientName}</h1>
              <StatusBadge status={tracking.status} />
            </div>
            <p className="text-sm text-gray-500 font-mono mt-1">{tracking.trackingNumber}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-[1px] rounded-[2rem] bg-black/[0.03]">
              <Card className="border-0 bg-white shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)] rounded-[calc(2rem-1px)] p-5">
                <ETABlock
                  eta={tracking.eta}
                  status={tracking.status}
                  progressPercent={computeProgress(tracking)}
                />
              </Card>
            </div>

            <div className="h-[250px] sm:h-[400px] rounded-xl overflow-hidden">
              <TrackingMap items={[tracking]} selectedId={tracking.id} showRoute className="h-full" />
            </div>

            {whatsappVisible && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-green-500 text-green-600 hover:bg-green-50 rounded-full transition-all duration-500 ease-out-expo"
                  onClick={() => setShowContact(true)}
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Contact via WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-500 ease-out-expo"
                  onClick={() => setShowContact(true)}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Contact via Telegram
                </Button>
              </div>
            )}

            <Button
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50 rounded-full transition-all duration-500 ease-out-expo"
              onClick={() => setShowDispute(true)}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Open a Dispute
            </Button>

            <div className="p-[1px] rounded-[2rem] bg-black/[0.03]">
              <Card className="border-0 bg-white shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)] rounded-[calc(2rem-1px)] p-5 space-y-4">
                <h2 className="font-display font-semibold tracking-tight">Information</h2>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-500">Origin:</span>
                    <span className="font-medium">{tracking.originAddress || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-900" />
                    <span className="text-gray-500">Destination:</span>
                    <span className="font-medium">{tracking.destinationAddress || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-500">Description:</span>
                    <span className="font-medium">{tracking.packageDescription || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-500">Weight:</span>
                    <span className="font-medium">{tracking.weight ? `${tracking.weight} kg` : "—"}</span>
                  </div>
                </div>
              </Card>
            </div>

            {disputes.length > 0 && (
              <div className="p-[1px] rounded-[2rem] bg-black/[0.03]">
                <Card className="border-0 bg-white shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)] rounded-[calc(2rem-1px)] p-5">
                  <h2 className="font-display font-semibold mb-4 flex items-center gap-2 tracking-tight">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    Disputes
                  </h2>
                  <div className="space-y-3">
                    {disputes.map((d: Dispute) => (
                      <div key={d.id} className="p-3 border border-black/[0.04] rounded-xl">
                        <p className="font-medium text-sm">{d.reason}</p>
                        <p className="text-sm text-gray-500">{d.description}</p>
                        {d.adminResponse && (
                          <div className="mt-2 p-2 bg-black/5 rounded-xl text-sm">
                            <span className="font-medium">Response: </span>
                            {d.adminResponse}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            <div className="p-[1px] rounded-[2rem] bg-black/[0.03]">
              <Card className="border-0 bg-white shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)] rounded-[calc(2rem-1px)] p-5">
                <h2 className="font-display font-semibold mb-4 tracking-tight">Status History</h2>
                <TrackingTimeline events={tracking.statusHistory || []} />
              </Card>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white border border-black/[0.04] rounded-[1rem] h-[500px] flex flex-col">
              <div className="p-4 border-b border-black/[0.04]">
                <h2 className="font-display font-semibold flex items-center gap-2 tracking-tight">
                  <MessageSquare className="w-4 h-4" />
                  Messaging
                </h2>
              </div>
              {messagingEnabled ? (
                <>
                  <div className="flex-1 min-h-0 overflow-y-auto p-4">
                    <ChatBox
                      messages={messages.map((m) => ({
                        id: m.id,
                        senderId: m.senderId || "",
                        senderName: m.sender?.name || (m.senderRole === "client" ? "You" : "Support"),
                        senderRole: m.senderRole,
                        content: m.body,
                        timestamp: m.createdAt,
                        read: m.readAt !== null,
                      }))}
                      currentUserId={user?.id || ""}
                    />
                  </div>
                  <div className="p-4 border-t border-black/[0.04] flex gap-2">
                    <Input
                      value={newMsg}
                      onChange={(e) => setNewMsg(e.target.value)}
                      placeholder="Your message..."
                      onKeyDown={(e) => e.key === "Enter" && newMsg && sendMsg.mutate()}
                    />
                    <Button
                      size="icon"
                      onClick={() => sendMsg.mutate()}
                      disabled={!newMsg || sendMsg.isPending}
                      className="rounded-full transition-all duration-500 ease-out-expo"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-6 text-center text-gray-500 text-sm">
                  Messaging is available when your shipment requires special attention.
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <WhatsAppModal open={showContact} onOpenChange={setShowContact} />
      <DisputeDialog trackingId={id!} open={showDispute} onOpenChange={setShowDispute} />
    </DashboardLayout>
  );
}

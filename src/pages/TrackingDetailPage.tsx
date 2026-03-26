import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TrackingMap from "@/components/tracking/TrackingMap";
import TrackingTimeline from "@/components/tracking/TrackingTimeline";
import StatusBadge from "@/components/tracking/StatusBadge";
import FeePaymentBlock from "@/components/tracking/FeePaymentBlock";
import ETABlock from "@/components/tracking/ETABlock";
import ProofOfDeliveryBlock from "@/components/tracking/ProofOfDeliveryBlock";
import IncidentBlock from "@/components/tracking/IncidentBlock";
import ReturnRequestBlock from "@/components/tracking/ReturnRequestBlock";
import ChatBox from "@/components/messaging/ChatBox";
import { mockTrackings, mockConversations, mockIncidents, mockReturnRequests } from "@/data/mockData";
import ShareTrackingButton from "@/components/tracking/ShareTrackingButton";
import { ArrowLeft, MapPin, Truck, Calendar, Thermometer, Gauge, Battery } from "lucide-react";

const TrackingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const tracking = mockTrackings.find((t) => t.id === id);
  const conversation = mockConversations.find((c) => c.trackingId === id);
  const incidents = mockIncidents.filter((i) => i.trackingId === id);
  const returns = mockReturnRequests.filter((r) => r.trackingId === id);

  if (!tracking) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Tracking non trouvé.</p>
          <Button variant="accent" onClick={() => navigate("/dashboard")} className="mt-4">Retour</Button>
        </div>
      </DashboardLayout>
    );
  }

  const canReturn = ["delivered"].includes(tracking.status);

  return (
    <DashboardLayout role="client">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display text-lg sm:text-2xl font-bold">{tracking.name}</h1>
              <StatusBadge status={tracking.status} />
            </div>
            <p className="text-sm text-muted-foreground font-mono mt-1">{tracking.trackingNumber}</p>
          </div>
          <ShareTrackingButton trackingId={tracking.id} trackingNumber={tracking.trackingNumber} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map + Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* ETA Block */}
            <Card className="p-5">
              <ETABlock tracking={tracking} />
            </Card>

            <div className="h-[250px] sm:h-[400px]">
              <TrackingMap items={[tracking]} selectedId={tracking.id} showRoute className="h-full" />
            </div>

            {/* Details */}
            <Card className="p-5 space-y-4">
              <h2 className="font-display font-semibold">Informations</h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Origine:</span>
                  <span className="font-medium">{tracking.origin}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-muted-foreground">Destination:</span>
                  <span className="font-medium">{tracking.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Transporteur:</span>
                  <span className="font-medium">{tracking.carrier}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Arrivée prévue:</span>
                  <span className="font-medium">{new Date(tracking.estimatedArrival).toLocaleDateString("fr-FR")}</span>
                </div>
              </div>

              {(tracking.speed || tracking.battery || tracking.temperature !== undefined) && (
                <div className="flex gap-4 pt-2 border-t border-border">
                  {tracking.speed && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <Gauge className="w-4 h-4 text-accent" />
                      <span>{tracking.speed} km/h</span>
                    </div>
                  )}
                  {tracking.battery && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <Battery className="w-4 h-4 text-success" />
                      <span>{tracking.battery}%</span>
                    </div>
                  )}
                  {tracking.temperature !== undefined && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <Thermometer className="w-4 h-4 text-info" />
                      <span>{tracking.temperature}°C</span>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Proof of Delivery */}
            {tracking.pod && <ProofOfDeliveryBlock pod={tracking.pod} trackingId={tracking.id} />}

            {/* Customs Fees Block */}
            {tracking.fees && (
              <FeePaymentBlock
                fees={tracking.fees}
                trackingNumber={tracking.trackingNumber}
                onContactSupport={() => {
                  const chatSection = document.getElementById("chat-section");
                  chatSection?.scrollIntoView({ behavior: "smooth" });
                }}
              />
            )}

            {/* Incidents */}
            <IncidentBlock incidents={incidents} trackingId={tracking.id} />

            {/* Returns */}
            <ReturnRequestBlock returns={returns} trackingId={tracking.id} canReturn={canReturn} />

            {/* Timeline */}
            <Card className="p-5">
              <h2 className="font-display font-semibold mb-4">Historique des statuts</h2>
              <TrackingTimeline events={tracking.statusHistory} />
            </Card>
          </div>

          {/* Chat */}
          <div className="lg:col-span-1" id="chat-section">
            <Card className="h-[600px] flex flex-col">
              <div className="p-4 border-b border-border">
                <h2 className="font-display font-semibold">Messagerie</h2>
                <p className="text-xs text-muted-foreground">Échangez avec le support</p>
              </div>
              <div className="flex-1 min-h-0">
                <ChatBox messages={conversation?.messages || []} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TrackingDetailPage;

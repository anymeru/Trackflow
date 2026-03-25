import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import StatusBadge from "@/components/tracking/StatusBadge";
import TrackingMap from "@/components/tracking/TrackingMap";
import TrackingTimeline from "@/components/tracking/TrackingTimeline";
import ETABlock from "@/components/tracking/ETABlock";
import { mockTrackings } from "@/data/mockData";
import { MapPin, Truck, Package } from "lucide-react";

const PublicTrackingPage = () => {
  const { id } = useParams();
  const tracking = mockTrackings.find((t) => t.id === id);

  if (!tracking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md w-full">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-xl font-bold mb-2">Tracking introuvable</h1>
          <p className="text-sm text-muted-foreground">Ce lien de suivi est invalide ou a expiré.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Package className="w-4 h-4 text-accent-foreground" />
          </div>
          <span className="font-display font-bold text-lg">TrackFlow</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h1 className="font-display text-xl font-bold">{tracking.name}</h1>
            <StatusBadge status={tracking.status} />
          </div>
          <p className="text-sm text-muted-foreground font-mono">{tracking.trackingNumber}</p>
        </div>

        <Card className="p-5">
          <ETABlock tracking={tracking} />
        </Card>

        <div className="h-[300px]">
          <TrackingMap items={[tracking]} selectedId={tracking.id} showRoute className="h-full" />
        </div>

        <Card className="p-5 space-y-3">
          <h2 className="font-display font-semibold text-sm">Informations</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
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
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-display font-semibold mb-4 text-sm">Historique</h2>
          <TrackingTimeline events={tracking.statusHistory} />
        </Card>

        <p className="text-xs text-center text-muted-foreground pb-4">
          Suivi fourni par TrackFlow • Ce lien est valide pour une durée limitée
        </p>
      </main>
    </div>
  );
};

export default PublicTrackingPage;

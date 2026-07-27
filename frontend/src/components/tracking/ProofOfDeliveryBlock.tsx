import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, MapPin, Clock, User, Download, Camera, PenTool, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { ProofOfDelivery } from "@/data/mockData";

interface ProofOfDeliveryBlockProps {
  pod: ProofOfDelivery;
  trackingId?: string;
}

const ProofOfDeliveryBlock = ({ pod, trackingId }: ProofOfDeliveryBlockProps) => {
  const [showContest, setShowContest] = useState(false);
  const [contestReason, setContestReason] = useState("");
  const [contested, setContested] = useState(false);

  const handleContest = () => {
    if (!contestReason.trim()) return;
    setContested(true);
    setShowContest(false);
    toast({
      title: "Dispute Submitted",
      description: "Your dispute has been recorded. Support will contact you within 24h.",
    });
  };

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-success" />
        </div>
        <div>
          <h2 className="font-display font-semibold">Proof of Delivery</h2>
          <p className="text-xs text-muted-foreground">Delivery confirmed and verified</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Received by:</span>
          <span className="font-medium">{pod.deliveredTo}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Date:</span>
          <span className="font-medium">{new Date(pod.deliveredAt).toLocaleString("fr-FR")}</span>
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Address:</span>
          <span className="font-medium">{pod.location}</span>
        </div>
        {pod.notes && (
          <div className="sm:col-span-2 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
            {pod.notes}
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {pod.signatureUrl && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <PenTool className="w-3 h-3" />
              <span>Signature</span>
            </div>
            <div className="border border-border rounded-lg overflow-hidden bg-muted/30">
              <img src={pod.signatureUrl} alt="Signature" className="w-full h-24 object-contain" />
            </div>
          </div>
        )}
        {pod.photoUrl && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Camera className="w-3 h-3" />
              <span>Delivery Photo</span>
            </div>
            <div className="border border-border rounded-lg overflow-hidden bg-muted/30">
              <img src={pod.photoUrl} alt="Delivery Photo" className="w-full h-24 object-cover" />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Download PDF Receipt
        </Button>
        {!contested ? (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={() => setShowContest(!showContest)}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Dispute
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="flex-1" disabled>
            <CheckCircle className="w-4 h-4 mr-2 text-success" />
            Dispute Submitted
          </Button>
        )}
      </div>

      {showContest && (
        <div className="space-y-3 border border-destructive/20 rounded-lg p-4 bg-destructive/5">
          <p className="text-sm font-medium">Dispute This Delivery</p>
          <p className="text-xs text-muted-foreground">
            Describe the issue (not received, wrong address, empty package, damaged…)
          </p>
          <Textarea
            value={contestReason}
            onChange={(e) => setContestReason(e.target.value)}
            placeholder="Describe your issue..."
            rows={3}
          />
          <div className="flex gap-2">
            <Button size="sm" variant="destructive" onClick={handleContest} disabled={!contestReason.trim()}>
              Submit Dispute
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowContest(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProofOfDeliveryBlock;

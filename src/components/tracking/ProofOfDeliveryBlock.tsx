import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, MapPin, Clock, User, Download, Camera, PenTool } from "lucide-react";
import type { ProofOfDelivery } from "@/data/mockData";

interface ProofOfDeliveryBlockProps {
  pod: ProofOfDelivery;
}

const ProofOfDeliveryBlock = ({ pod }: ProofOfDeliveryBlockProps) => {
  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-success" />
        </div>
        <div>
          <h2 className="font-display font-semibold">Preuve de livraison</h2>
          <p className="text-xs text-muted-foreground">Livraison confirmée et vérifiée</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Réceptionné par:</span>
          <span className="font-medium">{pod.deliveredTo}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Date:</span>
          <span className="font-medium">{new Date(pod.deliveredAt).toLocaleString("fr-FR")}</span>
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Adresse:</span>
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
              <span>Photo de livraison</span>
            </div>
            <div className="border border-border rounded-lg overflow-hidden bg-muted/30">
              <img src={pod.photoUrl} alt="Photo livraison" className="w-full h-24 object-cover" />
            </div>
          </div>
        )}
      </div>

      <Button variant="outline" size="sm" className="w-full">
        <Download className="w-4 h-4 mr-2" />
        Télécharger le reçu PDF
      </Button>
    </Card>
  );
};

export default ProofOfDeliveryBlock;

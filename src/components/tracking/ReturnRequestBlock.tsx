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
  requested: "Demandé",
  approved: "Approuvé",
  in_transit: "En cours de retour",
  received: "Reçu",
  refunded: "Remboursé",
  rejected: "Refusé",
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
      title: "Demande de retour envoyée",
      description: "Votre demande sera examinée sous 24-48h. Vous recevrez une notification.",
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
          <h2 className="font-display font-semibold">Retours</h2>
        </div>
        {canReturn && !showForm && (
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Demander un retour
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
                  <span>Retour: {ret.returnTrackingNumber}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {returns.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground">
          {canReturn ? "Aucune demande de retour." : "Le retour n'est pas disponible pour ce statut."}
        </p>
      )}

      {showForm && (
        <div className="space-y-3 border border-border rounded-lg p-3">
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger>
              <SelectValue placeholder="Motif du retour" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(returnReasonLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Décrivez la raison du retour..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSubmit} disabled={!reason || !description}>
              Envoyer la demande
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              Annuler
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ReturnRequestBlock;

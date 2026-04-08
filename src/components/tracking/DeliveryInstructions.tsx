import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Home, User, Clock, MapPin, MessageSquare, Check } from "lucide-react";

interface DeliveryInstructionsProps {
  trackingId: string;
  status: string;
}

const instructionOptions = [
  { value: "door", label: "Déposer à la porte", icon: Home, desc: "Le livreur laissera le colis devant votre porte" },
  { value: "neighbor", label: "Laisser chez un voisin", icon: User, desc: "Indiquez le nom du voisin dans les notes" },
  { value: "safe_place", label: "Lieu sûr", icon: MapPin, desc: "Boîte aux lettres, garage, abri de jardin..." },
  { value: "reschedule", label: "Reporter la livraison", icon: Clock, desc: "Choisir un autre jour de livraison" },
];

const DeliveryInstructions = ({ trackingId, status }: DeliveryInstructionsProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canEdit = ["in_transit", "out_for_delivery", "picked_up"].includes(status);

  if (!canEdit) return null;

  const handleSubmit = () => {
    if (!selected) {
      toast.error("Veuillez sélectionner une option de livraison");
      return;
    }
    setSubmitted(true);
    toast.success("Instructions de livraison enregistrées !");
  };

  if (submitted) {
    return (
      <Card className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
            <Check className="w-4 h-4 text-success" />
          </div>
          <div>
            <h2 className="font-display font-semibold">Instructions enregistrées</h2>
            <p className="text-xs text-muted-foreground">
              {instructionOptions.find((o) => o.value === selected)?.label}
              {notes && ` — ${notes}`}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
          Modifier
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-accent" />
        <h2 className="font-display font-semibold">Instructions de livraison</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Indiquez au livreur comment procéder à la livraison.
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        {instructionOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selected === option.value;
          return (
            <button
              key={option.value}
              onClick={() => setSelected(option.value)}
              className={`p-3 rounded-lg border text-left transition-all ${
                isSelected
                  ? "border-accent bg-accent/10 ring-1 ring-accent"
                  : "border-border hover:border-accent/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${isSelected ? "text-accent" : "text-muted-foreground"}`} />
                <span className="text-sm font-medium">{option.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">{option.desc}</p>
            </button>
          );
        })}
      </div>

      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes supplémentaires (nom du voisin, code d'accès, emplacement...)"
        className="resize-none"
        maxLength={200}
        rows={2}
      />

      <Button variant="accent" onClick={handleSubmit} className="w-full sm:w-auto">
        Enregistrer les instructions
      </Button>
    </Card>
  );
};

export default DeliveryInstructions;

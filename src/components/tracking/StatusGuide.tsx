import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Package, MapPin, Truck, Check, AlertTriangle, ShieldAlert, CreditCard, RotateCcw, Clock, Eye } from "lucide-react";
import { statusLabels, statusColors } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

const statusGuide = [
  {
    status: "created",
    icon: Package,
    description: "Votre envoi a été enregistré dans notre système. Le transporteur n'a pas encore pris en charge le colis.",
    tips: "Vous recevrez une notification dès que le transporteur récupérera votre colis.",
  },
  {
    status: "picked_up",
    icon: MapPin,
    description: "Le transporteur a récupéré votre colis au point d'enlèvement. Il va être acheminé vers un centre de tri.",
    tips: "Le colis devrait apparaître en transit dans les prochaines heures.",
  },
  {
    status: "in_transit",
    icon: Truck,
    description: "Votre colis est en route vers sa destination. Il transite entre différents centres de tri et hubs logistiques.",
    tips: "Suivez la position en temps réel sur la carte. L'ETA se met à jour au fur et à mesure.",
  },
  {
    status: "out_for_delivery",
    icon: Truck,
    description: "Le livreur est en route vers l'adresse de destination. La livraison devrait avoir lieu aujourd'hui.",
    tips: "Assurez-vous que quelqu'un est disponible pour réceptionner le colis.",
  },
  {
    status: "delivered",
    icon: Check,
    description: "Votre colis a été remis au destinataire. Une preuve de livraison (signature, photo) peut être disponible.",
    tips: "Si vous n'avez pas reçu votre colis, vous pouvez contester la livraison depuis la page de détail.",
  },
  {
    status: "delayed",
    icon: AlertTriangle,
    description: "L'acheminement de votre colis a pris du retard. Cela peut être dû aux conditions météo, un problème technique ou un afflux de volume.",
    tips: "L'ETA sera recalculée automatiquement. Contactez le support si le retard dépasse 48h.",
  },
  {
    status: "customs_hold",
    icon: ShieldAlert,
    description: "Votre colis est retenu par les services douaniers pour vérification ou dédouanement.",
    tips: "Des frais de douane peuvent être exigés. Consultez la page de détail pour plus d'informations.",
  },
  {
    status: "fees_pending",
    icon: CreditCard,
    description: "Des frais (douane, taxes, stockage) doivent être réglés avant que la livraison ne puisse reprendre.",
    tips: "Payez rapidement pour éviter des frais de stockage supplémentaires.",
  },
  {
    status: "returned",
    icon: RotateCcw,
    description: "Le colis est en cours de retour vers l'expéditeur, soit à votre demande, soit suite à un échec de livraison.",
    tips: "Un numéro de suivi retour sera généré pour suivre le trajet inverse.",
  },
  {
    status: "lost",
    icon: Eye,
    description: "Le colis n'a pas pu être localisé malgré les recherches. Une enquête est en cours.",
    tips: "Contactez le support pour ouvrir une réclamation et obtenir un remboursement.",
  },
];

const StatusGuide = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-5 h-5 text-accent" />
        <h3 className="font-display font-semibold text-lg">Guide des statuts</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Que signifie chaque statut ? Retrouvez ici toutes les explications.
      </p>
      <Accordion type="single" collapsible className="w-full">
        {statusGuide.map((item) => {
          const Icon = item.icon;
          return (
            <AccordionItem key={item.status} value={item.status}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${statusColors[item.status] || "bg-muted text-muted-foreground"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm">{statusLabels[item.status]}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-11 space-y-2">
                  <p className="text-sm text-foreground">{item.description}</p>
                  <p className="text-xs text-accent font-medium">💡 {item.tips}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default StatusGuide;

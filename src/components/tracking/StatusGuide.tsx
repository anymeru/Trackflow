import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Package, MapPin, Truck, Check, AlertTriangle, ShieldAlert, CreditCard, RotateCcw, Clock, Eye } from "lucide-react";
import { STATUS_LABELS, STATUS_COLORS } from "./StatusBadge";

const statusGuide = [
  {
    status: "in_transit",
    icon: Truck,
    description: "Your package is on its way to its destination. It is moving through sorting centers and logistics hubs.",
    tips: "Follow real-time position on the map. The ETA updates as you go.",
  },
  {
    status: "out_for_delivery",
    icon: Truck,
    description: "The driver is on their way to the delivery address. Delivery should happen today.",
    tips: "Make sure someone is available to receive the package.",
  },
  {
    status: "delivered",
    icon: Check,
    description: "Your package has been handed over to the recipient. A proof of delivery may be available.",
    tips: "If you haven't received your package, you can open a dispute from the detail page.",
  },
  {
    status: "delayed",
    icon: AlertTriangle,
    description: "Your package delivery has been delayed. This may be due to weather conditions, a technical issue, or high volume.",
    tips: "The ETA will be recalculated automatically. Contact support if the delay exceeds 48h.",
  },
  {
    status: "customs_hold",
    icon: ShieldAlert,
    description: "Your package is being held by customs for verification or clearance.",
    tips: "Customs fees may be required. Check the detail page for more information.",
  },
  {
    status: "fees_pending",
    icon: CreditCard,
    description: "Fees (customs, taxes, storage) must be paid before delivery can resume.",
    tips: "Pay promptly to avoid additional storage fees.",
  },
  {
    status: "returned",
    icon: RotateCcw,
    description: "The package is being returned to the sender, either at your request or following a failed delivery.",
    tips: "A return tracking number will be generated to follow the reverse journey.",
  },
  {
    status: "lost",
    icon: Eye,
    description: "The package could not be located despite searches. An investigation is underway.",
    tips: "Contact support to open a claim and get a refund.",
  },
];

const StatusGuide = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-5 h-5 text-accent" />
        <h3 className="font-display font-semibold text-lg">Status Guide</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        What does each status mean? Find all explanations here.
      </p>
      <Accordion type="single" collapsible className="w-full">
        {statusGuide.map((item) => {
          const Icon = item.icon;
          const colorClass = STATUS_COLORS[item.status] || "bg-muted text-muted-foreground";
          return (
            <AccordionItem key={item.status} value={item.status}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm">{STATUS_LABELS[item.status]}</span>
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

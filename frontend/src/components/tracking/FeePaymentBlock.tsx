import { TrackingFees } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CreditCard, MessageSquare, XCircle, CheckCircle2, Clock, Info } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface FeePaymentBlockProps {
  fees: TrackingFees;
  trackingNumber: string;
  onContactSupport?: () => void;
}

const feeStatusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Pending Payment", color: "bg-warning text-warning-foreground", icon: <Clock className="w-4 h-4" /> },
  paid: { label: "Fees Paid", color: "bg-success text-success-foreground", icon: <CheckCircle2 className="w-4 h-4" /> },
  refused: { label: "Payment Refused", color: "bg-destructive text-destructive-foreground", icon: <XCircle className="w-4 h-4" /> },
  investigating: { label: "Investigation In Progress", color: "bg-info text-info-foreground", icon: <Info className="w-4 h-4" /> },
  expired: { label: "Deadline Expired", color: "bg-destructive text-destructive-foreground", icon: <AlertTriangle className="w-4 h-4" /> },
};

const FeePaymentBlock = ({ fees, trackingNumber, onContactSupport }: FeePaymentBlockProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const config = feeStatusConfig[fees.status];
  const isPending = fees.status === "pending";
  const isPaid = fees.status === "paid";

  const handlePay = () => {
    setShowConfirm(false);
    toast({
      title: "Simulated Payment",
      description: `Payment of ${fees.totalAmount.toLocaleString("fr-FR")} ${fees.currency} completed successfully.`,
    });
  };

  const handleRefuse = () => {
    toast({
      title: "Fees Refused",
      description: "Your refusal has been recorded. The package may be returned or blocked.",
      variant: "destructive",
    });
  };

  return (
    <Card className={`p-5 space-y-4 border-2 ${isPending ? "border-warning/50 bg-warning/5" : isPaid ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <AlertTriangle className={`w-5 h-5 ${isPending ? "text-warning" : isPaid ? "text-success" : "text-destructive"}`} />
          <h2 className="font-display font-semibold text-lg">Fees to Pay</h2>
        </div>
        <Badge className={`${config.color} border-0 gap-1`}>
          {config.icon}
          {config.label}
        </Badge>
      </div>

      {/* Explanation */}
      <p className="text-sm text-muted-foreground">{fees.explanation}</p>

      {/* Fee breakdown */}
      <div className="rounded-lg bg-background border border-border p-4 space-y-2">
        {fees.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-medium">{item.amount.toLocaleString("fr-FR")} {fees.currency}</span>
          </div>
        ))}
        <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold">
          <span>Total</span>
          <span className="text-accent">{fees.totalAmount.toLocaleString("fr-FR")} {fees.currency}</span>
        </div>
      </div>

      {/* Deadline */}
      {fees.deadline && isPending && (
        <div className="flex items-center gap-2 text-sm text-warning">
          <Clock className="w-4 h-4" />
          <span>Deadline: {new Date(fees.deadline).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
        </div>
      )}

      {/* Paid confirmation */}
      {isPaid && fees.paidAt && (
        <div className="flex items-center gap-2 text-sm text-success">
          <CheckCircle2 className="w-4 h-4" />
          <span>Paid on {new Date(fees.paidAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
        </div>
      )}

      {/* Actions */}
      {isPending && !showConfirm && (
        <div className="flex flex-wrap gap-3 pt-2">
          <Button variant="accent" className="gap-2" onClick={() => setShowConfirm(true)}>
            <CreditCard className="w-4 h-4" />
            Pay Now
          </Button>
          <Button variant="outline" className="gap-2" onClick={onContactSupport}>
            <MessageSquare className="w-4 h-4" />
            Dispute / Question
          </Button>
          <Button variant="ghost" className="text-destructive gap-2" onClick={handleRefuse}>
            <XCircle className="w-4 h-4" />
            Refuse Fees
          </Button>
        </div>
      )}

      {/* Confirm dialog inline */}
      {showConfirm && (
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-4 space-y-3">
          <p className="font-medium text-sm">Confirm payment of {fees.totalAmount.toLocaleString("fr-FR")} {fees.currency} ?</p>
          <p className="text-xs text-muted-foreground">This payment will cover customs fees and allow delivery of package {trackingNumber} to continue.</p>
          <div className="flex gap-3">
            <Button variant="accent" size="sm" onClick={handlePay}>Confirm and Pay</Button>
            <Button variant="outline" size="sm" onClick={() => setShowConfirm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Investigating state */}
      {fees.status === "investigating" && (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Info className="w-4 h-4 text-info" />
          An investigation is underway regarding these fees. You will be notified of the resolution.
        </div>
      )}
    </Card>
  );
};

export default FeePaymentBlock;

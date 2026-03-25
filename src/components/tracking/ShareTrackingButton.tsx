import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ShareTrackingButtonProps {
  trackingId: string;
  trackingNumber: string;
}

const ShareTrackingButton = ({ trackingId, trackingNumber }: ShareTrackingButtonProps) => {
  const [copied, setCopied] = useState(false);
  const publicUrl = `${window.location.origin}/track/${trackingId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast({ title: "Lien copié", description: "Le lien de suivi a été copié dans le presse-papiers." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Suivez votre colis ${trackingNumber} ici : ${publicUrl}`)}`, "_blank");
  };

  const handleShareEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(`Suivi colis ${trackingNumber}`)}&body=${encodeURIComponent(`Bonjour,\n\nVous pouvez suivre votre colis ici :\n${publicUrl}\n\nCordialement`)}`, "_blank");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Partager le suivi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Partager le lien de suivi</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Envoyez ce lien au destinataire pour qu'il puisse suivre le colis sans compte.
        </p>
        <div className="flex gap-2">
          <Input value={publicUrl} readOnly className="font-mono text-xs" />
          <Button variant="outline" size="icon" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={handleShareWhatsApp}>
            WhatsApp
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={handleShareEmail}>
            Email
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => window.open(publicUrl, "_blank")}>
            <ExternalLink className="w-4 h-4 mr-1" />
            Ouvrir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareTrackingButton;

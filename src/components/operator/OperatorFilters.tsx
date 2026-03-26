import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

interface OperatorFiltersProps {
  statusFilter: string;
  carrierFilter: string;
  priorityFilter: string;
  onStatusChange: (v: string) => void;
  onCarrierChange: (v: string) => void;
  onPriorityChange: (v: string) => void;
  onReset: () => void;
  carriers: string[];
}

const OperatorFilters = ({
  statusFilter, carrierFilter, priorityFilter,
  onStatusChange, onCarrierChange, onPriorityChange, onReset,
  carriers,
}: OperatorFiltersProps) => {
  const hasFilters = statusFilter !== "all" || carrierFilter !== "all" || priorityFilter !== "all";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-36 h-8 text-xs">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="in_transit">En transit</SelectItem>
          <SelectItem value="delayed">En retard</SelectItem>
          <SelectItem value="out_for_delivery">En livraison</SelectItem>
          <SelectItem value="delivered">Livré</SelectItem>
          <SelectItem value="fees_pending">Frais en attente</SelectItem>
          <SelectItem value="customs_hold">Douane</SelectItem>
          <SelectItem value="lost">Perdu</SelectItem>
        </SelectContent>
      </Select>
      <Select value={carrierFilter} onValueChange={onCarrierChange}>
        <SelectTrigger className="w-full sm:w-36 h-8 text-xs">
          <SelectValue placeholder="Transporteur" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous</SelectItem>
          {carriers.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={priorityFilter} onValueChange={onPriorityChange}>
        <SelectTrigger className="w-full sm:w-36 h-8 text-xs">
          <SelectValue placeholder="Priorité" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes</SelectItem>
          <SelectItem value="critical">Critique</SelectItem>
          <SelectItem value="at_risk">À risque</SelectItem>
          <SelectItem value="normal">Normal</SelectItem>
        </SelectContent>
      </Select>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onReset} className="h-8 text-xs">
          <X className="w-3 h-3 mr-1" /> Réinitialiser
        </Button>
      )}
    </div>
  );
};

export default OperatorFilters;

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
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="in_transit">In Transit</SelectItem>
          <SelectItem value="delayed">Delayed</SelectItem>
          <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
          <SelectItem value="fees_pending">Fees Pending</SelectItem>
          <SelectItem value="customs_hold">Customs Hold</SelectItem>
          <SelectItem value="returned">Returned</SelectItem>
          <SelectItem value="lost">Lost</SelectItem>
        </SelectContent>
      </Select>
      <Select value={carrierFilter} onValueChange={onCarrierChange}>
        <SelectTrigger className="w-full sm:w-36 h-8 text-xs">
          <SelectValue placeholder="Carrier" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {carriers.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={priorityFilter} onValueChange={onPriorityChange}>
        <SelectTrigger className="w-full sm:w-36 h-8 text-xs">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="critical">Critical</SelectItem>
          <SelectItem value="at_risk">At Risk</SelectItem>
          <SelectItem value="normal">Normal</SelectItem>
        </SelectContent>
      </Select>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onReset} className="h-8 text-xs">
          <X className="w-3 h-3 mr-1" /> Reset
        </Button>
      )}
    </div>
  );
};

export default OperatorFilters;

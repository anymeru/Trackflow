import { Badge } from "@/components/ui/badge";
import { statusLabels, statusColors } from "@/data/mockData";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <Badge className={`${statusColors[status] || "bg-muted text-muted-foreground"} border-0 font-medium`}>
      {statusLabels[status] || status}
    </Badge>
  );
};

export default StatusBadge;

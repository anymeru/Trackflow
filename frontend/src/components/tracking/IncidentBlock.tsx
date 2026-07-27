import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Plus, Clock } from "lucide-react";
import { incidentTypeLabels, type Incident } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

interface IncidentBlockProps {
  incidents: Incident[];
  trackingId: string;
}

const severityColors: Record<string, string> = {
  low: "bg-info text-info-foreground",
  medium: "bg-warning text-warning-foreground",
  high: "bg-destructive text-destructive-foreground",
  critical: "bg-destructive text-destructive-foreground",
};

const statusLabels: Record<string, string> = {
  open: "Open",
  investigating: "Investigation In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

const IncidentBlock = ({ incidents, trackingId }: IncidentBlockProps) => {
  const [showForm, setShowForm] = useState(false);
  const [incidentType, setIncidentType] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!incidentType || !description) return;
    toast({
      title: "Incident Reported",
      description: "Your incident has been recorded. Our team will review it shortly.",
    });
    setShowForm(false);
    setIncidentType("");
    setDescription("");
  };

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h2 className="font-display font-semibold">Incidents</h2>
        </div>
        {!showForm && (
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Report
          </Button>
        )}
      </div>

      {incidents.length > 0 && (
        <div className="space-y-3">
          {incidents.map((inc) => (
            <div key={inc.id} className="border border-border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{inc.title}</span>
                <div className="flex items-center gap-2">
                  <Badge className={`${severityColors[inc.severity]} border-0 text-xs`}>
                    {inc.severity}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {statusLabels[inc.status]}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{inc.description}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Opened on {new Date(inc.createdAt).toLocaleDateString("fr-FR")}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {incidents.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground">No incidents reported for this tracking.</p>
      )}

      {showForm && (
        <div className="space-y-3 border border-border rounded-lg p-3">
          <Select value={incidentType} onValueChange={setIncidentType}>
            <SelectTrigger>
              <SelectValue placeholder="Incident Type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(incidentTypeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Describe the issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSubmit} disabled={!incidentType || !description}>
              Submit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default IncidentBlock;

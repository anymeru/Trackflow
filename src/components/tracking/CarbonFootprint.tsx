import { Leaf } from "lucide-react";

interface CarbonFootprintProps {
  origin: string;
  destination: string;
  carrier: string;
  type: "colis" | "vehicule" | "objet";
}

// Simplified CO₂ estimation based on city pairs (mock distances in km)
const cityDistances: Record<string, number> = {
  "Paris-Lyon": 465,
  "Marseille-Bordeaux": 645,
  "Strasbourg-Lille": 525,
  "Nantes-Toulouse": 585,
  "Tokyo-Paris": 9715,
};

const getDistance = (origin: string, destination: string): number => {
  const o = origin.split(",")[0].trim();
  const d = destination.split(",")[0].trim();
  return cityDistances[`${o}-${d}`] || cityDistances[`${d}-${o}`] || 500;
};

// gCO₂/km/kg estimates by transport mode
const getEmissionFactor = (carrier: string, distance: number): { factor: number; mode: string } => {
  if (distance > 3000) return { factor: 0.6, mode: "Aérien" }; // air freight
  if (carrier.toLowerCase().includes("fleet")) return { factor: 0.12, mode: "Routier (véhicule)" };
  return { factor: 0.1, mode: "Routier" }; // truck
};

const CarbonFootprint = ({ origin, destination, carrier, type }: CarbonFootprintProps) => {
  const distance = getDistance(origin, destination);
  const { factor, mode } = getEmissionFactor(carrier, distance);
  const weight = type === "vehicule" ? 1500 : type === "objet" ? 10 : 5; // estimated kg
  const co2Grams = distance * factor * weight;
  const co2Kg = co2Grams / 1000;

  const getLevel = (): { color: string; label: string } => {
    if (co2Kg < 1) return { color: "text-success", label: "Faible impact" };
    if (co2Kg < 10) return { color: "text-warning", label: "Impact modéré" };
    return { color: "text-destructive", label: "Impact élevé" };
  };

  const { color, label } = getLevel();

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-lg">
      <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center shrink-0">
        <Leaf className="w-4 h-4 text-success" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium">Empreinte carbone</span>
          <span className={`text-xs font-medium ${color}`}>{label}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          ~{co2Kg < 1 ? `${Math.round(co2Grams)} g` : `${co2Kg.toFixed(1)} kg`} CO₂ • {distance.toLocaleString()} km • {mode}
        </p>
      </div>
    </div>
  );
};

export default CarbonFootprint;

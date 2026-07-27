import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import StatusBadge from "@/components/tracking/StatusBadge";
import TrackingMap from "@/components/tracking/TrackingMap";
import TrackingTimeline from "@/components/tracking/TrackingTimeline";
import ETABlock from "@/components/tracking/ETABlock";
import { getPublicTracking, computeProgress } from "@/api/trackings";
import { MapPin, Truck } from "lucide-react";

const PublicTrackingPage = () => {
  const { id } = useParams();

  const { data: tracking, isLoading } = useQuery({
    queryKey: ["public-tracking", id],
    queryFn: () => getPublicTracking(id!),
    enabled: !!id,
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-6 h-6 rounded-full border-2 border-black/10 border-t-black/60 animate-spin" />
      </div>
    );
  }

  if (!tracking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="p-[1px] rounded-[2rem] bg-black/[0.03] max-w-md w-full">
          <div className="rounded-[calc(2rem-1px)] bg-white p-10 text-center shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)]">
            <Truck className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <h1 className="text-xl font-semibold tracking-tight mb-2">Tracking not found</h1>
            <p className="text-sm text-gray-500">This tracking link is invalid or has expired.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-black/[0.04] bg-white/80 backdrop-blur-2xl">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <img src="/trace-logo.svg" alt="TRACE" className="h-7 w-auto" />
          <span className="font-semibold text-lg tracking-tight">TRACE</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h1 className="text-xl font-semibold tracking-tight">{tracking.clientName}</h1>
            <StatusBadge status={tracking.status} />
          </div>
          <p className="text-sm text-gray-500 font-mono">{tracking.trackingNumber}</p>
        </div>

        <div className="p-[1px] rounded-[2rem] bg-black/[0.03]">
          <div className="rounded-[calc(2rem-1px)] bg-white p-5 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)]">
            <ETABlock
              eta={tracking.eta ?? null}
              status={tracking.status}
              progressPercent={computeProgress(tracking)}
              originAddress={tracking.originAddress ?? undefined}
              destinationAddress={tracking.destinationAddress ?? undefined}
            />
          </div>
        </div>

        <div className="h-[300px] rounded-[2rem] overflow-hidden border border-black/[0.04]">
          <TrackingMap items={[tracking]} selectedId={tracking.id} showRoute className="h-full" />
        </div>

        <div className="p-[1px] rounded-[2rem] bg-black/[0.03]">
          <div className="rounded-[calc(2rem-1px)] bg-white p-6 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)]">
            <h2 className="text-sm font-semibold tracking-tight mb-4">Information</h2>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="text-gray-500">Origin:</span>
                <span className="font-medium text-gray-900">{tracking.originAddress || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 shrink-0 text-gray-700" />
                <span className="text-gray-500">Destination:</span>
                <span className="font-medium text-gray-900">{tracking.destinationAddress || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Truck className="w-4 h-4 shrink-0" />
                <span className="text-gray-500">Carrier:</span>
                <span className="font-medium text-gray-900">{tracking.carrierRef || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-[1px] rounded-[2rem] bg-black/[0.03]">
          <div className="rounded-[calc(2rem-1px)] bg-white p-6 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)]">
            <h2 className="text-sm font-semibold tracking-tight mb-4">History</h2>
            <TrackingTimeline events={tracking.statusHistory || []} />
          </div>
        </div>

        <p className="text-xs text-center text-gray-400 pb-4">
          Tracking provided by TRACE
        </p>
      </main>
    </div>
  );
};

export default PublicTrackingPage;

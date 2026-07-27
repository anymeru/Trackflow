import { Check, Clock, Truck, AlertTriangle, Package, MapPin, ShieldAlert, CreditCard, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import type { StatusEvent } from "@/api/trackings";

const STATUS_LABELS: Record<string, string> = {
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  delayed: "Delayed",
  customs_hold: "Customs Hold",
  fees_pending: "Fees Pending",
  returned: "Returned",
  lost: "Lost",
};

const statusIcons: Record<string, React.ReactNode> = {
  in_transit: <Truck className="w-4 h-4" />,
  out_for_delivery: <Truck className="w-4 h-4" />,
  delivered: <Check className="w-4 h-4" />,
  delayed: <AlertTriangle className="w-4 h-4" />,
  customs_hold: <ShieldAlert className="w-4 h-4" />,
  fees_pending: <CreditCard className="w-4 h-4" />,
  returned: <RotateCcw className="w-4 h-4" />,
  lost: <AlertTriangle className="w-4 h-4" />,
};

interface TrackingTimelineProps {
  events: StatusEvent[];
}

const TrackingTimeline = ({ events }: TrackingTimelineProps) => {
  if (!events || events.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No history available.
      </p>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div
      className="space-y-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        return (
          <motion.div
            key={event.id || index}
            className="flex gap-3"
            variants={itemVariants}
          >
            <div className="flex flex-col items-center">
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isLast ? "bg-gray-900 text-white" : "bg-black/5 text-gray-500"
                }`}
                variants={iconVariants}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
              >
                {statusIcons[event.newStatus] || <Clock className="w-4 h-4" />}
              </motion.div>
              {!isLast && (
                <motion.div
                  className="w-px bg-border"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                  style={{ minHeight: "24px", originY: 0 }}
                />
              )}
            </div>
            <div className="pb-4 flex-1">
              <motion.p
                className="font-medium text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * index + 0.2, duration: 0.3 }}
              >
                {STATUS_LABELS[event.newStatus] || event.newStatus}
              </motion.p>
              {event.reason && (
                <motion.p
                  className="text-xs text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 * index + 0.3, duration: 0.3 }}
                >
                  {event.reason}
                </motion.p>
              )}
              <motion.p
                className="text-xs text-muted-foreground mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * index + 0.4, duration: 0.3 }}
              >
                {new Date(event.changedAt).toLocaleString("fr-FR")}
              </motion.p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default TrackingTimeline;

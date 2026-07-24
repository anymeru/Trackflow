import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export const STATUS_LABELS: Record<string, string> = {
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  delayed: "Delayed",
  customs_hold: "Customs Hold",
  fees_pending: "Fees Pending",
  returned: "Returned",
  lost: "Lost",
};

export const STATUS_COLORS: Record<string, string> = {
  in_transit: "bg-gradient-to-r from-cyan-500 to-teal-500 border-cyan-400/50 shadow-lg shadow-cyan-500/20",
  out_for_delivery: "bg-gradient-to-r from-blue-500 to-cyan-500 border-blue-400/50 shadow-lg shadow-blue-500/20",
  delivered: "bg-gradient-to-r from-emerald-500 to-green-500 border-emerald-400/50 shadow-lg shadow-emerald-500/20",
  delayed: "bg-gradient-to-r from-amber-500 to-yellow-500 border-amber-400/50 shadow-lg shadow-amber-500/20",
  customs_hold: "bg-gradient-to-r from-orange-500 to-amber-500 border-orange-400/50 shadow-lg shadow-orange-500/20",
  fees_pending: "bg-gradient-to-r from-amber-700 to-amber-600 border-amber-600/50 shadow-lg shadow-amber-600/20",
  returned: "bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400/50 shadow-lg shadow-purple-500/20",
  lost: "bg-gradient-to-r from-red-500 to-rose-500 border-red-400/50 shadow-lg shadow-red-500/20",
};

interface StatusBadgeProps {
  status: string;
  animate?: boolean;
  showGlow?: boolean;
}

const StatusBadge = ({ status, animate = true, showGlow = false }: StatusBadgeProps) => {
  const isInTransit = status === "in_transit";
  const isDelivered = status === "delivered";
  const animationClass = animate && isInTransit ? "animate-pulse-dot" : "";

  const badgeVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: { duration: 0.2 }
    },
  };

  const glowVariants = {
    initial: { scale: 1, opacity: 0 },
    animate: {
      scale: [1, 1.3, 1],
      opacity: [0.5, 0.8, 0],
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={badgeVariants}
      className="relative inline-block"
    >
      {(showGlow || isDelivered) && (
        <motion.div
          className={`absolute inset-0 rounded-full ${
            isDelivered
              ? "bg-emerald-400"
              : "bg-cyan-400"
          }`}
          variants={glowVariants}
          initial="initial"
          animate="animate"
        />
      )}
      <Badge
        className={`${
          STATUS_COLORS[status] ||
          "bg-gradient-to-r from-slate-400 to-slate-500 border-slate-400/50 shadow-lg shadow-slate-500/20"
        } ${animationClass} border font-medium text-white hover:shadow-xl transition-all duration-300 relative z-10`}
      >
        {STATUS_LABELS[status] || status}
      </Badge>
    </motion.div>
  );
};

export default StatusBadge;

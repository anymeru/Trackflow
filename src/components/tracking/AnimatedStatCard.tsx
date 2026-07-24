import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import type { ReactNode } from "react";

interface AnimatedStatCardProps {
  icon: ReactNode;
  value: number;
  label: string;
  iconColor?: string;
  delay?: number;
}

export const AnimatedCounter = ({ value, delay = 0 }: { value: number; delay?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1200;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setDisplayValue(Math.floor(value * progress));

      if (progress === 1) {
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue}</span>;
};

const AnimatedStatCard = ({
  icon,
  value,
  label,
  iconColor = "text-info",
  delay = 0,
}: AnimatedStatCardProps) => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: delay,
        ease: "easeOut" as const,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        delay: delay + 0.1,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
    >
      <Card className="p-4 group cursor-default transition-all duration-300 hover:shadow-lg hover:border-accent/30">
        <div className="flex items-center justify-between">
          <motion.div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 gradient-accent group-hover:scale-110 transition-transform duration-300 ${iconColor}`}
            variants={iconVariants}
          >
            {icon}
          </motion.div>
        </div>
        <motion.p
          className="text-2xl font-display font-bold mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.2 }}
        >
          <AnimatedCounter value={value} delay={delay} />
        </motion.p>
        <motion.p
          className="text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.3 }}
        >
          {label}
        </motion.p>
      </Card>
    </motion.div>
  );
};

export default AnimatedStatCard;

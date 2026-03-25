"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

type Feature = {
  title: string;
  description: string;
};

type FeaturesListProps = {
  features: Feature[];
  isInView: boolean;
};

export function FeaturesList({ features, isInView }: FeaturesListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.3 + index * 0.1 }}
          className="flex items-start gap-3"
        >
          <CheckCircle2
            size={18}
            className="text-electric-cyan mt-0.5 shrink-0"
          />
          <div>
            <span className="text-foreground font-medium text-sm">
              {feature.title}
            </span>
            <p className="text-muted-foreground text-xs mt-0.5">
              {feature.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

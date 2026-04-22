import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type Domain = {
  name: string;
  icon: LucideIcon;
};

type DomainCardsProps = {
  domains: Domain[];
  isInView: boolean;
};

export function DomainCards({ domains, isInView }: DomainCardsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      className="flex flex-wrap justify-center gap-4 mb-12"
    >
      {domains.map((domain, idx) => (
        <motion.div
          key={domain.name}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
          }
          transition={{ delay: 0.15 + idx * 0.1, duration: 0.5 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 20px rgba(0, 243, 189, 0.4)",
          }}
          className="px-6 py-3 rounded-lg border border-border bg-card/50 backdrop-blur-sm hover:border-electric-cyan transition-colors cursor-pointer"
        >
          <span className="text-sm font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <domain.icon
              size={16}
              className="text-[hsl(174_100%_35%)] dark:text-electric-cyan"
            />
            {domain.name}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

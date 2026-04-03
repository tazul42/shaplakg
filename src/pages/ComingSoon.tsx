import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Construction } from "lucide-react";

export default function ComingSoon() {
  const location = useLocation();
  const pageName = location.pathname.slice(1).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Page";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <div className="p-4 rounded-2xl bg-primary/10 mb-4">
        <Construction className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">{pageName}</h2>
      <p className="text-muted-foreground mt-2 max-w-md">
        This module is under development. It will be available in the next update.
      </p>
    </motion.div>
  );
}

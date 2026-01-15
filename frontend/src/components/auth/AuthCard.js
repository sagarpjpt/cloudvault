"use client";

import { motion } from "framer-motion";

export default function AuthCard({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="
          w-full
          max-w-md
          sm:max-w-lg
          bg-[var(--color-surface)]
          border
          border-[var(--color-border)]
          rounded-lg
          p-6
          sm:p-8
        "
      >
        {children}
      </motion.div>
    </div>
  );
}

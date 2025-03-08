import { motion } from 'framer-motion';

export function Logo() {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3].map((bar) => (
        <motion.div
          key={bar}
          className="w-1 h-8 bg-accent logo-bar"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: [1, 1.5, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: (bar - 1) * 0.2,
          }}
        />
      ))}
      <span className="ml-3 text-xl font-heading">RONAN DUMESNIL</span>
    </div>
  );
}
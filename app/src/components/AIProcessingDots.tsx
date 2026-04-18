import { motion } from 'framer-motion';

export function AIProcessingDots() {
  return (
    <div className="flex items-center justify-center gap-1.5 py-4">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="block w-2 h-2 rounded-full bg-royalBlue"
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

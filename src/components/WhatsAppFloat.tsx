import React from 'react';
import { motion } from 'motion/react';

interface Props {
  whatsappUrl: string;
}

export const WhatsAppFloat: React.FC<Props> = ({ whatsappUrl }) => {
  return (
    <aside aria-label="Community Chat Quick Link" className="fixed bottom-6 right-6 z-40">
      <motion.a
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, y: [0, -4, 0] }}
        transition={{
          scale: { type: 'spring', damping: 20, stiffness: 300, delay: 0.8 },
          y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
        }}
        whileHover={{ scale: 1.06, y: -6 }}
        whileTap={{ scale: 0.95 }}
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Join Mimikay Political Movement WhatsApp Community"
        className="group flex items-center gap-2.5 bg-white text-[#008037] hover:text-[#0a5d2c] px-4 py-2.5 rounded-full shadow-xl border border-emerald-100 hover:shadow-2xl transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-[#008037] focus:ring-offset-2"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <span className="font-bold text-sm tracking-tight text-gray-900 group-hover:text-[#008037] transition-colors">
          Join Community
        </span>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          className="w-5 h-5 flex-shrink-0"
        />
      </motion.a>
    </aside>
  );
};

import React from 'react';
import { motion } from 'framer-motion';

interface FinanceStatCardProps {
  title: string;
  value: string;
  subtitle: string;
  attention?: boolean;
}

const FinanceStatCard: React.FC<FinanceStatCardProps> = ({ title, value, subtitle, attention }) => (
  <motion.div
    className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-xl"
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5, scale: 1.03 }}
  >
    <p className="text-sm text-white/70">{title}</p>
    <p className={`text-3xl font-bold mt-1 ${attention ? 'text-yellow-400' : 'text-white'}`}>{value}</p>
    <p className={`text-xs mt-1 ${attention ? 'text-yellow-400/80' : 'text-white/60'}`}>{subtitle}</p>
  </motion.div>
);

export default FinanceStatCard;
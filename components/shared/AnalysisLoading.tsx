'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, AlertTriangle } from 'lucide-react';

export function AnalysisLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-4"
      >
        <Shield className="h-16 w-16 text-blue-500" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Analyzing Email Security
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Running threat detection and security checks...
        </p>
        
        <div className="flex items-center gap-6 justify-center text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>SPF/DKIM/DMARC</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Threat Detection</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Geolocation</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

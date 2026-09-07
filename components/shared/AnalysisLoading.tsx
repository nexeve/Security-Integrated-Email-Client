'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, AlertTriangle, Globe, Brain, Link2, CheckCircle } from 'lucide-react';

const analysisSteps = [
  { id: 'sender', label: 'Sender identity verification', icon: Shield },
  { id: 'auth', label: 'Email authentication (SPF/DKIM/DMARC)', icon: Lock },
  { id: 'content', label: 'Content analysis', icon: AlertTriangle },
  { id: 'url', label: 'URL analysis', icon: Link2 },
  { id: 'attachment', label: 'Attachment analysis', icon: AlertTriangle },
  { id: 'origin', label: 'Origin and geolocation', icon: Globe },
  { id: 'ai', label: 'AI investigation', icon: Brain },
];

export function AnalysisLoading() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentStep < analysisSteps.length) {
        setCompletedSteps(prev => new Set([...prev, currentStep]));
        setCurrentStep(prev => prev + 1);
      }
    }, 400); // Progress every 400ms

    return () => clearInterval(interval);
  }, [currentStep]);

  return (
    <div className="flex flex-col items-center justify-center h-96">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-6"
      >
        <Shield className="h-20 w-20 text-blue-500" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center w-full max-w-md"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Analyzing Email Security
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Running comprehensive threat detection and security analysis...
        </p>
        
        <div className="space-y-3">
          {analysisSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = completedSteps.has(index);
            const isCurrent = index === currentStep;
            const isPending = index > currentStep;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: isPending ? 0.3 : 1, 
                  x: 0 
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 p-3 rounded-lg"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-green-500 text-white' :
                  isCurrent ? 'bg-blue-500 text-white' :
                  'bg-gray-200 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                </div>
                <span className={`text-sm ${
                  isCompleted ? 'text-green-600' :
                  isCurrent ? 'text-blue-600 font-medium' :
                  'text-gray-400'
                }`}>
                  {step.label}
                </span>
                {isCurrent && (
                  <motion.div
                    className="ml-auto"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

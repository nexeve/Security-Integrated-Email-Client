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
  }, [currentStep, analysisSteps.length]);

  return (
    <div className="flex flex-col items-center justify-center h-96">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-6 relative"
      >
        <div 
          className="absolute inset-0 rounded-full blur-xl opacity-30" 
          style={{ background: 'var(--accent-cyan)' }} 
        />
        <Shield className="h-20 w-20 relative z-10" style={{ color: 'var(--accent-cyan)' }} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-6 rounded-2xl text-center w-full max-w-md"
      >
        <h3 className="text-xl font-semibold text-foreground mb-2 tracking-tight">
          Analyzing Email Security
        </h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Running comprehensive threat detection and heuristic security analysis...
        </p>
        
        <div className="space-y-3 text-left">
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
                className="flex items-center gap-3 p-3 rounded-xl glass-inset transition-colors duration-300"
                style={{
                  background: isCurrent ? 'oklch(0.720 0.140 200 / 10%)' : 'oklch(0 0 0 / 18%)',
                  borderColor: isCurrent ? 'var(--border-accent)' : 'oklch(1 0 0 / 6%)'
                }}
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{
                    background: isCompleted ? 'oklch(0.66 0.155 145 / 15%)' : 
                                isCurrent ? 'oklch(0.720 0.140 200 / 20%)' : 
                                'oklch(1 0 0 / 5%)',
                    color: isCompleted ? 'var(--safe)' : 
                           isCurrent ? 'var(--accent-cyan)' : 
                           'var(--muted-foreground)'
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                </div>
                
                <span 
                  className="text-sm transition-colors duration-300"
                  style={{
                    color: isCompleted ? 'var(--safe)' : 
                           isCurrent ? 'var(--accent-cyan)' : 
                           'var(--muted-foreground)',
                    fontWeight: isCurrent ? 600 : 400
                  }}
                >
                  {step.label}
                </span>
                
                {isCurrent && (
                  <motion.div
                    className="ml-auto"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ background: 'var(--accent-cyan)', boxShadow: '0 0 8px var(--accent-cyan)' }} 
                    />
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

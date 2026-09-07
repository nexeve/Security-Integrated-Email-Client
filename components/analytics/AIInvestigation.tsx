'use client';

import { Card } from '@/components/ui/card';
import type { AIInvestigation } from '@/lib/types';
import { Brain, CheckCircle, AlertTriangle, Target, Clock } from 'lucide-react';

interface AIInvestigationProps {
  investigation: AIInvestigation;
}

export function AIInvestigation({ investigation }: AIInvestigationProps) {
  return (
    <Card className="p-6 bg-gray-900 border-gray-800">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="h-5 w-5 text-blue-400" />
        <h2 className="text-lg font-semibold text-white">AI Investigation</h2>
        <div className="ml-auto flex items-center gap-2 text-xs text-gray-400">
          <Clock className="h-3 w-3" />
          {new Date(investigation.analysisTimestamp).toLocaleString()}
        </div>
      </div>

      {/* Executive Assessment */}
      <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">Executive Assessment</h3>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">
          {investigation.executiveAssessment}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Evidence */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <h3 className="text-sm font-semibold text-white">Key Evidence</h3>
          </div>
          <div className="space-y-2">
            {investigation.keyEvidence.map((evidence, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-2 bg-gray-800 rounded border border-gray-700"
              >
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
                <span className="text-xs text-gray-300">{evidence}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social Engineering Indicators */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <h3 className="text-sm font-semibold text-white">
              Social Engineering Indicators
            </h3>
          </div>
          <div className="space-y-2">
            {investigation.socialEngineeringIndicators.length > 0 ? (
              investigation.socialEngineeringIndicators.map((indicator, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 bg-gray-800 rounded border border-gray-700"
                >
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-xs text-gray-300">{indicator}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-gray-500 p-2 bg-gray-800 rounded border border-gray-700">
                No social engineering indicators detected
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">Recommended Actions</h3>
        </div>
        <div className="space-y-2">
          {investigation.recommendedActions.map((action, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-3 bg-gray-800 rounded-lg border border-gray-700"
            >
              <div className="flex-shrink-0 w-5 h-5 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>
              <span className="text-sm text-gray-300">{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Confidence Badge */}
      <div className="mt-6 flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
        <span className="text-sm text-gray-400">Analysis Confidence</span>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${investigation.confidence}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-white">
            {investigation.confidence}%
          </span>
        </div>
      </div>
    </Card>
  );
}

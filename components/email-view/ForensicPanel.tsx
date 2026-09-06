import { Card } from '@/components/ui/card';
import { ForensicInfo } from '@/lib/types';

interface ForensicPanelProps {
  forensic: ForensicInfo;
}

export function ForensicPanel({ forensic }: ForensicPanelProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Forensic Analysis</h3>
      
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Summary</h4>
        <p className="text-sm text-gray-600">{forensic.summary}</p>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Score Factors</h4>
        <div className="space-y-2">
          {forensic.scoreFactors.map((factor, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-3 border rounded-lg bg-gray-50"
            >
              <div className="flex-1">
                <div className="text-sm font-medium">{factor.factor}</div>
                <div className="text-xs text-gray-500 mt-1">{factor.description}</div>
              </div>
              <div
                className={`text-sm font-bold ${
                  factor.impact >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {factor.impact >= 0 ? '+' : ''}{factor.impact}
              </div>
            </div>
          ))}
        </div>
      </div>

      {forensic.recommendations.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Recommendations</h4>
          <ul className="space-y-2">
            {forensic.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <span className="text-yellow-600 mr-2">⚠</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Technical Details</h4>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs font-mono overflow-x-auto">
          <div className="space-y-1">
            {Object.entries(forensic.technicalDetails.headers).map(([key, value]) => (
              <div key={key}>
                <span className="text-blue-400">{key}:</span> {value}
              </div>
            ))}
            <div className="mt-2 pt-2 border-t border-gray-700">
              <span className="text-blue-400">Analysis Timestamp:</span> {forensic.technicalDetails.analysisTimestamp}
            </div>
            <div>
              <span className="text-blue-400">Analysis Version:</span> {forensic.technicalDetails.analysisVersion}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

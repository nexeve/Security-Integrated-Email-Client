'use client';

import { Card } from '@/components/ui/card';
import type { EvidencePackage } from '@/lib/types';
import { FileText, Download, Share2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EvidencePackageProps {
  evidence: EvidencePackage;
  onExport?: (format: 'pdf' | 'json' | 'xml') => void;
}

export function EvidencePackage({ evidence, onExport }: EvidencePackageProps) {
  const handleExport = (format: 'pdf' | 'json' | 'xml') => {
    if (onExport) {
      onExport(format);
    } else {
      // Default behavior for prototype
      console.log(`Exporting evidence as ${format.toUpperCase()}`);
      alert(`Evidence export as ${format.toUpperCase()} - Prototype functionality`);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold">Final Evidence Package</h2>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <div className="text-sm font-medium text-blue-900 mb-1">
              Complete Forensic Analysis Report
            </div>
            <p className="text-sm text-blue-700">{evidence.summary}</p>
          </div>
        </div>
      </div>

      {/* Report Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetadataItem
          icon={FileText}
          label="Report ID"
          value={evidence.reportId}
        />
        <MetadataItem
          icon={Clock}
          label="Generated"
          value={new Date(evidence.generatedAt).toLocaleString()}
        />
        <MetadataItem
          icon={FileText}
          label="Analysis Version"
          value={evidence.analysisVersion}
        />
      </div>

      {/* Export Options */}
      <div>
        <div className="text-sm font-medium text-gray-900 mb-3">Export Evidence</div>
        <div className="flex flex-wrap gap-3">
          {evidence.exportFormats.map((format) => (
            <Button
              key={format}
              variant="outline"
              onClick={() => handleExport(format)}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export as {format.toUpperCase()}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share Report
          </Button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600">
          This evidence package contains the complete security analysis results for forensic purposes. 
          All timestamps and analysis metadata are included for audit trail purposes.
        </p>
      </div>
    </Card>
  );
}

function MetadataItem({ 
  icon: Icon, 
  label, 
  value 
}: { 
  icon: any; 
  label: string; 
  value: string; 
}) {
  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
      <Icon className="h-4 w-4 text-gray-500 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-600">{label}</div>
        <div className="text-sm font-medium text-gray-900 truncate">{value}</div>
      </div>
    </div>
  );
}

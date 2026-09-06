'use client';

import { useEmails } from '@/lib/api/emails';
import { Inbox, Star, Send, FileText, Trash, AlertTriangle, Shield, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navItems = [
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'starred', label: 'Starred', icon: Star },
  { id: 'sent', label: 'Sent', icon: Send },
  { id: 'drafts', label: 'Drafts', icon: FileText },
  { id: 'spam', label: 'Spam', icon: AlertTriangle },
  { id: 'trash', label: 'Trash', icon: Trash },
];

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { data: emails } = useEmails();

  // Calculate security stats
  const stats = emails?.reduce(
    (acc, email) => {
      acc.total++;
      if (email.analysis.safetyScore >= 80) acc.safe++;
      else if (email.analysis.safetyScore >= 50) acc.moderate++;
      else acc.dangerous++;
      
      if (email.analysis.category === 'promotional') acc.promotional++;
      if (email.analysis.category === 'suspicious' || email.analysis.category === 'malicious') {
        acc.threats++;
      }
      return acc;
    },
    { total: 0, safe: 0, moderate: 0, dangerous: 0, promotional: 0, threats: 0 }
  ) || { total: 0, safe: 0, moderate: 0, dangerous: 0, promotional: 0, threats: 0 };

  return (
    <aside className="w-64 border-r bg-gray-50 flex flex-col h-full">
      <div className="lg:hidden flex items-center justify-between p-4 border-b">
        <span className="font-semibold text-gray-900">Menu</span>
        <button
          onClick={onCloseMobile}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === '/' && item.id === 'inbox';
            const count = item.id === 'inbox' ? stats.total : undefined;
            
            return (
              <li key={item.id}>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    if (onCloseMobile) onCloseMobile();
                  }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {count !== undefined && count > 0 && (
                    <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
          <Shield className="h-4 w-4 text-blue-600" />
          <span>Security Analysis</span>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Emails Analyzed</span>
            <span className="font-medium">{stats.total}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Safe</span>
            <span className="font-medium text-green-600">{stats.safe}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Moderate Risk</span>
            <span className="font-medium text-yellow-600">{stats.moderate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Dangerous</span>
            <span className="font-medium text-red-600">{stats.dangerous}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Promotional</span>
            <span className="font-medium text-blue-600">{stats.promotional}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Threats Detected</span>
            <span className="font-medium text-red-600">{stats.threats}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

'use client';

import { useEmails } from '@/lib/api/emails';
import {
  Inbox, Star, Send, FileText, Trash, AlertTriangle,
  Shield, X, ShieldAlert, Tag, Users,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const navItems = [
  { id: 'inbox',      label: 'Inbox',      icon: Inbox },
  { id: 'starred',   label: 'Starred',    icon: Star },
  { id: 'sent',      label: 'Sent',       icon: Send },
  { id: 'drafts',    label: 'Drafts',     icon: FileText },
  { id: 'promotions', label: 'Promotions', icon: Tag },
  { id: 'social',    label: 'Social',     icon: Users },
  { id: 'spam',      label: 'Spam',       icon: AlertTriangle },
  { id: 'trash',     label: 'Trash',      icon: Trash },
];

interface SidebarProps {
  onCloseMobile?: () => void;
  onCompose?: () => void;
}

export function Sidebar({ onCloseMobile, onCompose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFolder = searchParams.get('folder') || 'inbox';
  const { data: inboxEmails } = useEmails('inbox');
  const { data: promoEmails } = useEmails('promotions');
  const { data: socialEmails } = useEmails('social');
  // Security HUD stats are computed across all categorised mailboxes so the
  // threat bar reflects the full picture.  Each message appears in exactly one
  // of these three data sets (inbox / promotions / social) — no double-counting.
  const emails = [...(inboxEmails || []), ...(promoEmails || []), ...(socialEmails || [])];

  const stats = emails?.reduce(
    (acc, email) => {
      acc.total++;
      const riskLevel = email.analysis.threatOverview?.riskLevel || 'safe';
      
      if (riskLevel === 'safe') acc.safe++;
      else if (riskLevel === 'low' || riskLevel === 'medium') acc.moderate++;
      else acc.dangerous++;

      if (email.analysis.category === 'promotional') acc.promotional++;
      
      if (riskLevel === 'high' || riskLevel === 'critical' || email.analysis.category === 'suspicious' || email.analysis.category === 'malicious') {
        acc.threats++;
      }
      return acc;
    },
    { total: 0, safe: 0, moderate: 0, dangerous: 0, promotional: 0, threats: 0 }
  ) || { total: 0, safe: 0, moderate: 0, dangerous: 0, promotional: 0, threats: 0 };

  const safePercent   = stats.total > 0 ? (stats.safe   / stats.total) * 100 : 0;
  const modPercent    = stats.total > 0 ? (stats.moderate / stats.total) * 100 : 0;

  return (
    <aside
      className="w-64 flex flex-col h-full flex-shrink-0"
      style={{
        background: 'var(--sidebar)',
        borderRight: '1px solid oklch(1 0 0 / 6%)',
        boxShadow: 'inset -1px 0 0 oklch(1 0 0 / 4%)',
      }}
    >
      {/* Mobile close row */}
      <div
        className="lg:hidden flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid oklch(1 0 0 / 6%)' }}
      >
        <span className="text-sm font-medium text-foreground">Navigation</span>
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          style={{ background: 'oklch(1 0 0 / 5%)' }}
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-3 pt-4 pb-2">
        <button
          onClick={() => { if (onCompose) onCompose(); }}
          className="w-full btn-tactile rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm font-semibold shadow-sm transition-all group"
          style={{ 
            color: 'var(--foreground)',
            background: 'linear-gradient(145deg, oklch(0.58 0.17 200 / 90%), oklch(0.45 0.14 235 / 90%))',
            boxShadow: '0 4px 14px oklch(0.72 0.14 200 / 30%), inset 0 1px 0 oklch(1 0 0 / 25%)',
            border: '1px solid oklch(0.72 0.14 200 / 50%)'
          }}
        >
          <span className="text-lg leading-none mb-0.5">+</span> Compose
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === '/' && currentFolder === item.id;
          let count = undefined;
          if (item.id === 'inbox') count = inboxEmails?.filter(e => e.isUnread).length;
          if (item.id === 'promotions') count = promoEmails?.filter(e => e.isUnread).length;
          if (item.id === 'social') count = socialEmails?.filter(e => e.isUnread).length;

          return (
            <button
              key={item.id}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 text-left"
              style={
                isActive
                  ? {
                      background: 'oklch(0.720 0.140 200 / 12%)',
                      color: 'var(--accent-cyan)',
                      boxShadow: 'inset 0 0 0 1px oklch(0.720 0.140 200 / 20%)',
                    }
                  : { color: 'var(--muted-foreground)', background: 'transparent' }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'oklch(1 0 0 / 4%)';
                  e.currentTarget.style.color = 'var(--foreground)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--muted-foreground)';
                }
              }}
              onClick={() => {
                router.push(item.id === 'inbox' ? '/' : `/?folder=${item.id}`);
                if (onCloseMobile) onCloseMobile();
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
              {count !== undefined && count > 0 && (
                <span
                  className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-medium tabular-nums"
                  style={{
                    background: isActive
                      ? 'oklch(0.720 0.140 200 / 20%)'
                      : 'oklch(1 0 0 / 8%)',
                    color: isActive ? 'var(--accent-cyan)' : 'var(--muted-foreground)',
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Security Telemetry HUD */}
      <div
        className="mx-3 mb-4 rounded-xl p-4 space-y-3"
        style={{
          background: 'oklch(0.085 0.025 258)',
          border: '1px solid oklch(1 0 0 / 6%)',
          boxShadow: 'inset 0 1px 0 oklch(1 0 0 / 4%)',
        }}
      >
        {/* HUD header */}
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ background: 'oklch(0.720 0.140 200 / 15%)' }}
          >
            <Shield className="h-3.5 w-3.5 text-accent" style={{ color: 'var(--accent-cyan)' }} />
          </div>
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--accent-cyan)' }}
          >
            Security HUD
          </span>
          {stats.threats > 0 && (
            <ShieldAlert className="h-3.5 w-3.5 ml-auto animate-pulse" style={{ color: 'var(--danger)' }} />
          )}
        </div>

        {/* Analyzed count */}
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">Analyzed</span>
          <span className="text-sm font-semibold tabular-nums" style={{ color: 'var(--foreground)' }}>
            {stats.total}
          </span>
        </div>

        {/* Stacked bar */}
        {stats.total > 0 && (
          <div className="space-y-1">
            <div className="flex h-1.5 rounded-full overflow-hidden gap-px">
              <div
                className="rounded-full transition-all duration-700"
                style={{
                  width: `${safePercent}%`,
                  background: 'var(--safe)',
                  opacity: 0.85,
                }}
              />
              <div
                className="rounded-full transition-all duration-700"
                style={{
                  width: `${modPercent}%`,
                  background: 'var(--warning)',
                  opacity: 0.85,
                }}
              />
              <div
                className="rounded-full transition-all duration-700"
                style={{
                  width: `${Math.max(100 - safePercent - modPercent, 0)}%`,
                  background: 'var(--danger)',
                  opacity: 0.85,
                }}
              />
            </div>
            <div className="flex text-xs gap-3">
              <span style={{ color: 'var(--safe)' }}>
                <span className="tabular-nums font-medium">{stats.safe}</span> safe
              </span>
              <span style={{ color: 'var(--warning)' }}>
                <span className="tabular-nums font-medium">{stats.moderate}</span> mod
              </span>
              <span style={{ color: 'var(--danger)' }}>
                <span className="tabular-nums font-medium">{stats.dangerous}</span> risk
              </span>
            </div>
          </div>
        )}

        {/* Threat line */}
        <div
          className="flex items-center justify-between rounded-lg px-3 py-2"
          style={{
            background: stats.threats > 0
              ? 'oklch(0.620 0.220 25 / 10%)'
              : 'oklch(1 0 0 / 4%)',
            border: stats.threats > 0
              ? '1px solid oklch(0.620 0.220 25 / 20%)'
              : '1px solid oklch(1 0 0 / 6%)',
          }}
        >
          <span className="text-xs text-muted-foreground">Threats</span>
          <span
            className="text-sm font-bold tabular-nums"
            style={{ color: stats.threats > 0 ? 'var(--danger)' : 'var(--safe)' }}
          >
            {stats.threats > 0 ? stats.threats : '—'}
          </span>
        </div>

        {/* Promo line */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Promotional</span>
          <span style={{ color: 'var(--accent-cyan)' }} className="font-medium tabular-nums">
            {stats.promotional}
          </span>
        </div>
      </div>
    </aside>
  );
}

'use client';

import { Search, Settings, User, Menu, Shield } from 'lucide-react';
import { showPrototypeToast } from '@/lib/utils';

interface AppHeaderProps {
  onMenuClick?: () => void;
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  return (
    <header
      className="glass-header h-14 flex items-center justify-between px-4 flex-shrink-0 relative z-30"
    >
      {/* Left — mobile menu + branding */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl transition-all text-muted-foreground hover:text-foreground btn-tactile"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5">
          {/* Shield icon with cyan glow */}
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(145deg, oklch(0.58 0.17 200), oklch(0.45 0.14 235))',
              boxShadow: '0 0 12px oklch(0.72 0.14 200 / 35%), inset 0 1px 0 oklch(1 0 0 / 20%)',
            }}
          >
            <Shield className="h-4 w-4 text-white" />
          </div>

          <div className="font-semibold text-lg tracking-tight select-none leading-none">
            <span style={{ color: 'var(--accent-cyan)' }}>Cyber</span>
            <span style={{ color: 'oklch(0.920 0.008 240)' }}> Leek</span>
          </div>
        </div>
      </div>

      {/* Centre — search bar */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
            style={{ color: 'oklch(0.920 0.008 240 / 40%)' }}
          />
          <input
            type="text"
            placeholder="Search emails, senders, threats…"
            className="w-full pl-9 pr-4 py-1.5 text-sm rounded-xl transition-all duration-200 outline-none"
            style={{
              background: 'oklch(0 0 0 / 20%)',
              border: '1px solid oklch(1 0 0 / 8%)',
              color: 'var(--foreground)',
              backdropFilter: 'blur(8px)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = 'oklch(0 0 0 / 28%)';
              e.currentTarget.style.border = '1px solid oklch(0.720 0.140 200 / 30%)';
              e.currentTarget.style.boxShadow = '0 0 0 3px oklch(0.720 0.140 200 / 10%), inset 0 1px 0 oklch(1 0 0 / 6%)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = 'oklch(0 0 0 / 20%)';
              e.currentTarget.style.border = '1px solid oklch(1 0 0 / 8%)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                showPrototypeToast('Search not implemented in prototype');
              }
            }}
          />
        </div>
      </div>

      {/* Right — icon controls */}
      <div className="flex items-center gap-1.5">
        <button
          className="p-2 rounded-xl transition-all text-muted-foreground hover:text-foreground btn-tactile"
          aria-label="Settings"
          onClick={() => showPrototypeToast('Settings not implemented in prototype')}
        >
          <Settings className="h-4.5 w-4.5" style={{ width: '1.1rem', height: '1.1rem' }} />
        </button>

        <button
          className="p-1.5 rounded-xl transition-all btn-tactile"
          aria-label="Profile"
          onClick={() => showPrototypeToast('Account not implemented in prototype')}
        >
          <User className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}

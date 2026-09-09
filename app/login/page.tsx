import { Shield } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex flex-col h-screen bg-atmospheric items-center justify-center p-4">
      {/* Background ambient light */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20 blur-[100px]"
        style={{ background: 'radial-gradient(circle, oklch(0.72 0.14 200) 0%, transparent 70%)' }}
      />
      
      <div 
        className="w-full max-w-sm rounded-2xl p-8 flex flex-col items-center relative z-10"
        style={{
          background: 'oklch(0.12 0.025 258 / 80%)',
          border: '1px solid oklch(1 0 0 / 10%)',
          boxShadow: '0 12px 40px oklch(0 0 0 / 50%), inset 0 1px 0 oklch(1 0 0 / 15%)',
          backdropFilter: 'blur(16px)'
        }}
      >
        <div className="mb-6 flex flex-col items-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: 'linear-gradient(145deg, oklch(0.58 0.17 200), oklch(0.45 0.14 235))',
              boxShadow: '0 0 20px oklch(0.72 0.14 200 / 40%), inset 0 1px 0 oklch(1 0 0 / 25%)',
            }}
          >
            <Shield className="h-7 w-7 text-white" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-center leading-none">
            <span style={{ color: 'var(--accent-cyan)' }}>Cyber</span>
            <span style={{ color: 'oklch(0.920 0.008 240)' }}> Leek</span>
          </h1>
          <p className="text-sm mt-3 text-muted-foreground font-medium uppercase tracking-widest">
            Secure email, analyzed.
          </p>
        </div>

        <a 
          href="/api/auth/google"
          className="w-full btn-tactile rounded-xl py-3.5 px-4 flex items-center justify-center gap-3 text-sm font-medium transition-all group"
          style={{ color: 'var(--foreground)' }}
        >
          <svg className="h-5 w-5 opacity-90 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </a>
      </div>
    </div>
  );
}

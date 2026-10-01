import React, { useState } from 'react';
import { Anchor, Shield, Sparkles, ArrowRight, Lock, Mail, CheckCircle2, Globe, Cpu } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const Screen01_Login: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('prabhakar.admin@maritime.com');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#060b17] light:bg-[#f4f6fb] text-slate-100 light:text-slate-900 overflow-hidden relative transition-colors">
      {/* Top right theme toggle */}
      <div className="absolute top-5 right-6 z-50">
        <ThemeToggle variant="compact" />
      </div>

      {/* Background visual accents */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Left Column: Hero & Value Proposition */}
      <div className="hidden lg:flex lg:w-3/5 flex-col justify-between p-12 relative border-r border-slate-800/60 light:border-slate-200 z-10 bg-gradient-to-br from-slate-950/90 via-slate-900/60 to-slate-950/90 light:from-white/95 light:via-slate-50/90 light:to-white/95 backdrop-blur-sm transition-colors">
        {/* Brand header */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <Anchor className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-white light:text-slate-900 flex items-center gap-2">
              <span>Maritime Optimizer</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 light:bg-cyan-100 light:text-cyan-800 border border-cyan-500/40 light:border-cyan-300 font-mono font-semibold">
                SIH26138
              </span>
            </div>
            <div className="text-xs text-slate-400 light:text-slate-500 font-medium">Smart Fleet & Fuel Intelligence Platform</div>
          </div>
        </div>

        {/* Center Hero */}
        <div className="space-y-6 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 light:bg-cyan-50 border border-cyan-500/30 light:border-cyan-200 text-xs text-cyan-300 light:text-cyan-800 font-medium">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 light:text-cyan-600" />
            <span>Quantum-Inspired Multi-Objective Evolutionary Optimization</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white light:text-slate-900 leading-tight">
            Smart Maritime <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600">
              Fleet Optimization
            </span>
          </h1>

          <p className="text-sm text-slate-300 light:text-slate-600 leading-relaxed">
            Optimizing voyages. Reducing bunker fuel expenditure. Lowering lifecycle GHG emissions across global shipping lanes with real-time AIS telemetry and AI predictive intelligence.
          </p>

          {/* Three Feature Pillars */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-slate-900/80 light:bg-white border border-slate-800/80 light:border-slate-200 backdrop-blur shadow-sm">
              <div className="h-8 w-8 rounded-lg bg-emerald-950/80 light:bg-emerald-100 border border-emerald-500/30 light:border-emerald-300 flex items-center justify-center mb-2.5">
                <Globe className="h-4 w-4 text-emerald-400 light:text-emerald-600" />
              </div>
              <div className="text-xs font-bold text-white light:text-slate-900">Fuel Efficient</div>
              <div className="text-[11px] text-slate-400 light:text-slate-500 mt-1">14.2% average bunker fuel reduction</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 light:bg-white border border-slate-800/80 light:border-slate-200 backdrop-blur shadow-sm">
              <div className="h-8 w-8 rounded-lg bg-blue-950/80 light:bg-blue-100 border border-blue-500/30 light:border-blue-300 flex items-center justify-center mb-2.5">
                <Cpu className="h-4 w-4 text-blue-400 light:text-blue-600" />
              </div>
              <div className="text-xs font-bold text-white light:text-slate-900">Cost Optimized</div>
              <div className="text-[11px] text-slate-400 light:text-slate-500 mt-1">Multi-objective fleet allocation</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 light:bg-white border border-slate-800/80 light:border-slate-200 backdrop-blur shadow-sm">
              <div className="h-8 w-8 rounded-lg bg-cyan-950/80 light:bg-cyan-100 border border-cyan-500/30 light:border-cyan-300 flex items-center justify-center mb-2.5">
                <Shield className="h-4 w-4 text-cyan-400 light:text-cyan-600" />
              </div>
              <div className="text-xs font-bold text-white light:text-slate-900">Lower Emissions</div>
              <div className="text-[11px] text-slate-400 light:text-slate-500 mt-1">IMO CII 'A' & EU ETS compliant</div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-slate-400 light:text-slate-500 border-t border-slate-800/80 light:border-slate-200 pt-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 light:text-emerald-600" />
            <span>Operational Decision Support Platform</span>
          </div>
          <div className="font-mono text-[11px]">System Status: All 12 Services Online</div>
        </div>
      </div>

      {/* Right Column: Login Card */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center items-center p-8 sm:p-12 z-10">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 flex items-center justify-center mx-auto shadow-md">
              <Anchor className="h-6 w-6 text-cyan-400 light:text-cyan-600" />
            </div>
            <h2 className="text-2xl font-bold text-white light:text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-xs text-slate-400 light:text-slate-500">Login to access your fleet operations dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 light:text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@maritime.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900/90 light:bg-white border border-slate-700/80 light:border-slate-300 text-sm text-white light:text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300 light:text-slate-700">Password</label>
                <a href="#forgot" className="text-xs text-cyan-400 light:text-cyan-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900/90 light:bg-white border border-slate-700/80 light:border-slate-300 text-sm text-white light:text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 light:text-slate-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-900 light:bg-white border-slate-700 light:border-slate-300 text-cyan-500 focus:ring-cyan-500"
                />
                <span>Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Login to Control Center</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* SSO Options */}
          <div className="space-y-3 pt-2">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 light:border-slate-200 w-full" />
              <span className="bg-[#060b17] light:bg-[#f4f6fb] px-3 text-[11px] text-slate-400 light:text-slate-500 uppercase tracking-wider relative">
                Or continue with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onLoginSuccess}
                className="py-2 px-3 rounded-lg bg-slate-900/90 light:bg-white border border-slate-800 light:border-slate-200 text-xs font-medium text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-900 hover:border-slate-700 light:hover:border-slate-300 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.8 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/>
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
                </svg>
                <span>Google</span>
              </button>

              <button
                onClick={onLoginSuccess}
                className="py-2 px-3 rounded-lg bg-slate-900/90 light:bg-white border border-slate-800 light:border-slate-200 text-xs font-medium text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-900 hover:border-slate-700 light:hover:border-slate-300 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M1 1h10v10H1z"/>
                  <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                  <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                  <path fill="#FFB900" d="M13 13h10v10H13z"/>
                </svg>
                <span>Microsoft</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400 light:text-slate-500 pt-2">
            <span>Demo Fleet Manager credentials pre-filled. Click </span>
            <button onClick={onLoginSuccess} className="text-cyan-400 light:text-cyan-600 font-semibold hover:underline cursor-pointer">
              Login to Enter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

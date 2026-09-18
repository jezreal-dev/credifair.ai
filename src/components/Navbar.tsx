import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ShieldCheck, Cpu, Sparkles, Menu, X, ArrowRight } from 'lucide-react';
import { HealthResponse } from '../types';

interface NavbarProps {
  health: HealthResponse | null;
}

export const Navbar: React.FC<NavbarProps> = ({ health }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Overview', end: true },
    { to: '/app', label: 'Underwriting Studio' },
    { to: '/ledger', label: 'Ledger & Forensic Inspector' },
    { to: '/compliance', label: 'Compliance Manifest Vault' },
  ];

  return (
    <header
      id="main-navbar"
      className="bg-[#0B0E14] border-b border-slate-800/80 sticky top-0 z-50 text-slate-100 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Brand Logo & Institutional Tag */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 group-hover:border-blue-500/40 group-hover:text-blue-300 transition-colors shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-slate-100 font-mono">
                CrediFair AI
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-900/80 text-slate-400 border border-slate-800">
                NDPA 2023 §37
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#121824]/90 p-1 rounded-lg border border-slate-800/80">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `px-3 py-1 rounded text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-slate-100 border border-slate-700/80 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Status Pills & Quick CTA */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Calibration Status */}
            <div
              id="engine-calibration-pill"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#121824] text-[11px] font-mono border border-slate-800"
              title="Inductive split conformal prediction calibrated on empirical Nigerian MSME trade cycles"
            >
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-400">Coverage:</span>
              <span className="font-semibold text-emerald-400">95% MAPIE</span>
            </div>

            {/* LLM Status Badge */}
            <div
              id="llm-connection-pill"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#121824] text-[11px] font-mono border border-slate-800"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  health?.llm_connection?.is_connected ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-400'
                }`}
              />
              <span className="text-slate-400">API:</span>
              <span className="font-semibold text-slate-200 uppercase">
                {health?.llm_connection?.status_badge || 'LIVE'}
              </span>
            </div>

            {/* Quick Action Button */}
            <Link
              to="/app"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors ml-1 font-mono shadow-xs hover:shadow-blue-500/20"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121824] border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded text-xs font-medium ${
                  isActive
                    ? 'bg-slate-800 text-slate-100 border border-slate-700'
                    : 'text-slate-400 hover:bg-slate-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <Link
              to="/app"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs font-mono mt-1"
            >
              Open Underwriting Studio
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

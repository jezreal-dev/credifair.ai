import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { HealthResponse } from '../types';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  health: HealthResponse | null;
}

export const Navbar: React.FC<NavbarProps> = ({ health }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      id="main-navbar"
      className="bg-white border-b border-slate-100 sticky top-0 z-50 text-[#210F60] shadow-[0_2px_12px_rgba(33,15,96,0.04)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Custom Brand Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <BrandLogo size={40} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[15px] font-semibold text-[#210F60]">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `transition-colors hover:text-[#1DCF9F] ${
                  isActive ? 'text-[#1DCF9F]' : 'text-[#210F60]'
                }`
              }
            >
              Overview
            </NavLink>

            <NavLink
              to="/app"
              className={({ isActive }) =>
                `transition-colors hover:text-[#1DCF9F] flex items-center gap-1.5 ${
                  isActive ? 'text-[#1DCF9F]' : 'text-[#210F60]'
                }`
              }
            >
              <span>Underwriting Studio</span>
              <span className="bg-[#1DCF9F]/15 text-[#006c51] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                LIVE
              </span>
            </NavLink>

            <NavLink
              to="/ledger"
              className={({ isActive }) =>
                `transition-colors hover:text-[#1DCF9F] ${
                  isActive ? 'text-[#1DCF9F]' : 'text-[#210F60]'
                }`
              }
            >
              Sanitized Ledger
            </NavLink>

            <NavLink
              to="/compliance"
              className={({ isActive }) =>
                `transition-colors hover:text-[#1DCF9F] ${
                  isActive ? 'text-[#1DCF9F]' : 'text-[#210F60]'
                }`
              }
            >
              Compliance Vault
            </NavLink>
          </nav>

          {/* Right CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-2 bg-[#F8FBFF] border border-[#1DCF9F]/20 px-3 py-1.5 rounded-full text-xs font-medium text-[#210F60]">
              <ShieldCheck className="w-4 h-4 text-[#1DCF9F]" />
              <span>Zero Landed Collateral Credit</span>
            </div>

            <Link
              to="/app"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#1DCF9F] hover:bg-[#1ac395] text-[#210F60] font-bold text-sm transition-all shadow-[0_4px_14px_rgba(29,207,159,0.3)] hover:shadow-[0_6px_20px_rgba(29,207,159,0.4)]"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#210F60] hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-5 pt-3 pb-6 space-y-3 shadow-lg">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-xl font-semibold text-sm ${
                isActive ? 'bg-[#F4FFF8] text-[#1DCF9F]' : 'text-[#210F60] hover:bg-slate-50'
              }`
            }
          >
            Overview
          </NavLink>
          <NavLink
            to="/app"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-xl font-semibold text-sm ${
                isActive ? 'bg-[#F4FFF8] text-[#1DCF9F]' : 'text-[#210F60] hover:bg-slate-50'
              }`
            }
          >
            Underwriting Studio
          </NavLink>
          <NavLink
            to="/ledger"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-xl font-semibold text-sm ${
                isActive ? 'bg-[#F4FFF8] text-[#1DCF9F]' : 'text-[#210F60] hover:bg-slate-50'
              }`
            }
          >
            Sanitized Ledger
          </NavLink>
          <NavLink
            to="/compliance"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-xl font-semibold text-sm ${
                isActive ? 'bg-[#F4FFF8] text-[#1DCF9F]' : 'text-[#210F60] hover:bg-slate-50'
              }`
            }
          >
            Compliance Manifest Vault
          </NavLink>

          <div className="pt-3 border-t border-slate-100">
            <Link
              to="/app"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#1DCF9F] text-[#210F60] font-bold text-sm shadow-md"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

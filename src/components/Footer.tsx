import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Github } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer id="app-footer" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 text-xs text-slate-500 border-t border-slate-200 mt-16">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8">
        <BrandLogo size={32} />
        <div className="flex items-center gap-6 text-slate-600 font-medium flex-wrap justify-center">
          <Link to="/" className="hover:text-[#1DCF9F] transition-colors">Home</Link>
          <Link to="/app" className="hover:text-[#1DCF9F] transition-colors">Studio</Link>
          <Link to="/ledger" className="hover:text-[#1DCF9F] transition-colors">Sanitized Ledger</Link>
          <Link to="/compliance" className="hover:text-[#1DCF9F] transition-colors">Compliance Vault</Link>
        </div>
      </div>

      <div className="border-t border-slate-200/70 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <span>
            © {new Date().getFullYear()} CrediFair AI. Built for fair, collateral-free credit underwriting.
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="text-slate-400">
            Empirical Conformal Prediction • Finite-Sample Coverage
          </span>
        </div>

        {/* Developer Attribution & Social Links */}
        <div className="flex items-center gap-3 bg-white px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-2xs">
          <span className="text-slate-500">
            Developed by{' '}
            <a
              id="footer-developer-link"
              href="https://www.linkedin.com/in/jezreal-momoh/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#210F60] hover:text-[#1DCF9F] transition-colors underline decoration-slate-300 underline-offset-2 hover:decoration-[#1DCF9F]"
              title="Jezreal Momoh on LinkedIn"
            >
              Jezreal Momoh
            </a>
          </span>

          <span className="w-px h-3.5 bg-slate-200" aria-hidden="true" />

          <div className="flex items-center gap-2">
            <a
              id="footer-linkedin-link"
              href="https://www.linkedin.com/in/jezreal-momoh/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded text-slate-500 hover:text-[#1DCF9F] hover:bg-[#F8FBFF] transition-all"
              aria-label="LinkedIn Profile"
              title="LinkedIn: Jezreal Momoh"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
            <a
              id="footer-github-link"
              href="https://github.com/jezreal-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded text-slate-500 hover:text-[#1DCF9F] hover:bg-[#F8FBFF] transition-all"
              aria-label="GitHub Profile"
              title="GitHub: jezreal-dev"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

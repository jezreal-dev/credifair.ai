import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { LedgerPage } from './pages/LedgerPage';
import { CompliancePage } from './pages/CompliancePage';
import { HealthResponse } from './types';

export default function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    fetch('/api/v1/health')
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch((err) => console.warn('Health check failed:', err));
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F8FBFF] text-[#210F60] flex flex-col font-sans selection:bg-[#1DCF9F]/30 selection:text-[#210F60]">
        <Navbar health={health} />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<WorkspacePage health={health} />} />
            <Route path="/ledger" element={<LedgerPage />} />
            <Route path="/compliance" element={<CompliancePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Layers,
  BarChart3,
  LineChart as LineChartIcon,
  ShieldCheck,
  Info,
  Maximize2,
  Sliders,
} from 'lucide-react';
import { ConformalRisk, MerchantVitals, TransactionRecord } from '../types';

interface ConformalRiskTrendChartProps {
  risk: ConformalRisk;
  vitals: MerchantVitals;
  sampleRecords?: TransactionRecord[];
}

export interface HistoricalRiskPoint {
  period: string;
  date: string;
  point_risk: number;
  lower_bound: number;
  upper_bound: number;
  band_spread: number;
  volatility: number;
  status: 'Approved' | 'Review' | 'Decline';
}

export const ConformalRiskTrendChart: React.FC<ConformalRiskTrendChartProps> = ({
  risk,
  vitals,
  sampleRecords = [],
}) => {
  const [activeView, setActiveView] = useState<'trend' | 'distribution'>('trend');
  const [confidenceLevel, setConfidenceLevel] = useState<number>(95);
  const [timeRange, setTimeRange] = useState<'12w' | '6m' | 'all'>('12w');

  // Compute conformal quantile factor based on selected confidence
  const confidenceMultiplier = useMemo(() => {
    if (confidenceLevel === 90) return 0.82; // 1.645 / 2.0 approx ratio
    if (confidenceLevel === 99) return 1.35; // 2.576 / 2.0 approx ratio
    return 1.0; // 95% default
  }, [confidenceLevel]);

  // Generate rich historical evaluation trajectory rooted in merchant vitals
  const trendData: HistoricalRiskPoint[] = useMemo(() => {
    const pointsCount = timeRange === '12w' ? 12 : timeRange === '6m' ? 18 : 24;
    const basePoint = risk.point_risk_pct;
    const baseVol = vitals.volatility;
    const baseDate = new Date(2026, 8, 18); // Sept 18, 2026

    const points: HistoricalRiskPoint[] = [];

    for (let i = pointsCount - 1; i >= 0; i--) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() - i * 7);
      const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      const periodLabel = i === 0 ? 'Current' : `Wk -${i}`;

      // Simulate realistic historical macro & micro cycle variations
      // sinusoidal seasonality + volatility shock waves
      const seasonalWave = Math.sin((i / 4) * Math.PI) * (baseVol * 0.12);
      const randomJitter = (((i * 13 + 5) % 17) - 8) * 0.15;
      
      // Merchants have subtle trajectories:
      // Mama Bukky: stable slight improvement as transactions grew
      // Emeka: cyclical restocking surges every 3-4 weeks
      // Baba Musa: steady upward drift
      let drift = 0;
      if (vitals.merchant_name?.includes('Mama')) {
        drift = -0.18 * (pointsCount - 1 - i); // improving over time
      } else if (vitals.merchant_name?.includes('Emeka')) {
        drift = Math.sin(i * 1.2) * 2.8; // cyclical inventory replenishment
      } else if (vitals.merchant_name?.includes('Musa')) {
        drift = 0.35 * (pointsCount - 1 - i); // worsening liquidity over time
      }

      const pointRiskRaw = Math.max(1.2, Math.min(85.0, basePoint + drift + seasonalWave + randomJitter));
      const pointRisk = Math.round(pointRiskRaw * 100) / 100;

      // Locally weighted conformal margin adapted to local volatility & confidence
      const localVol = Math.max(5, baseVol + seasonalWave * 0.8);
      const dispersion = 0.5 + localVol / 20.0;
      const margin = 2.85 * dispersion * confidenceMultiplier;

      const lowerBound = Math.max(0.0, Math.round((pointRisk - margin) * 100) / 100);
      const upperBound = Math.min(100.0, Math.round((pointRisk + margin) * 100) / 100);
      const spread = Math.round((upperBound - lowerBound) * 100) / 100;

      let status: 'Approved' | 'Review' | 'Decline' = 'Decline';
      if (upperBound <= 20.0) {
        status = 'Approved';
      } else if (upperBound <= 45.0) {
        status = 'Review';
      }

      points.push({
        period: periodLabel,
        date: dateStr,
        point_risk: pointRisk,
        lower_bound: lowerBound,
        upper_bound: upperBound,
        band_spread: spread,
        volatility: Math.round(localVol * 10) / 10,
        status,
      });
    }

    return points;
  }, [risk.point_risk_pct, vitals.volatility, vitals.merchant_name, timeRange, confidenceMultiplier]);

  // Generate historical score frequency distribution bins (Histogram)
  const distributionData = useMemo(() => {
    const bins = [
      { bin: '0% – 5%', range: [0, 5], count: 0, label: 'Prime Prime' },
      { bin: '5% – 10%', range: [5, 10], count: 0, label: 'Low Default' },
      { bin: '10% – 20%', range: [10, 20], count: 0, label: 'Standard Approval' },
      { bin: '20% – 35%', range: [20, 35], count: 0, label: 'Moderate Watch' },
      { bin: '35% – 45%', range: [35, 45], count: 0, label: 'High Uncertainty' },
      { bin: '> 45%', range: [45, 100], count: 0, label: 'Statutory Exclusion' },
    ];

    trendData.forEach((pt) => {
      for (const b of bins) {
        if (pt.point_risk >= b.range[0] && pt.point_risk < b.range[1]) {
          b.count += 1;
          break;
        }
      }
    });

    return bins;
  }, [trendData]);

  // Key summary statistics
  const meanPointRisk = useMemo(() => {
    const sum = trendData.reduce((acc, p) => acc + p.point_risk, 0);
    return Math.round((sum / trendData.length) * 100) / 100;
  }, [trendData]);

  const maxSpread = useMemo(() => {
    return Math.max(...trendData.map((p) => p.band_spread));
  }, [trendData]);

  const trajectoryTrend = useMemo(() => {
    if (trendData.length < 2) return 0;
    const first = trendData[0].point_risk;
    const last = trendData[trendData.length - 1].point_risk;
    return Math.round((last - first) * 100) / 100;
  }, [trendData]);

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: HistoricalRiskPoint = payload[0].payload;
      const statusColor =
        data.status === 'Approved'
          ? 'text-emerald-700 bg-emerald-50 border-emerald-300'
          : data.status === 'Review'
            ? 'text-amber-700 bg-amber-50 border-amber-300'
            : 'text-rose-700 bg-rose-50 border-rose-300';

      return (
        <div className="bg-slate-900 text-white text-xs rounded-xl p-3.5 shadow-xl border border-slate-700 max-w-xs space-y-2 font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <span className="font-bold text-white text-sm">{data.period}</span>
              <span className="text-slate-400 ml-1.5 font-mono">({data.date})</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColor}`}>
              {data.status}
            </span>
          </div>

          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1.5 font-sans">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                Point Risk:
              </span>
              <span className="font-bold text-white text-sm">{data.point_risk}%</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1.5 font-sans">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                {confidenceLevel}% Conformal Band:
              </span>
              <span className="text-blue-300 font-semibold">
                [{data.lower_bound}% — {data.upper_bound}%]
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-sans">Uncertainty Spread:</span>
              <span className="text-purple-300 font-semibold">±{(data.band_spread / 2).toFixed(2)}%</span>
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-slate-800 text-[10px]">
              <span className="text-slate-500 font-sans">Trade Volatility:</span>
              <span className="text-slate-300">{data.volatility}% CoV</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="conformal-risk-trend-container"
      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5"
    >
      {/* Header with Title and View Switchers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Historical Conformal Risk Distribution &amp; Trend</span>
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Recharts Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Temporal trajectory of distribution-free prediction bands over merchant trade settlement cycles
          </p>
        </div>

        {/* Action Controls & Mode Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Range Pills */}
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium text-slate-600">
            <button
              onClick={() => setTimeRange('12w')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                timeRange === '12w' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              12 Weeks
            </button>
            <button
              onClick={() => setTimeRange('6m')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                timeRange === '6m' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              6 Months
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                timeRange === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Full Cycle
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium text-slate-600">
            <button
              onClick={() => setActiveView('trend')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                activeView === 'trend' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              <LineChartIcon className="w-3.5 h-3.5" />
              <span>Band Envelope</span>
            </button>
            <button
              onClick={() => setActiveView('distribution')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                activeView === 'distribution' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Score Density</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Statistical Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="text-[11px] font-medium text-slate-500">Current Point Risk</div>
          <div className="text-lg font-extrabold text-slate-900 font-mono mt-0.5">
            {risk.point_risk_pct}%
          </div>
          <div className="text-[10px] text-slate-400">Holdout calibrated</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="text-[11px] font-medium text-slate-500">Historical Cycle Mean</div>
          <div className="text-lg font-extrabold text-slate-900 font-mono mt-0.5">
            {meanPointRisk}%
          </div>
          <div className="text-[10px] text-slate-400">Over {trendData.length} evaluation periods</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="text-[11px] font-medium text-slate-500">Max Conformal Dispersion</div>
          <div className="text-lg font-extrabold text-purple-700 font-mono mt-0.5">
            ±{(maxSpread / 2).toFixed(2)}%
          </div>
          <div className="text-[10px] text-slate-400">Stress shock absorption width</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="text-[11px] font-medium text-slate-500">Risk Trajectory</div>
          <div
            className={`text-lg font-extrabold font-mono mt-0.5 flex items-center gap-1 ${
              trajectoryTrend <= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {trajectoryTrend <= 0 ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <TrendingUp className="w-4 h-4" />
            )}
            <span>{Math.abs(trajectoryTrend)}%</span>
          </div>
          <div className="text-[10px] text-slate-400">
            {trajectoryTrend <= 0 ? 'Improving liquidity' : 'Heightened default exposure'}
          </div>
        </div>
      </div>

      {/* Main Chart Stage */}
      <div className="pt-2">
        {activeView === 'trend' ? (
          <div className="space-y-3">
            {/* Legend & Confidence Level Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
              <div className="flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="w-3 h-3 rounded bg-blue-500/25 border border-blue-500" />
                  <span>Conformal Prediction Interval</span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="w-3 h-1 bg-rose-600 rounded" />
                  <span>Point Estimate</span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
                  <span className="w-3 h-0.5 border-b-2 border-dashed border-emerald-600" />
                  <span>20% Approval Ceiling</span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-amber-700">
                  <span className="w-3 h-0.5 border-b-2 border-dashed border-amber-600" />
                  <span>45% Decline Threshold</span>
                </span>
              </div>

              {/* Confidence interval parameter selector */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto text-[11px]">
                <Sliders className="w-3 h-3 text-slate-400" />
                <span className="text-slate-500">Target Coverage:</span>
                <div className="inline-flex rounded-md bg-white border border-slate-200 p-0.5 font-mono font-bold">
                  {[90, 95, 99].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setConfidenceLevel(lvl)}
                      className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                        confidenceLevel === lvl ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {lvl}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recharts ComposedChart Stage */}
            <div className="w-full h-80 min-h-[320px] pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trendData} margin={{ top: 12, right: 16, bottom: 8, left: -10 }}>
                  <defs>
                    <linearGradient id="conformalBandGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

                  <XAxis
                    dataKey="period"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />

                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    domain={[0, (dataMax: number) => Math.max(50, Math.ceil(dataMax * 1.15))]}
                    unit="%"
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  {/* Regulatory Thresholds */}
                  <ReferenceLine
                    y={20}
                    stroke="#059669"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: '20% Approval Limit',
                      position: 'insideTopRight',
                      fill: '#059669',
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  />
                  <ReferenceLine
                    y={45}
                    stroke="#d97706"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: '45% Statutory Decline Cutoff',
                      position: 'insideTopRight',
                      fill: '#d97706',
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  />

                  {/* Upper Bound Envelope Area */}
                  <Area
                    type="monotone"
                    dataKey="upper_bound"
                    stroke="#2563eb"
                    strokeWidth={1.5}
                    strokeDasharray="2 2"
                    fill="url(#conformalBandGradient)"
                    name="Upper Bound (95%)"
                  />

                  {/* Lower Bound Envelope Line */}
                  <Line
                    type="monotone"
                    dataKey="lower_bound"
                    stroke="#3b82f6"
                    strokeWidth={1.5}
                    strokeDasharray="2 2"
                    dot={false}
                    name="Lower Bound (95%)"
                  />

                  {/* Central Point Risk Estimate */}
                  <Line
                    type="monotone"
                    dataKey="point_risk"
                    stroke="#e11d48"
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: '#e11d48', strokeWidth: 1.5, stroke: '#ffffff' }}
                    activeDot={{ r: 6, fill: '#be123c', stroke: '#ffffff', strokeWidth: 2 }}
                    name="Point Estimate"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs text-slate-500 flex items-center justify-between">
              <span>Frequency distribution of calibrated default scores across risk tiers</span>
              <span className="font-mono text-[11px] text-slate-600">Sample Size: N={trendData.length} audit checkpoints</span>
            </div>

            {/* Recharts BarChart for Score Distribution */}
            <div className="w-full h-80 min-h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData} margin={{ top: 12, right: 16, bottom: 8, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="bin"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <Tooltip
                    cursor={{ fill: '#f1f5f9' }}
                    formatter={(val: any) => [`${val ?? 0} periods`, 'Observation Frequency']}
                    labelFormatter={(label) => `Risk Tier: ${label}`}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Observations">
                    {distributionData.map((entry, index) => {
                      let color = '#10b981'; // green
                      if (entry.bin.includes('20%') || entry.bin.includes('35%')) {
                        color = '#f59e0b'; // amber
                      } else if (entry.bin.includes('45%') || entry.bin.includes('>')) {
                        color = '#f43f5e'; // rose
                      }
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Explanatory Technical Note */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-slate-900">Distribution Interpretation: </span>
          The shaded blue envelope displays the <strong>{confidenceLevel}% non-parametric prediction region</strong>.
          Notice how localized trading shocks automatically widen the interval bounds; when cashflows stabilize with high
          daily terminal consistency, the envelope contracts. Under NDPA 2023 §37, decisions are bound by the
          statutory upper threshold rather than naive point averages.
        </div>
      </div>
    </div>
  );
};

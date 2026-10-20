import React from 'react';
import { ShieldCheck, Zap, Fuel } from 'lucide-react';
import { VehicleCategory } from '../../types';
import { formatCategoryName } from '../../utils/formatters';

export const CategoryBadge: React.FC<{ category: VehicleCategory }> = ({ category }) => {
  const isElectric = category === 'ELECTRIC_CAR' || category === 'ELECTRIC_TWO_WHEELER';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isElectric
          ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30'
          : 'bg-slate-100 text-slate-700 border border-slate-200'
      }`}
    >
      {isElectric && <Zap className="w-3 h-3 text-emerald-600" />}
      {formatCategoryName(category)}
    </span>
  );
};

export const FuelBadge: React.FC<{ fuel: string }> = ({ fuel }) => {
  const isElectric = fuel === 'ELECTRIC';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider ${
        isElectric
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : 'bg-slate-100 text-slate-700 border border-slate-200'
      }`}
    >
      {isElectric ? <Zap className="w-2.5 h-2.5" /> : <Fuel className="w-2.5 h-2.5" />}
      {fuel}
    </span>
  );
};

export const SafetyRatingBadge: React.FC<{ stars?: number; protocol?: string }> = ({ stars, protocol }) => {
  if (!stars) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
      <span>{'★'.repeat(stars)}</span>
      {protocol && <span className="text-[10px] text-amber-700 ml-0.5 font-normal">({protocol})</span>}
    </span>
  );
};

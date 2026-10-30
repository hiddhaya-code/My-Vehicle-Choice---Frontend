import React from 'react';
import { ShieldCheck, Zap, Fuel } from 'lucide-react';
import { VehicleCategory } from '../../types';
import { formatCategoryName } from '../../utils/formatters';

export const CategoryBadge: React.FC<{ category: VehicleCategory }> = ({ category }) => {
  const isElectric = category === 'ELECTRIC_CAR' || category === 'ELECTRIC_TWO_WHEELER';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-heading ${
        isElectric
          ? 'bg-[#171717] text-[#B9975B] border border-[#B9975B]/40'
          : 'bg-[#FAF8F5] text-[#171717] border border-[#E5E0D8]'
      }`}
    >
      {isElectric && <Zap className="w-3 h-3 text-[#B9975B]" />}
      {formatCategoryName(category)}
    </span>
  );
};

export const FuelBadge: React.FC<{ fuel: string }> = ({ fuel }) => {
  const isElectric = fuel === 'ELECTRIC';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider font-heading ${
        isElectric
          ? 'bg-[#B9975B]/15 text-[#9F7F45] border border-[#B9975B]/30'
          : 'bg-[#FAF8F5] text-[#171717] border border-[#E5E0D8]'
      }`}
    >
      {isElectric ? <Zap className="w-2.5 h-2.5 text-[#B9975B]" /> : <Fuel className="w-2.5 h-2.5 text-stone-500" />}
      {fuel}
    </span>
  );
};

export const SafetyRatingBadge: React.FC<{ stars?: number; protocol?: string }> = ({ stars, protocol }) => {
  if (!stars) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#171717] text-[#B9975B] border border-[#B9975B]/40 text-xs font-semibold font-heading">
      <ShieldCheck className="w-3.5 h-3.5 text-[#B9975B]" />
      <span>{'★'.repeat(stars)}</span>
      {protocol && <span className="text-[10px] text-stone-400 ml-0.5 font-normal">({protocol})</span>}
    </span>
  );
};

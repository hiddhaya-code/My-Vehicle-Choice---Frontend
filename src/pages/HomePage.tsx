import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { BudgetSelectorSection } from '../components/home/BudgetSelectorSection';
import { CategorySelectorSection } from '../components/home/CategorySelectorSection';
import { TrendingSection } from '../components/home/TrendingSection';
import { DirectCompareSection } from '../components/home/DirectCompareSection';
import { ValuePropsSection } from '../components/home/ValuePropsSection';

export const HomePage: React.FC = () => {
  return (
    <div className="flex-1">
      <HeroSection />
      <BudgetSelectorSection />
      <CategorySelectorSection />
      <TrendingSection />
      <DirectCompareSection />
      <ValuePropsSection />
    </div>
  );
};

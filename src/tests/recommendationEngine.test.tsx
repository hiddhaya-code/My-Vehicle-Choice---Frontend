import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QuestionnairePage } from '../pages/QuestionnairePage';
import { RecommendationResultsPage } from '../pages/RecommendationResultsPage';
import { api } from '../services/api';
import { RecommendationResponse, RecommendationResult } from '../types';

// Mock API
vi.mock('../services/api', () => ({
  api: {
    evaluateRecommendations: vi.fn(),
  },
}));

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { fullName: 'Aman Sharma', email: 'aman@example.com', phone: '9876543210', city: 'New Delhi' },
    isAuthenticated: true,
    isWishlisted: () => false,
    toggleWishlist: vi.fn(),
  }),
}));

describe('Recommendation Engine Frontend Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    window.scrollTo = vi.fn();
  });

  describe('QuestionnairePage Component', () => {
    it('renders Step 1 with budget and strict ceiling toggle', () => {
      render(
        <MemoryRouter initialEntries={['/find-my-vehicle']}>
          <QuestionnairePage />
        </MemoryRouter>
      );

      expect(screen.getByText(/What is your target budget and location/i)).toBeDefined();
      expect(screen.getByText(/Total On-Road Budget/i)).toBeDefined();
      expect(screen.getByText(/Monthly Loan EMI Budget/i)).toBeDefined();
      expect(screen.getByText(/Enforce Strict Budget Ceiling/i)).toBeDefined();
    });

    it('toggles between Total Purchase and Monthly Loan EMI modes', () => {
      render(
        <MemoryRouter initialEntries={['/find-my-vehicle']}>
          <QuestionnairePage />
        </MemoryRouter>
      );

      const emiButton = screen.getByRole('button', { name: /Monthly Loan EMI Budget/i });
      fireEvent.click(emiButton);

      expect(screen.getByText(/Selected Monthly Loan EMI/i)).toBeDefined();
    });

    it('navigates to Step 2 and allows category selection with category-specific options', async () => {
      render(
        <MemoryRouter initialEntries={['/find-my-vehicle']}>
          <QuestionnairePage />
        </MemoryRouter>
      );

      // Click Next to go to Step 2
      const nextBtn = screen.getByRole('button', { name: /Next Step/i });
      fireEvent.click(nextBtn);

      await waitFor(() => {
        expect(screen.getByText(/Select your vehicle category/i)).toBeDefined();
      });

      // Default CAR shows body styles
      expect(screen.getByText(/Preferred Body Style/i)).toBeDefined();
      expect(screen.getByRole('button', { name: 'SUV' })).toBeDefined();

      // Click Motorcycle
      const bikeBtn = screen.getByRole('button', { name: /Motorcycle \/ Bike/i });
      fireEvent.click(bikeBtn);

      // Now motorcycle stance should appear instead of car body styles
      await waitFor(() => {
        expect(screen.getByText(/Riding Stance & Motorcycle Type/i)).toBeDefined();
        expect(screen.getByText(/Commuter \/ Daily/i)).toBeDefined();
      });
    });
  });

  describe('RecommendationResultsPage Component', () => {
    const mockResult: RecommendationResult = {
      rank: 1,
      vehicle: {
        id: 1,
        brandId: 1,
        brandName: 'Tata Motors',
        modelName: 'Nexon',
        category: 'CAR',
        startingExShowroomPrice: 799000,
        startingOnRoadPrice: 915000,
        availableFuelTypes: ['PETROL', 'DIESEL'],
        availableTransmissions: ['MANUAL', 'AUTOMATIC'],
        heroImageUrl: 'https://example.com/nexon.jpg',
        isFeatured: true,
        isTrending: true,
        variantCount: 4,
      },
      recommendedVariant: {
        id: 101,
        vehicleId: 1,
        variantName: 'Creative Plus 1.2 Petrol',
        modelYear: 2024,
        fuelType: 'PETROL',
        transmission: 'MANUAL',
        exShowroomPrice: 1100000,
        estimatedOnRoadPrice: 1245000,
        cityPriceRef: 'New Delhi',
        mileageKmpl: 17.44,
        safetyRatingStars: 5,
        safetyRatingProtocol: 'Bharat NCAP',
        hasAbs: true,
        hasEsp: true,
        isVerified: true,
        dataSource: 'Official BNCAP 2024 Protocol',
      },
      overallScore: 92.5,
      scoreBreakdown: {
        budget: 95,
        safety: 100,
        fuelEfficiency: 85,
        performance: 90,
      },
      matchBadge: 'Best All-Round Compact SUV',
      reasons: [
        '5-Star Bharat NCAP crash safety certified with 6 standard airbags',
        '208 mm ground clearance prevents scraping on high speed breakers',
        'Competitive maintenance network across India',
      ],
      tradeOffs: [
        'Manual transmission requires clutch operation in bumper-to-bumper city jams',
        'Real-world city petrol mileage (11-13 km/l) lower than certified ARAI (17.44 km/l)',
      ],
      dataConfidenceScore: 95,
      dataConfidenceLevel: 'HIGH_VERIFIED',
      categorySpecs: {
        'Engine / Motor': '1199 cc Turbocharged Revotron',
        'Safety Rating': '★ 5 Bharat NCAP (2024)',
        'Ground Clearance': '208 mm (Class-leading)',
        'Boot Space': '382 Litres',
        'Seating Capacity': '5 Seater',
        'Fuel Efficiency': '17.44 km/l ARAI',
      },
      affordability: {
        exShowroomPrice: 1100000,
        onRoadPrice: 1245000,
        downPayment: 249000,
        loanAmount: 996000,
        monthlyEmi: 20950,
        monthlyFuelOrEnergyCost: 4950,
        annualMaintenanceEstimate: 8500,
        annualInsuranceEstimate: 28000,
        fiveYearTotalCostOfOwnership: 1845000,
        calculationAssumptions: 'Assumes 20% down payment, 60-month loan @ 9.5% APR, petrol at ₹96.72/L for 35 km/day commute',
      },
      relativePositionExplanation: 'Ranked #1 due to class-leading 5-Star BNCAP safety rating and optimal ground clearance within ₹13.00 Lakh budget.',
      missingDataWarnings: [],
      isNearMatch: false,
    };

    const mockResponse: RecommendationResponse = {
      matchedResults: [mockResult],
      nearMatchResults: [],
      unmatchedConstraintNotes: [],
      userSummary: 'Search: CAR within ₹13,00,000 On-Road',
    };

    it('renders Recommendation card with separate Match Score and Data Confidence Badge', () => {
      const state = {
        response: mockResponse,
        answers: {
          budgetAmount: 1300000,
          budgetType: 'PURCHASE',
          isStrictBudget: false,
          category: 'CAR',
          city: 'New Delhi',
          dailyDistanceKm: 35,
        },
        guestName: 'Aman Sharma',
      };

      render(
        <MemoryRouter initialEntries={[{ pathname: '/recommendations', state }]}>
          <Routes>
            <Route path="/recommendations" element={<RecommendationResultsPage />} />
          </Routes>
        </MemoryRouter>
      );

      // Assert Header & Vehicle Title
      expect(screen.getByText(/Recommended Vehicles for Aman Sharma/i)).toBeDefined();
      expect(screen.getByText('Nexon')).toBeDefined();
      expect(screen.getByText(/Creative Plus 1.2 Petrol/i)).toBeDefined();

      // Assert Match Score
      expect(screen.getByText('93%')).toBeDefined(); // Math.round(92.5)

      // Assert Data Confidence Badge
      expect(screen.getByText(/Data Confidence: 95% \(Verified\)/i)).toBeDefined();

      // Assert Relative Position Explanation
      expect(screen.getByText(/Ranked #1 due to class-leading 5-Star BNCAP/i)).toBeDefined();
    });

    it('renders 3 personalized reasons, category-tailored specs, and honest trade-offs', () => {
      const state = {
        response: mockResponse,
        answers: {
          budgetAmount: 1300000,
          budgetType: 'PURCHASE',
          isStrictBudget: false,
          category: 'CAR',
          city: 'New Delhi',
          dailyDistanceKm: 35,
        },
      };

      render(
        <MemoryRouter initialEntries={[{ pathname: '/recommendations', state }]}>
          <Routes>
            <Route path="/recommendations" element={<RecommendationResultsPage />} />
          </Routes>
        </MemoryRouter>
      );

      // Assert Personalized Reasons
      expect(screen.getByText(/5-Star Bharat NCAP crash safety certified/i)).toBeDefined();
      expect(screen.getByText(/208 mm ground clearance/i)).toBeDefined();

      // Assert Category-Tailored Specs
      expect(screen.getByText(/1199 cc Turbocharged Revotron/i)).toBeDefined();
      expect(screen.getByText(/382 Litres/i)).toBeDefined();

      // Assert Honest Trade-offs
      expect(screen.getByText(/Honest Trade-Offs & Practical Considerations/i)).toBeDefined();
      expect(screen.getByText(/Manual transmission requires clutch operation/i)).toBeDefined();
    });

    it('toggles and displays ownership affordability breakdown', () => {
      const state = {
        response: mockResponse,
        answers: {
          budgetAmount: 1300000,
          budgetType: 'PURCHASE',
          isStrictBudget: false,
          category: 'CAR',
          city: 'New Delhi',
          dailyDistanceKm: 35,
        },
      };

      render(
        <MemoryRouter initialEntries={[{ pathname: '/recommendations', state }]}>
          <Routes>
            <Route path="/recommendations" element={<RecommendationResultsPage />} />
          </Routes>
        </MemoryRouter>
      );

      // Click the EMI affordability snapshot button to toggle details
      const emiToggleBtn = screen.getByRole('button', { name: /EMI: ₹20,950\/mo/i });
      fireEvent.click(emiToggleBtn);

      // Verify TCO and Down Payment details appear
      expect(screen.getByText(/Ownership Affordability & TCO Breakdown/i)).toBeDefined();
      expect(screen.getByText('20% Down Payment')).toBeDefined();
      expect(screen.getByText('5-Yr Total Cost (TCO)')).toBeDefined();
      expect(screen.getByText(/Assumes 20% down payment, 60-month loan/i)).toBeDefined();
    });

    it('wires Where to Buy button with canonical vehicleId, variantId, brandId, and category', () => {
      const state = {
        response: mockResponse,
        answers: {
          budgetAmount: 1300000,
          budgetType: 'PURCHASE',
          isStrictBudget: false,
          category: 'CAR',
          city: 'New Delhi',
          dailyDistanceKm: 35,
        },
      };

      render(
        <MemoryRouter initialEntries={[{ pathname: '/recommendations', state }]}>
          <Routes>
            <Route path="/recommendations" element={<RecommendationResultsPage />} />
          </Routes>
        </MemoryRouter>
      );

      const whereToBuyLink = screen.getByRole('link', { name: /Where to Buy & Test Drive/i });
      expect(whereToBuyLink.getAttribute('href')).toBe(
        '/where-to-buy?vehicleId=1&variantId=101&brandId=1&category=CAR&model=Nexon'
      );
    });
  });
});

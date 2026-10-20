import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { WhereToBuyPage } from '../pages/WhereToBuyPage';
import { api } from '../services/api';
import { Dealer, VehicleDetail } from '../types';

// Mock API
vi.mock('../services/api', () => ({
  api: {
    getVehicleById: vi.fn(),
    getDealers: vi.fn(),
    submitEnquiry: vi.fn(),
  },
}));

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { fullName: 'Test User', email: 'test@example.com', phone: '9876543210' },
  }),
}));

describe('WhereToBuyPage Frontend Dealer Matching Regression Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Tata Nexon renders only Tata dealership and NEVER Hyundai or BMW', async () => {
    const tataVehicle: Partial<VehicleDetail> = {
      id: 1,
      brandId: 1,
      brandName: 'Tata Motors',
      modelName: 'Nexon',
      category: 'CAR',
      startingOnRoadPrice: 915000,
      startingExShowroomPrice: 799000,
      heroImageUrl: 'https://example.com/nexon.jpg',
      variants: [],
      images: [],
    };

    const tataDealer: Dealer = {
      id: 1,
      name: 'SAB Motors Tata Authorized Dealership',
      brandName: 'Tata Motors',
      divisionName: 'Tata Motors Passenger Vehicles',
      dealerType: 'SALES_AND_SERVICE',
      address: 'Mohan Cooperative Industrial Estate',
      city: 'New Delhi',
      phone: '+91 11 4167 8900',
      isAuthorized: true,
      availabilityStatus: 'AVAILABLE_FOR_TEST_DRIVE',
      officialLocatorUrl: 'https://dealer-locator.cars.tatamotors.com/',
    };

    vi.mocked(api.getVehicleById).mockResolvedValue(tataVehicle as VehicleDetail);
    vi.mocked(api.getDealers).mockResolvedValue([tataDealer]);

    render(
      <MemoryRouter initialEntries={['/where-to-buy?vehicleId=1&brandId=1&category=CAR']}>
        <WhereToBuyPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('SAB Motors Tata Authorized Dealership')).toBeDefined();
    });

    // Assert Tata is present
    expect(screen.getByText('Tata Motors Passenger Vehicles')).toBeDefined();

    // Verify Hyundai or BMW is NOT present
    expect(screen.queryByText(/Hyundai/i)).toBeNull();
    expect(screen.queryByText(/BMW/i)).toBeNull();
  });

  it('KTM Duke 200 NEVER returns Yamaha or Royal Enfield dealership', async () => {
    const ktmVehicle: Partial<VehicleDetail> = {
      id: 5,
      brandId: 4,
      brandName: 'KTM',
      modelName: '200 Duke',
      category: 'MOTORCYCLE',
      startingOnRoadPrice: 228000,
      startingExShowroomPrice: 198000,
      heroImageUrl: 'https://example.com/duke.jpg',
      variants: [],
      images: [],
    };

    const ktmDealer: Dealer = {
      id: 4,
      name: 'KTM South Extension Showroom',
      brandName: 'KTM',
      divisionName: 'KTM India',
      dealerType: 'SALES',
      address: 'South Extension Part II',
      city: 'New Delhi',
      phone: '+91 11 4655 4321',
      isAuthorized: true,
      availabilityStatus: 'AVAILABLE_FOR_TEST_DRIVE',
    };

    vi.mocked(api.getVehicleById).mockResolvedValue(ktmVehicle as VehicleDetail);
    vi.mocked(api.getDealers).mockResolvedValue([ktmDealer]);

    render(
      <MemoryRouter initialEntries={['/where-to-buy?vehicleId=5&brandId=4&category=MOTORCYCLE']}>
        <WhereToBuyPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('KTM South Extension Showroom')).toBeDefined();
    });

    expect(screen.queryByText(/Yamaha/i)).toBeNull();
    expect(screen.queryByText(/Royal Enfield/i)).toBeNull();
  });

  it('Honda Activa 6G returns HMSI Two-Wheeler showroom and NOT Honda Cars India', async () => {
    const activa: Partial<VehicleDetail> = {
      id: 9,
      brandId: 8,
      brandName: 'Honda',
      modelName: 'Activa 6G',
      category: 'SCOOTER',
      startingOnRoadPrice: 91000,
      startingExShowroomPrice: 76000,
      variants: [],
      images: [],
    };

    const hmsiDealer: Dealer = {
      id: 8,
      name: 'Prime Honda Two-Wheeler Network Hub',
      brandName: 'Honda',
      divisionName: 'Honda Motorcycle & Scooter India (HMSI)',
      dealerType: 'SALES',
      address: 'Andheri East',
      city: 'Mumbai',
      phone: '+91 22 2834 1122',
      isAuthorized: true,
      availabilityStatus: 'CONFIRMED_IN_STOCK',
      estimatedDeliveryDays: 1,
    };

    vi.mocked(api.getVehicleById).mockResolvedValue(activa as VehicleDetail);
    vi.mocked(api.getDealers).mockResolvedValue([hmsiDealer]);

    render(
      <MemoryRouter initialEntries={['/where-to-buy?vehicleId=9&brandId=8&category=SCOOTER']}>
        <WhereToBuyPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Prime Honda Two-Wheeler Network Hub')).toBeDefined();
    });

    expect(screen.getByText('Honda Motorcycle & Scooter India (HMSI)')).toBeDefined();
    expect(screen.queryByText(/Honda Cars India/i)).toBeNull();
  });

  it('Displays honest empty state when 0 authorized dealers match', async () => {
    const bmwVehicle: Partial<VehicleDetail> = {
      id: 19,
      brandId: 14,
      brandName: 'BMW',
      modelName: '3 Series Gran Limousine',
      category: 'CAR',
      startingOnRoadPrice: 6980000,
      startingExShowroomPrice: 6060000,
      variants: [],
      images: [],
    };

    vi.mocked(api.getVehicleById).mockResolvedValue(bmwVehicle as VehicleDetail);
    vi.mocked(api.getDealers).mockResolvedValue([]); // 0 dealers in selected area

    render(
      <MemoryRouter initialEntries={['/where-to-buy?vehicleId=19&brandId=14&category=CAR']}>
        <WhereToBuyPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No verified authorized sales dealer found for this vehicle in your selected area/i)).toBeDefined();
    });

    expect(screen.getByText(/Search All Locations/i)).toBeDefined();
    expect(screen.getByText(/Open Official BMW Locator/i)).toBeDefined();
  });

  it('Dealer with unknown stock is marked NOT_VERIFIED and never claims in stock', async () => {
    const tataDealerUnverifiedStock: Dealer = {
      id: 1,
      name: 'SAB Motors Tata Authorized Dealership',
      brandName: 'Tata Motors',
      dealerType: 'SALES',
      address: 'Mohan Cooperative',
      city: 'New Delhi',
      phone: '+91 11 4167 8900',
      isAuthorized: true,
      availabilityStatus: 'NOT_VERIFIED', // Unknown availability
      testDriveAvailable: false,
    };

    vi.mocked(api.getDealers).mockResolvedValue([tataDealerUnverifiedStock]);

    render(
      <MemoryRouter initialEntries={['/where-to-buy?brandId=1']}>
        <WhereToBuyPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Stock Status: Inquire with Dealer')).toBeDefined();
    });

    // Must NOT show "Confirmed in Stock"
    expect(screen.queryByText(/Confirmed in Stock/i)).toBeNull();
  });
});

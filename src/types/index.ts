export type VehicleCategory = 
  | 'CAR' 
  | 'MOTORCYCLE' 
  | 'SCOOTER' 
  | 'ELECTRIC_CAR' 
  | 'ELECTRIC_TWO_WHEELER';

export type FuelType = 
  | 'PETROL' 
  | 'DIESEL' 
  | 'CNG' 
  | 'HYBRID' 
  | 'ELECTRIC';

export type TransmissionType = 
  | 'MANUAL' 
  | 'AUTOMATIC';

export interface Brand {
  id: number;
  name: string;
  country?: string;
  logoUrl?: string;
  isActive: boolean;
}

export interface VehicleSummary {
  id: number;
  brandId: number;
  brandName: string;
  modelName: string;
  category: VehicleCategory;
  bodyStyle?: string;
  headline?: string;
  heroImageUrl: string;
  isTrending: boolean;
  isFeatured: boolean;
  startingExShowroomPrice: number;
  startingOnRoadPrice: number;
  maxOnRoadPrice?: number;
  availableFuelTypes: string[];
  availableTransmissions: string[];
  variantCount: number;
  primaryKeySpec?: string;
}

export interface VehicleImage {
  id: number;
  imageUrl: string;
  caption?: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface VehicleVariant {
  id: number;
  vehicleId: number;
  variantName: string;
  modelYear: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  exShowroomPrice: number;
  estimatedOnRoadPrice: number;
  cityPriceRef: string;
  mileageKmpl?: number;
  electricRangeKm?: number;
  batteryCapacityKwh?: number;
  engineCc?: number;
  maxPowerBhp?: number;
  maxPowerRpm?: number;
  maxTorqueNm?: number;
  seatingCapacity?: number;
  bootSpaceLitres?: number;
  groundClearanceMm?: number;
  fuelTankCapacityLitres?: number;
  kerbWeightKg?: number;
  seatHeightMm?: number;
  safetyRatingStars?: number;
  safetyRatingProtocol?: string;
  airbagsCount?: number;
  hasAbs: boolean;
  hasEsp: boolean;
  maintenanceEstimateAnnual?: number;
  keyAdvantages?: string;
  keyDisadvantages?: string;
  isVerified: boolean;
  dataSource?: string;
  verifiedDate?: string;
}

export interface VehicleDetail {
  id: number;
  brandId: number;
  brandName: string;
  brandLogoUrl?: string;
  brandCountry?: string;
  modelName: string;
  category: VehicleCategory;
  bodyStyle?: string;
  headline?: string;
  description?: string;
  heroImageUrl: string;
  isTrending: boolean;
  isFeatured: boolean;
  startingExShowroomPrice: number;
  startingOnRoadPrice: number;
  maxOnRoadPrice?: number;
  variants: VehicleVariant[];
  images: VehicleImage[];
}

export interface CompareSearchResult {
  vehicleId: number;
  variantId: number;
  brandName: string;
  modelName: string;
  variantName: string;
  fullName: string;
  category: VehicleCategory;
  fuelType: FuelType;
  transmission: TransmissionType;
  estimatedOnRoadPrice: number;
  heroImageUrl: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface VehicleFilterParams {
  query?: string;
  category?: VehicleCategory;
  brandId?: number;
  bodyStyle?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
}

// Authentication & User Types
export interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
  phone?: string;
  city?: string;
}

export interface AuthResponse {
  token: string;
  type?: string;
  tokenType?: string;
  id: number;
  email: string;
  fullName: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
  user?: User;
}

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  city?: string;
  role: string;
  wishlistVehicleIds: number[];
  savedComparisonCount: number;
}

// Calculators Types
export interface EmiCalculationRequest {
  vehiclePrice: number;
  downPayment: number;
  annualInterestRate: number;
  tenureMonths: number;
}

export interface EmiCalculationResult {
  loanPrincipal: number;
  monthlyEmi: number;
  totalRepayment: number;
  totalInterest: number;
  annualInterestRate: number;
  tenureMonths: number;
  assumptions: string;
}

export interface RunningCostRequest {
  monthlyDistanceKm: number;
  fuelPricePerUnit: number;
  vehicleEfficiency: number;
  isElectric: boolean;
  electricityCostPerKwh?: number;
  evBatteryCapacityKwh?: number;
  evCertifiedRangeKm?: number;
}

export interface RunningCostResult {
  monthlyCost: number;
  annualCost: number;
  costPerKm: number;
  equivalentPetrolCostMonthly: number;
  projectedAnnualSavings: number;
  powertrainType: string;
  formulaExplanation: string;
}

export interface OwnershipCostResult {
  tenureYears: number;
  purchasePrice: number;
  financingInterest: number;
  totalFuelEnergyCost: number;
  totalMaintenanceCost: number;
  totalInsuranceCost: number;
  estimatedResaleValue: number;
  netTotalCostOfOwnership: number;
  effectiveMonthlyOwnershipCost: number;
  costBreakdown: Record<string, number>;
  disclaimer: string;
}

// Recommendation Types
export interface OwnershipAffordability {
  exShowroomPrice: number;
  onRoadPrice: number;
  downPayment: number;
  loanAmount: number;
  monthlyEmi: number;
  monthlyFuelOrEnergyCost: number;
  annualMaintenanceEstimate: number;
  annualInsuranceEstimate: number;
  fiveYearTotalCostOfOwnership: number;
  calculationAssumptions: string;
}

export interface QuestionnaireAnswers {
  budgetAmount: number;
  budgetType?: 'PURCHASE' | 'EMI';
  isStrictBudget?: boolean;
  state?: string;
  city?: string;
  category?: VehicleCategory;
  bodyStyle?: string;
  preferredFuels?: string[];
  preferredTransmission?: string;
  dailyDistanceKm?: number;
  cityDrivingPercent?: number;
  commuteType?: string;
  evHomeChargingAvailable?: boolean;
  evChargingAccess?: string;
  performancePriority?: string;
  minSeatingCapacity?: number;
  highGroundClearanceNeeded?: boolean;
  ridingErgonomics?: string;
  topPriorities?: string[];
  nonNegotiables?: string[];
  allowNearMatches?: boolean;
}

export interface RecommendationResult {
  rank: number;
  vehicle: VehicleSummary;
  recommendedVariant: VehicleVariant;
  overallScore: number;
  scoreBreakdown: Record<string, number>;
  matchBadge?: string;
  reasons: string[];
  tradeOffs?: string[];
  dataConfidenceScore?: number;
  dataConfidenceLevel?: 'HIGH_VERIFIED' | 'MEDIUM_VERIFIED' | 'CAUTION_MISSING_DATA' | string;
  categorySpecs?: Record<string, string>;
  affordability?: OwnershipAffordability;
  relativePositionExplanation?: string;
  missingDataWarnings: string[];
  isNearMatch: boolean;
}

export interface RecommendationResponse {
  matchedResults: RecommendationResult[];
  nearMatchResults: RecommendationResult[];
  unmatchedConstraintNotes: string[];
  userSummary: string;
}

// Dealer & Enquiries Types
export interface Dealer {
  id: number;
  name: string;
  brandName?: string;
  brandId?: number;
  divisionName?: string;
  brand?: Brand;
  dealerType?: 'SALES' | 'SERVICE' | 'SALES_AND_SERVICE' | string;
  address: string;
  locality?: string;
  city: string;
  state?: string;
  pincode?: string;
  phone: string;
  email?: string;
  website?: string;
  officialLocatorUrl?: string;
  businessHours?: string;
  verifiedSource?: string;
  verifiedDate?: string;
  verificationStatus?: string;
  googleRating?: number;
  isAuthorized: boolean;
  latitude?: number;
  longitude?: number;
  distanceKm?: number | null;
  availabilityStatus?: 'CONFIRMED_IN_STOCK' | 'AVAILABLE_FOR_TEST_DRIVE' | 'BOOKING_OPEN' | 'NOT_VERIFIED' | string;
  testDriveAvailable?: boolean;
  estimatedDeliveryDays?: number | null;
  vehicleCategory?: string;
}

export interface DealerEnquiryRequest {
  dealerId?: number;
  vehicleId: number;
  variantId?: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  city?: string;
  enquiryType: 'TEST_DRIVE' | 'PRICE_QUOTE' | 'FINANCING' | 'GENERAL';
  preferredDate?: string;
  message?: string;
}

export interface DealerEnquiryResponse {
  id: number;
  dealerName?: string;
  vehicleName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  city?: string;
  enquiryType: string;
  preferredDate?: string;
  status: string;
  createdAt: string;
}

// Admin Telemetry Types
export interface AdminStats {
  totalVehicles: number;
  totalVariants: number;
  totalBrands: number;
  totalDealers: number;
  totalEnquiries: number;
  pendingEnquiries: number;
  countByCategory: Record<string, number>;
  recordsWithMissingSafetyRatings: number;
  recordsWithMissingEfficiency: number;
}

import {
  AdminStats,
  ApiResponse,
  AuthResponse,
  Brand,
  CompareSearchResult,
  Dealer,
  DealerEnquiryRequest,
  DealerEnquiryResponse,
  EmiCalculationRequest,
  EmiCalculationResult,
  OwnershipCostResult,
  PageResponse,
  QuestionnaireAnswers,
  RecommendationResponse,
  RunningCostRequest,
  RunningCostResult,
  User,
  UserProfile,
  VehicleCategory,
  VehicleDetail,
  VehicleFilterParams,
  VehicleSummary,
} from '../types';

/**
 * Normalizes backend API base URL:
 * - Trims trailing slashes
 * - Automatically appends /api/v1 if the user provided only the domain
 * - Defaults to /api/v1 for local proxying / same-domain deployments
 */
function getApiBaseUrl(): string {
  const envUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
  if (!envUrl) {
    return '/api/v1';
  }
  const cleanUrl = envUrl.replace(/\/+$/, '');
  if (!cleanUrl.endsWith('/api/v1') && !cleanUrl.includes('/api/')) {
    return `${cleanUrl}/api/v1`;
  }
  return cleanUrl;
}

export const API_BASE = getApiBaseUrl();

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('mvc_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Robust fetch wrapper that handles network errors, Render cold-boots,
 * and informative diagnostic messaging instead of silent 'Failed to fetch'.
 */
async function fetchApi(url: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Connection timed out. The backend server might be starting up from idle (cold boot). Please wait a few seconds and try again.');
    }
    throw new Error(
      `Unable to connect to the backend server at ${url}. ` +
      `Please ensure your backend service on Render is active and VITE_API_BASE_URL is configured properly.`
    );
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') || '';
  if (!res.ok) {
    if (contentType.includes('application/json')) {
      const errorBody = await res.json().catch(() => null);
      const message = errorBody?.message || `HTTP error ${res.status}: ${res.statusText}`;
      throw new Error(message);
    } else {
      const text = await res.text().catch(() => '');
      throw new Error(`Server returned HTTP ${res.status} (${res.statusText}): ${text.substring(0, 150)}`);
    }
  }

  if (!contentType.includes('application/json')) {
    throw new Error(
      'Unexpected non-JSON response from server. Check that VITE_API_BASE_URL points to your live backend on Render and not the frontend.'
    );
  }

  const result: ApiResponse<T> = await res.json();
  if (!result.success) {
    throw new Error(result.message || 'Operation failed');
  }
  return result.data;
}

export const api = {
  // Brand Endpoints
  async getBrands(): Promise<Brand[]> {
    const res = await fetchApi(`${API_BASE}/brands`);
    return handleResponse<Brand[]>(res);
  },

  // Vehicle Catalogue Endpoints
  async getTrendingVehicles(): Promise<VehicleSummary[]> {
    const res = await fetchApi(`${API_BASE}/vehicles/trending`);
    return handleResponse<VehicleSummary[]>(res);
  },

  async getFeaturedVehicles(): Promise<VehicleSummary[]> {
    const res = await fetchApi(`${API_BASE}/vehicles/featured`);
    return handleResponse<VehicleSummary[]>(res);
  },

  async getVehicles(params: VehicleFilterParams = {}): Promise<PageResponse<VehicleSummary>> {
    const query = new URLSearchParams();
    if (params.query) query.set('query', params.query);
    if (params.category) query.set('category', params.category);
    if (params.brandId) query.set('brandId', params.brandId.toString());
    if (params.bodyStyle) query.set('bodyStyle', params.bodyStyle);
    if (params.minPrice) query.set('minPrice', params.minPrice.toString());
    if (params.maxPrice) query.set('maxPrice', params.maxPrice.toString());
    if (params.page !== undefined) query.set('page', params.page.toString());
    if (params.size !== undefined) query.set('size', params.size.toString());
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortDir) query.set('sortDir', params.sortDir);

    const res = await fetchApi(`${API_BASE}/vehicles?${query.toString()}`);
    return handleResponse<PageResponse<VehicleSummary>>(res);
  },

  async getVehicleById(id: number): Promise<VehicleDetail> {
    const res = await fetchApi(`${API_BASE}/vehicles/${id}`);
    return handleResponse<VehicleDetail>(res);
  },

  async searchVariantsForCompare(query: string, limit: number = 10): Promise<CompareSearchResult[]> {
    if (!query || query.trim().length < 2) return [];
    const res = await fetchApi(`${API_BASE}/vehicles/compare-search?query=${encodeURIComponent(query)}&limit=${limit}`);
    return handleResponse<CompareSearchResult[]>(res);
  },

  // Authentication Endpoints
  async login(payload: { email: string; password: string }): Promise<AuthResponse> {
    const res = await fetchApi(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<AuthResponse>(res);
  },

  async register(payload: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    city?: string;
  }): Promise<AuthResponse> {
    const res = await fetchApi(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<AuthResponse>(res);
  },

  async getMe(): Promise<UserProfile> {
    const res = await fetchApi(`${API_BASE}/users/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<UserProfile>(res);
  },

  // Customer Wishlist & Saved Comparisons
  async getWishlist(): Promise<VehicleSummary[]> {
    const res = await fetchApi(`${API_BASE}/users/wishlist`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<VehicleSummary[]>(res);
  },

  async addToWishlist(vehicleId: number): Promise<void> {
    const res = await fetchApi(`${API_BASE}/users/wishlist/${vehicleId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    await handleResponse<void>(res);
  },

  async removeFromWishlist(vehicleId: number): Promise<void> {
    const res = await fetchApi(`${API_BASE}/users/wishlist/${vehicleId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    await handleResponse<void>(res);
  },

  async getSavedComparisons(): Promise<any[]> {
    const res = await fetchApi(`${API_BASE}/users/saved-comparisons`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<any[]>(res);
  },

  async saveComparison(payload: { title: string; variantIds: number[]; notes?: string }): Promise<any> {
    const res = await fetchApi(`${API_BASE}/users/saved-comparisons`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<any>(res);
  },

  // Recommendation Engine
  async evaluateRecommendations(payload: QuestionnaireAnswers): Promise<RecommendationResponse> {
    const res = await fetchApi(`${API_BASE}/recommendations/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<RecommendationResponse>(res);
  },

  // Financial & Ownership Calculators
  async calculateEmi(payload: EmiCalculationRequest): Promise<EmiCalculationResult> {
    const res = await fetchApi(`${API_BASE}/calculators/emi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<EmiCalculationResult>(res);
  },

  async calculateRunningCost(payload: RunningCostRequest): Promise<RunningCostResult> {
    const res = await fetchApi(`${API_BASE}/calculators/running-cost`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<RunningCostResult>(res);
  },

  async calculateOwnershipCost(payload: {
    purchasePrice: number;
    years?: number;
    annualKm?: number;
    isElectric?: boolean;
    mileage?: number;
  }): Promise<OwnershipCostResult> {
    const res = await fetchApi(`${API_BASE}/calculators/ownership-cost`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<OwnershipCostResult>(res);
  },

  // Dealers & Enquiries
  async getDealers(
    queryOrCity?: string | {
      vehicleId?: number;
      variantId?: number;
      brandId?: number;
      brandName?: string;
      category?: string;
      dealerType?: string;
      city?: string;
      state?: string;
      pincode?: string;
      latitude?: number;
      longitude?: number;
      radiusKm?: number;
    },
    brandId?: number
  ): Promise<Dealer[]> {
    const params = new URLSearchParams();
    if (typeof queryOrCity === 'object' && queryOrCity !== null) {
      if (queryOrCity.vehicleId) params.set('vehicleId', queryOrCity.vehicleId.toString());
      if (queryOrCity.variantId) params.set('variantId', queryOrCity.variantId.toString());
      if (queryOrCity.brandId) params.set('brandId', queryOrCity.brandId.toString());
      if (queryOrCity.brandName) params.set('brandName', queryOrCity.brandName);
      if (queryOrCity.category) params.set('category', queryOrCity.category);
      if (queryOrCity.dealerType) params.set('dealerType', queryOrCity.dealerType);
      if (queryOrCity.city) params.set('city', queryOrCity.city);
      if (queryOrCity.state) params.set('state', queryOrCity.state);
      if (queryOrCity.pincode) params.set('pincode', queryOrCity.pincode);
      if (queryOrCity.latitude != null) params.set('latitude', queryOrCity.latitude.toString());
      if (queryOrCity.longitude != null) params.set('longitude', queryOrCity.longitude.toString());
      if (queryOrCity.radiusKm != null) params.set('radiusKm', queryOrCity.radiusKm.toString());
    } else {
      if (queryOrCity) params.set('city', queryOrCity);
      if (brandId) params.set('brandId', brandId.toString());
    }
    const res = await fetchApi(`${API_BASE}/dealers?${params.toString()}`);
    return handleResponse<Dealer[]>(res);
  },

  async submitEnquiry(payload: DealerEnquiryRequest): Promise<DealerEnquiryResponse> {
    const res = await fetchApi(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<DealerEnquiryResponse>(res);
  },

  // Admin Endpoints
  async getAdminStats(): Promise<AdminStats> {
    const res = await fetchApi(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<AdminStats>(res);
  },

  async getAdminEnquiries(page: number = 0, size: number = 20): Promise<PageResponse<DealerEnquiryResponse>> {
    const res = await fetchApi(`${API_BASE}/admin/enquiries?page=${page}&size=${size}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<PageResponse<DealerEnquiryResponse>>(res);
  },

  async updateEnquiryStatus(id: number, status: string): Promise<DealerEnquiryResponse> {
    const res = await fetchApi(`${API_BASE}/admin/enquiries/${id}/status?status=${encodeURIComponent(status)}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    return handleResponse<DealerEnquiryResponse>(res);
  },

  async createVehicle(payload: any): Promise<VehicleDetail> {
    const res = await fetchApi(`${API_BASE}/admin/vehicles`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<VehicleDetail>(res);
  },

  async deleteVehicle(id: number): Promise<void> {
    const res = await fetchApi(`${API_BASE}/admin/vehicles/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    await handleResponse<void>(res);
  },

  async importCsv(file: File): Promise<{ importedRecords: number; errorCount: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('mvc_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetchApi(`${API_BASE}/admin/import-csv`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse<{ importedRecords: number; errorCount: number; errors: string[] }>(res);
  },
};

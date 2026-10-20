# MyVehicleChoice — Frontend API Consumption Specification

See the master copy at [FRONTEND_ENDPOINTS.md](file:///C:/Users/Mohamed%20hiddhaya/.gemini/antigravity/scratch/myvehiclechoice/FRONTEND_ENDPOINTS.md).

All endpoints consumed by the React 19 / TypeScript application are organized under [`src/services/api.ts`](file:///C:/Users/Mohamed%20hiddhaya/.gemini/antigravity/scratch/myvehiclechoice/frontend/src/services/api.ts) with strict TypeScript types in [`src/types/index.ts`](file:///C:/Users/Mohamed%20hiddhaya/.gemini/antigravity/scratch/myvehiclechoice/frontend/src/types/index.ts).

## Endpoint Overview
- **Authentication:** `POST /api/v1/auth/login`, `POST /api/v1/auth/register`, `GET /api/v1/users/me`
- **Catalogue & Autocomplete:** `GET /api/v1/brands`, `GET /api/v1/vehicles`, `GET /api/v1/vehicles/{id}`, `GET /api/v1/vehicles/trending`, `GET /api/v1/vehicles/featured`, `GET /api/v1/vehicles/compare-search`
- **Recommendation Engine:** `POST /api/v1/recommendations/evaluate`
- **Calculators:** `POST /api/v1/calculators/emi`, `POST /api/v1/calculators/running-cost`, `POST /api/v1/calculators/ownership-cost`
- **Dealerships & Enquiries:** `GET /api/v1/dealers`, `POST /api/v1/enquiries`
- **Customer Shortlists:** `GET /api/v1/users/wishlist`, `POST /api/v1/users/wishlist/{id}`, `DELETE /api/v1/users/wishlist/{id}`, `GET /api/v1/users/saved-comparisons`, `POST /api/v1/users/saved-comparisons`
- **Admin Control Center:** `GET /api/v1/admin/stats`, `GET /api/v1/admin/enquiries`, `PATCH /api/v1/admin/enquiries/{id}/status`, `POST /api/v1/admin/vehicles`, `DELETE /api/v1/admin/vehicles/{id}`, `POST /api/v1/admin/import-csv`

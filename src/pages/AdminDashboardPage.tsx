import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  BarChart3, 
  Users, 
  Car, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  PlusCircle, 
  RefreshCw,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AdminStats, Brand, DealerEnquiryResponse } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'LEADS' | 'ADD_VEHICLE' | 'CSV_IMPORT'>('TELEMETRY');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [enquiries, setEnquiries] = useState<DealerEnquiryResponse[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // New vehicle form state
  const [newVehicle, setNewVehicle] = useState({
    brandId: '',
    modelName: '',
    category: 'CAR',
    bodyStyle: 'SUV',
    headline: '',
    description: '',
    heroImageUrl: '',
    isTrending: false,
    isFeatured: false,
  });
  const [vehicleSuccess, setVehicleSuccess] = useState<string | null>(null);

  // CSV Import state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<{ importedRecords: number; errorCount: number; errors: string[] } | null>(null);
  const [importLoading, setImportLoading] = useState(false);

  const loadDashboardData = async () => {
    setRefreshing(true);
    try {
      const [statsRes, enquiriesRes, brandsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminEnquiries(0, 50),
        api.getBrands(),
      ]);
      setStats(statsRes);
      setEnquiries(enquiriesRes.content || []);
      setBrands(brandsRes);
      if (brandsRes.length > 0 && !newVehicle.brandId) {
        setNewVehicle(prev => ({ ...prev, brandId: brandsRes[0].id.toString() }));
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-transparent text-slate-900">
        <div className="max-w-md w-full glass-card border border-rose-200 rounded-2xl p-8 text-center shadow-xl bg-white/95">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Restricted Administrator Area</h2>
          <p className="text-slate-600 text-xs mb-6">
            You must be signed in with an authorized <code className="text-rose-600 font-semibold">ROLE_ADMIN</code> account to manage the catalogue, view customer leads, and import vehicle datasets.
          </p>
          <div className="space-y-2">
            <Link
              to="/login"
              className="block w-full py-2.5 rounded-xl btn-galaxy-primary text-white font-bold text-xs transition-colors shadow-sm"
            >
              Sign In as Admin
            </Link>
            <p className="text-[10px] text-slate-500">
              Demo admin account: <span className="text-rose-600 font-mono">admin@myvehiclechoice.in / Password@123</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (enquiryId: number, newStatus: string) => {
    try {
      const updated = await api.updateEnquiryStatus(enquiryId, newStatus);
      setEnquiries(prev => prev.map(e => (e.id === enquiryId ? updated : e)));
    } catch (err) {
      alert('Failed to update enquiry status');
    }
  };

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setVehicleSuccess(null);
    try {
      await api.createVehicle({
        ...newVehicle,
        brandId: Number(newVehicle.brandId),
      });
      setVehicleSuccess(`Vehicle "${newVehicle.modelName}" added successfully to catalogue!`);
      setNewVehicle({
        brandId: brands[0]?.id?.toString() || '',
        modelName: '',
        category: 'CAR',
        bodyStyle: 'SUV',
        headline: '',
        description: '',
        heroImageUrl: '',
        isTrending: false,
        isFeatured: false,
      });
      loadDashboardData();
    } catch (err: any) {
      alert(`Error creating vehicle: ${err.message}`);
    }
  };

  const handleCsvImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) return;
    setImportLoading(true);
    setImportResult(null);
    try {
      const res = await api.importCsv(csvFile);
      setImportResult(res);
      loadDashboardData();
    } catch (err: any) {
      alert(`CSV Import failed: ${err.message}`);
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Radiant very light pink ambient background */}
      <div className="absolute top-10 right-1/4 w-[600px] h-[350px] bg-pink-200/25 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[350px] bg-rose-200/20 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-pink-100 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-pink-200 text-rose-600 text-xs font-semibold mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Platform Operations & Data Quality Console</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">Administrator Control Center</h1>
            <p className="text-slate-500 text-xs mt-1">
              Signed in as <strong className="text-slate-800">{user?.fullName}</strong> ({user?.email})
            </p>
          </div>

          <button
            onClick={loadDashboardData}
            disabled={refreshing}
            className="self-start md:self-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-rose-50 text-slate-700 text-xs font-semibold border border-pink-200 transition-colors shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-rose-500 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Metrics</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-pink-100 pb-3">
          {[
            { id: 'TELEMETRY', label: 'Catalogue Telemetry & Health', icon: BarChart3 },
            { id: 'LEADS', label: `Customer Leads (${enquiries.length})`, icon: Users },
            { id: 'ADD_VEHICLE', label: 'Add Vehicle', icon: PlusCircle },
            { id: 'CSV_IMPORT', label: 'Bulk CSV Importer', icon: FileSpreadsheet },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'btn-galaxy-primary text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-rose-50/50 border border-pink-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ===================================== */}
        {/* TAB 1: TELEMETRY & HEALTH */}
        {/* ===================================== */}
        {activeTab === 'TELEMETRY' && stats && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="glass-card bg-white p-4 rounded-2xl border border-pink-200/80 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Vehicles</span>
                <span className="text-2xl font-black text-slate-900">{stats.totalVehicles}</span>
              </div>
              <div className="glass-card bg-white p-4 rounded-2xl border border-pink-200/80 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Variants</span>
                <span className="text-2xl font-black text-rose-600">{stats.totalVariants}</span>
              </div>
              <div className="glass-card bg-white p-4 rounded-2xl border border-pink-200/80 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Active Brands</span>
                <span className="text-2xl font-black text-slate-900">{stats.totalBrands}</span>
              </div>
              <div className="glass-card bg-white p-4 rounded-2xl border border-pink-200/80 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Dealerships</span>
                <span className="text-2xl font-black text-slate-900">{stats.totalDealers}</span>
              </div>
              <div className="glass-card bg-white p-4 rounded-2xl border border-pink-200/80 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Total Enquiries</span>
                <span className="text-2xl font-black text-slate-900">{stats.totalEnquiries}</span>
              </div>
              <div className="glass-card bg-amber-50/50 p-4 rounded-2xl border border-amber-200 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-amber-700 block mb-1">Pending Follow-up</span>
                <span className="text-2xl font-black text-amber-600">{stats.pendingEnquiries}</span>
              </div>
            </div>

            {/* Catalogue Health & Integrity Alert Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card bg-white p-5 rounded-2xl border border-pink-200/80 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-900">Data Integrity & Verification Telemetry</h3>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-pink-100">
                    <span className="text-slate-600">Variants without published crash rating:</span>
                    <span className="font-bold text-amber-600">
                      {stats.recordsWithMissingSafetyRatings} variants
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-pink-100">
                    <span className="text-slate-600">Variants with pending fuel/efficiency rating:</span>
                    <span className="font-bold text-slate-700">
                      {stats.recordsWithMissingEfficiency} variants
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 pt-1">
                    * Policy: Never fabricate unverified NCAP stars or ARAI figures. The recommendation engine explicitly tags missing data warnings on vehicle cards.
                  </p>
                </div>
              </div>

              <div className="glass-card bg-white p-5 rounded-2xl border border-pink-200/80 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Catalogue Distribution by Category</h3>
                <div className="space-y-2 text-xs">
                  {Object.entries(stats.countByCategory || {}).map(([cat, count]) => (
                    <div key={cat} className="flex justify-between items-center py-1.5 border-b border-pink-100">
                      <span className="text-slate-600 uppercase font-medium">{cat.replace(/_/g, ' ')}</span>
                      <span className="font-bold text-rose-600">{count} models</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================== */}
        {/* TAB 2: CUSTOMER LEADS & ENQUIRIES */}
        {/* ===================================== */}
        {activeTab === 'LEADS' && (
          <div className="glass-card bg-white rounded-2xl border border-pink-200/80 overflow-hidden shadow-md">
            <div className="p-5 border-b border-pink-100 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900">Dealer Enquiries & Test Drive Requests</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real customer submissions from the "Where to Buy" portal
                </p>
              </div>
              <span className="text-xs bg-rose-50 text-rose-600 border border-pink-200 px-3 py-1 rounded-full font-bold">
                {enquiries.length} Active Leads
              </span>
            </div>

            {enquiries.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No customer enquiries submitted yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-pink-50/50 text-slate-600 uppercase tracking-wider text-[10px] border-b border-pink-100">
                    <tr>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Vehicle Interested</th>
                      <th className="py-3 px-4">Dealer / Location</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Submitted</th>
                      <th className="py-3 px-4">Lead Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-100">
                    {enquiries.map((enq) => (
                      <tr key={enq.id} className="hover:bg-rose-50/30 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {enq.customerName}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">
                          <div>{enq.customerPhone}</div>
                          <div className="text-[10px] text-slate-500">{enq.customerEmail}</div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-rose-600">
                          {enq.vehicleName}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <div>{enq.dealerName || 'Direct Booking'}</div>
                          <div className="text-[10px] text-slate-400">{enq.city}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                            {enq.enquiryType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-[10px]">
                          {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={enq.status}
                            onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none cursor-pointer ${
                              enq.status === 'NEW'
                                ? 'bg-amber-50 border-amber-200 text-amber-700'
                                : enq.status === 'TEST_DRIVE_SCHEDULED'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : enq.status === 'CLOSED'
                                ? 'bg-slate-100 border-slate-200 text-slate-500'
                                : 'bg-rose-50 border-rose-200 text-rose-700'
                            }`}
                          >
                            <option value="NEW" className="bg-white text-slate-900">NEW</option>
                            <option value="CONTACTED" className="bg-white text-slate-900">CONTACTED</option>
                            <option value="TEST_DRIVE_SCHEDULED" className="bg-white text-slate-900">TEST_DRIVE_SCHEDULED</option>
                            <option value="CLOSED" className="bg-white text-slate-900">CLOSED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ===================================== */}
        {/* TAB 3: ADD NEW VEHICLE TO CATALOGUE */}
        {/* ===================================== */}
        {activeTab === 'ADD_VEHICLE' && (
          <div className="max-w-2xl glass-card bg-white rounded-2xl border border-pink-200/80 p-6 sm:p-8 shadow-md">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Add New Vehicle to Platform</h3>
            <p className="text-xs text-slate-500 mb-6">
              Create a vehicle model entry. Variants can be added via API or the CSV bulk importer.
            </p>

            {vehicleSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{vehicleSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateVehicle} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Brand</label>
                  <select
                    value={newVehicle.brandId}
                    onChange={(e) => setNewVehicle({ ...newVehicle, brandId: e.target.value })}
                    required
                    className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-slate-900 text-xs font-semibold focus:outline-none focus:border-rose-500 cursor-pointer shadow-sm"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Model Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Harrier EV"
                    value={newVehicle.modelName}
                    onChange={(e) => setNewVehicle({ ...newVehicle, modelName: e.target.value })}
                    className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-rose-500 shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Category</label>
                  <select
                    value={newVehicle.category}
                    onChange={(e) => setNewVehicle({ ...newVehicle, category: e.target.value })}
                    className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-rose-500 cursor-pointer shadow-sm"
                  >
                    <option value="CAR">Passenger Car</option>
                    <option value="ELECTRIC_CAR">Electric Car (EV)</option>
                    <option value="MOTORCYCLE">Motorcycle</option>
                    <option value="ELECTRIC_TWO_WHEELER">Electric Two-Wheeler</option>
                    <option value="SCOOTER">Scooter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Body Style</label>
                  <input
                    type="text"
                    placeholder="e.g. Compact SUV / Roadster"
                    value={newVehicle.bodyStyle}
                    onChange={(e) => setNewVehicle({ ...newVehicle, bodyStyle: e.target.value })}
                    className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-rose-500 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Marketing Headline</label>
                <input
                  type="text"
                  placeholder="e.g. India's safest 5-star mid-size electric SUV"
                  value={newVehicle.headline}
                  onChange={(e) => setNewVehicle({ ...newVehicle, headline: e.target.value })}
                  className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-rose-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Hero Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newVehicle.heroImageUrl}
                  onChange={(e) => setNewVehicle({ ...newVehicle, heroImageUrl: e.target.value })}
                  className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-rose-500 shadow-sm"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={newVehicle.isTrending}
                    onChange={(e) => setNewVehicle({ ...newVehicle, isTrending: e.target.checked })}
                    className="accent-rose-500 cursor-pointer"
                  />
                  <span>Show in Trending</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={newVehicle.isFeatured}
                    onChange={(e) => setNewVehicle({ ...newVehicle, isFeatured: e.target.checked })}
                    className="accent-rose-500 cursor-pointer"
                  />
                  <span>Show in Featured Picks</span>
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl btn-galaxy-primary text-white font-bold text-xs transition-colors shadow-md cursor-pointer"
                >
                  Create Vehicle Record
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===================================== */}
        {/* TAB 4: BULK CSV IMPORTER */}
        {/* ===================================== */}
        {activeTab === 'CSV_IMPORT' && (
          <div className="max-w-3xl glass-card bg-white rounded-2xl border border-pink-200/80 p-6 sm:p-8 shadow-md">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Bulk Vehicle Dataset CSV Importer</h3>
            <p className="text-xs text-slate-500 mb-6">
              Upload batches of vehicles and variants simultaneously. Automatically resolves or registers missing brands.
            </p>

            {/* CSV Specification Format Helper */}
            <div className="p-4 rounded-xl bg-pink-50/40 border border-pink-100 mb-6">
              <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider block mb-2">
                Required CSV Column Headers
              </span>
              <pre className="text-[11px] text-slate-800 bg-white p-2.5 rounded-lg overflow-x-auto font-mono border border-pink-100">
Brand,Model,Category,Variant,ExShowroomPrice,EstimatedOnRoadPrice,FuelType,Transmission
Tata,Punch EV,ELECTRIC_CAR,Long Range Empowered,1399000,1485000,ELECTRIC,AUTOMATIC
              </pre>
            </div>

            <form onSubmit={handleCsvImport} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-2">
                  Select CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  required
                  onChange={(e) => setCsvFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-rose-500 file:text-white hover:file:bg-rose-600 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={!csvFile || importLoading}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl btn-galaxy-primary text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50 cursor-pointer"
              >
                {importLoading ? (
                  <span>Importing Records...</span>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload & Process CSV</span>
                  </>
                )}
              </button>
            </form>

            {/* Result */}
            {importResult && (
              <div className="mt-6 pt-6 border-t border-pink-100 space-y-3">
                <div className="flex gap-4">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
                    <strong>{importResult.importedRecords}</strong> records imported successfully
                  </div>
                  {importResult.errorCount > 0 && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
                      <strong>{importResult.errorCount}</strong> rows had parsing errors
                    </div>
                  )}
                </div>

                {importResult.errors.length > 0 && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs space-y-1 font-mono">
                    {importResult.errors.map((err, i) => (
                      <p key={i}>• {err}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

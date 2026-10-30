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
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-[#F4F0E8] text-[#171717] font-body">
        <div className="max-w-md w-full luxury-card border border-[#171717]/15 rounded-2xl p-8 text-center shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-[#B9975B]/15 text-[#B9975B] mx-auto flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#171717] mb-2 font-heading">Restricted Administrator Area</h2>
          <p className="text-neutral-600 text-xs mb-6">
            You must be signed in with an authorized <code className="text-[#8C6F37] font-semibold">ROLE_ADMIN</code> account to manage the catalogue, view customer leads, and import vehicle datasets.
          </p>
          <div className="space-y-2">
            <Link
              to="/login"
              className="block w-full py-2.5 rounded-xl btn-gold font-bold text-xs transition-colors shadow-sm"
            >
              Sign In as Admin
            </Link>
            <p className="text-[10px] text-neutral-500 font-body">
              Demo admin account: <span className="text-[#8C6F37] font-mono">admin@myvehiclechoice.in / Password@123</span>
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
    <div className="min-h-screen bg-[#F4F0E8] text-[#171717] py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle luxury ambient glow */}
      <div className="absolute top-10 right-1/4 w-[600px] h-[350px] bg-[#B9975B]/8 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[350px] bg-[#171717]/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#171717]/10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B9975B]/15 border border-[#B9975B]/30 text-[#8C6F37] text-xs font-semibold mb-2 font-heading">
              <ShieldAlert className="w-3.5 h-3.5 text-[#B9975B]" />
              <span>Platform Operations & Data Quality Console</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717] font-heading">Administrator Control Center</h1>
            <p className="text-neutral-500 text-xs mt-1 font-body">
              Signed in as <strong className="text-neutral-800">{user?.fullName}</strong> ({user?.email})
            </p>
          </div>

          <button
            onClick={loadDashboardData}
            disabled={refreshing}
            className="self-start md:self-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#B9975B]/10 text-neutral-700 text-xs font-semibold border border-[#171717]/15 transition-colors shadow-sm cursor-pointer font-body"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#B9975B] ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Metrics</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#171717]/10 pb-3 font-body">
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
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer font-heading ${
                  activeTab === tab.id
                    ? 'bg-[#171717] text-[#B9975B] shadow-sm'
                    : 'bg-white text-neutral-600 hover:text-[#171717] hover:bg-[#B9975B]/10 border border-[#171717]/10'
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-body">
              <div className="luxury-card p-4">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1 font-heading">Vehicles</span>
                <span className="text-2xl font-black text-[#171717] tabular-nums font-heading">{stats.totalVehicles}</span>
              </div>
              <div className="luxury-card p-4">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1 font-heading">Variants</span>
                <span className="text-2xl font-black text-[#8C6F37] tabular-nums font-heading">{stats.totalVariants}</span>
              </div>
              <div className="luxury-card p-4">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1 font-heading">Active Brands</span>
                <span className="text-2xl font-black text-[#171717] tabular-nums font-heading">{stats.totalBrands}</span>
              </div>
              <div className="luxury-card p-4">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1 font-heading">Dealerships</span>
                <span className="text-2xl font-black text-[#171717] tabular-nums font-heading">{stats.totalDealers}</span>
              </div>
              <div className="luxury-card p-4">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1 font-heading">Total Enquiries</span>
                <span className="text-2xl font-black text-[#171717] tabular-nums font-heading">{stats.totalEnquiries}</span>
              </div>
              <div className="luxury-card bg-[#B9975B]/10 border-[#B9975B]/30 p-4">
                <span className="text-[10px] uppercase font-bold text-[#8C6F37] block mb-1 font-heading">Pending Follow-up</span>
                <span className="text-2xl font-black text-[#8C6F37] tabular-nums font-heading">{stats.pendingEnquiries}</span>
              </div>
            </div>

            {/* Catalogue Health & Integrity Alert Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-body">
              <div className="luxury-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-bold text-[#171717] font-heading">Data Integrity & Verification Telemetry</h3>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-[#171717]/10">
                    <span className="text-neutral-600">Variants without published crash rating:</span>
                    <span className="font-bold text-amber-700 tabular-nums">
                      {stats.recordsWithMissingSafetyRatings} variants
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#171717]/10">
                    <span className="text-neutral-600">Variants with pending fuel/efficiency rating:</span>
                    <span className="font-bold text-neutral-700 tabular-nums">
                      {stats.recordsWithMissingEfficiency} variants
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-500 pt-1">
                    * Policy: Never fabricate unverified NCAP stars or ARAI figures. The recommendation engine explicitly tags missing data warnings on vehicle cards.
                  </p>
                </div>
              </div>

              <div className="luxury-card p-5">
                <h3 className="text-sm font-bold text-[#171717] mb-3 font-heading">Catalogue Distribution by Category</h3>
                <div className="space-y-2 text-xs">
                  {Object.entries(stats.countByCategory || {}).map(([cat, count]) => (
                    <div key={cat} className="flex justify-between items-center py-1.5 border-b border-[#171717]/10">
                      <span className="text-neutral-600 uppercase font-medium">{cat.replace(/_/g, ' ')}</span>
                      <span className="font-bold text-[#8C6F37] tabular-nums">{count} models</span>
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
          <div className="luxury-card rounded-2xl overflow-hidden shadow-md font-body">
            <div className="p-5 border-b border-[#171717]/10 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-[#171717] font-heading">Dealer Enquiries & Test Drive Requests</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Real customer submissions from the "Where to Buy" portal
                </p>
              </div>
              <span className="text-xs bg-[#B9975B]/15 text-[#8C6F37] border border-[#B9975B]/30 px-3 py-1 rounded-full font-bold tabular-nums">
                {enquiries.length} Active Leads
              </span>
            </div>

            {enquiries.length === 0 ? (
              <div className="py-12 text-center text-neutral-500 text-xs">
                No customer enquiries submitted yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#171717] text-white uppercase tracking-wider text-[10px] border-b border-neutral-700 font-heading">
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
                  <tbody className="divide-y divide-[#171717]/10">
                    {enquiries.map((enq) => (
                      <tr key={enq.id} className="hover:bg-[#B9975B]/5 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#171717]">
                          {enq.customerName}
                        </td>
                        <td className="py-3.5 px-4 text-neutral-700 tabular-nums">
                          <div>{enq.customerPhone}</div>
                          <div className="text-[10px] text-neutral-500">{enq.customerEmail}</div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#8C6F37]">
                          {enq.vehicleName}
                        </td>
                        <td className="py-3.5 px-4 text-neutral-600">
                          <div>{enq.dealerName || 'Direct Booking'}</div>
                          <div className="text-[10px] text-neutral-400">{enq.city}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-[#F4F0E8] text-[#171717] text-[10px] font-semibold border border-[#171717]/10">
                            {enq.enquiryType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-500 text-[10px] tabular-nums">
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
                                ? 'bg-neutral-100 border-neutral-200 text-neutral-500'
                                : 'bg-[#B9975B]/15 border-[#B9975B]/30 text-[#8C6F37]'
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
          <div className="max-w-2xl luxury-card rounded-2xl p-6 sm:p-8 shadow-md font-body">
            <h3 className="text-lg font-bold text-[#171717] mb-1 font-heading">Add New Vehicle to Platform</h3>
            <p className="text-xs text-neutral-500 mb-6">
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
                  <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1 font-heading">Brand</label>
                  <select
                    value={newVehicle.brandId}
                    onChange={(e) => setNewVehicle({ ...newVehicle, brandId: e.target.value })}
                    required
                    className="w-full bg-white border border-[#171717]/15 rounded-xl px-3 py-2 text-[#171717] text-xs font-semibold focus:outline-none focus:border-[#B9975B] cursor-pointer shadow-sm"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1 font-heading">Model Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Harrier EV"
                    value={newVehicle.modelName}
                    onChange={(e) => setNewVehicle({ ...newVehicle, modelName: e.target.value })}
                    className="w-full bg-white border border-[#171717]/15 rounded-xl px-3 py-2 text-[#171717] text-xs placeholder-neutral-400 focus:outline-none focus:border-[#B9975B] shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1 font-heading">Category</label>
                  <select
                    value={newVehicle.category}
                    onChange={(e) => setNewVehicle({ ...newVehicle, category: e.target.value })}
                    className="w-full bg-white border border-[#171717]/15 rounded-xl px-3 py-2 text-[#171717] text-xs focus:outline-none focus:border-[#B9975B] cursor-pointer shadow-sm"
                  >
                    <option value="CAR">Passenger Car</option>
                    <option value="ELECTRIC_CAR">Electric Car (EV)</option>
                    <option value="MOTORCYCLE">Motorcycle</option>
                    <option value="ELECTRIC_TWO_WHEELER">Electric Two-Wheeler</option>
                    <option value="SCOOTER">Scooter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1 font-heading">Body Style</label>
                  <input
                    type="text"
                    placeholder="e.g. Compact SUV / Roadster"
                    value={newVehicle.bodyStyle}
                    onChange={(e) => setNewVehicle({ ...newVehicle, bodyStyle: e.target.value })}
                    className="w-full bg-white border border-[#171717]/15 rounded-xl px-3 py-2 text-[#171717] text-xs placeholder-neutral-400 focus:outline-none focus:border-[#B9975B] shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1 font-heading">Marketing Headline</label>
                <input
                  type="text"
                  placeholder="e.g. India's safest 5-star mid-size electric SUV"
                  value={newVehicle.headline}
                  onChange={(e) => setNewVehicle({ ...newVehicle, headline: e.target.value })}
                  className="w-full bg-white border border-[#171717]/15 rounded-xl px-3 py-2 text-[#171717] text-xs placeholder-neutral-400 focus:outline-none focus:border-[#B9975B] shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1 font-heading">Hero Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newVehicle.heroImageUrl}
                  onChange={(e) => setNewVehicle({ ...newVehicle, heroImageUrl: e.target.value })}
                  className="w-full bg-white border border-[#171717]/15 rounded-xl px-3 py-2 text-[#171717] text-xs placeholder-neutral-400 focus:outline-none focus:border-[#B9975B] shadow-sm"
                />
              </div>

              <div className="flex items-center gap-6 pt-2 font-body">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-700">
                  <input
                    type="checkbox"
                    checked={newVehicle.isTrending}
                    onChange={(e) => setNewVehicle({ ...newVehicle, isTrending: e.target.checked })}
                    className="accent-[#B9975B] cursor-pointer"
                  />
                  <span>Show in Trending</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-700">
                  <input
                    type="checkbox"
                    checked={newVehicle.isFeatured}
                    onChange={(e) => setNewVehicle({ ...newVehicle, isFeatured: e.target.checked })}
                    className="accent-[#B9975B] cursor-pointer"
                  />
                  <span>Show in Featured Picks</span>
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl btn-gold text-xs font-bold transition-colors shadow-md cursor-pointer"
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
          <div className="max-w-3xl luxury-card rounded-2xl p-6 sm:p-8 shadow-md font-body">
            <h3 className="text-lg font-bold text-[#171717] mb-1 font-heading">Bulk Vehicle Dataset CSV Importer</h3>
            <p className="text-xs text-neutral-500 mb-6">
              Upload batches of vehicles and variants simultaneously. Automatically resolves or registers missing brands.
            </p>

            {/* CSV Specification Format Helper */}
            <div className="p-4 rounded-xl bg-[#F4F0E8]/60 border border-[#171717]/10 mb-6">
              <span className="text-[10px] uppercase font-bold text-[#8C6F37] tracking-wider block mb-2 font-heading">
                Required CSV Column Headers
              </span>
              <pre className="text-[11px] text-neutral-800 bg-white p-2.5 rounded-lg overflow-x-auto font-mono border border-[#171717]/10">
Brand,Model,Category,Variant,ExShowroomPrice,EstimatedOnRoadPrice,FuelType,Transmission
Tata,Punch EV,ELECTRIC_CAR,Long Range Empowered,1399000,1485000,ELECTRIC,AUTOMATIC
              </pre>
            </div>

            <form onSubmit={handleCsvImport} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-700 mb-2 font-heading">
                  Select CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  required
                  onChange={(e) => setCsvFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-xs text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#171717] file:text-[#B9975B] hover:file:bg-neutral-800 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={!csvFile || importLoading}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl btn-gold text-xs font-bold shadow-md transition-colors disabled:opacity-50 cursor-pointer"
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
              <div className="mt-6 pt-6 border-t border-[#171717]/10 space-y-3 font-body">
                <div className="flex gap-4">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                    <strong className="tabular-nums">{importResult.importedRecords}</strong> records imported successfully
                  </div>
                  {importResult.errorCount > 0 && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                      <strong className="tabular-nums">{importResult.errorCount}</strong> rows had parsing errors
                    </div>
                  )}
                </div>

                {importResult.errors.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1 font-mono">
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

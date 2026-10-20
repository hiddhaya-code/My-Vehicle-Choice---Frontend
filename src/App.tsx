import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { CataloguePage } from './pages/CataloguePage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { ComparePage } from './pages/ComparePage';
import { WhereToBuyPage } from './pages/WhereToBuyPage';
import { QuestionnairePage } from './pages/QuestionnairePage';
import { RecommendationResultsPage } from './pages/RecommendationResultsPage';
import { CalculatorsPage } from './pages/CalculatorsPage';
import { SavedVehiclesPage } from './pages/SavedVehiclesPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-transparent font-sans text-slate-900 antialiased selection:bg-rose-500 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/find-my-vehicle" element={<QuestionnairePage />} />
              <Route path="/recommendations" element={<RecommendationResultsPage />} />
              <Route path="/vehicles" element={<CataloguePage />} />
              <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/calculators" element={<CalculatorsPage />} />
              <Route path="/where-to-buy" element={<WhereToBuyPage />} />
              <Route path="/saved" element={<SavedVehiclesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

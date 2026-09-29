import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import ApplyPass from './pages/public/ApplyPass';
import ApplicationStatus from './pages/public/ApplicationStatus';
import ViewPass from './pages/public/ViewPass';
import RenewPass from './pages/public/RenewPass';
import RoutesList from './pages/public/RoutesList';
import PassTypesList from './pages/public/PassTypesList';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminApplications from './pages/admin/AdminApplications';
import AdminPasses from './pages/admin/AdminPasses';
import AdminRenewals from './pages/admin/AdminRenewals';
import AdminBuses from './pages/admin/AdminBuses';
import AdminRoutes from './pages/admin/AdminRoutes';
import AdminBusStops from './pages/admin/AdminBusStops';
import AdminPassTypes from './pages/admin/AdminPassTypes';
import AdminReports from './pages/admin/AdminReports';

function App() {
  return (
    <Routes>
      {/* Public Layout & Pages */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="apply" element={<ApplyPass />} />
        <Route path="application-status" element={<ApplicationStatus />} />
        <Route path="view-pass" element={<ViewPass />} />
        <Route path="renew-pass" element={<RenewPass />} />
        <Route path="routes" element={<RoutesList />} />
        <Route path="pass-types" element={<PassTypesList />} />
      </Route>

      {/* Admin Layout & Pages (No Authentication) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="passes" element={<AdminPasses />} />
        <Route path="renewals" element={<AdminRenewals />} />
        <Route path="buses" element={<AdminBuses />} />
        <Route path="routes" element={<AdminRoutes />} />
        <Route path="bus-stops" element={<AdminBusStops />} />
        <Route path="pass-types" element={<AdminPassTypes />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>
    </Routes>
  );
}

export default App;

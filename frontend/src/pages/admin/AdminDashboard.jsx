import React, { useState, useEffect } from 'react';
import { 
  FaFileAlt, FaClock, FaCheckCircle, FaIdCard, FaCheckDouble, 
  FaExclamationCircle, FaBus, FaRoute, FaMoneyBillWave, FaSyncAlt 
} from 'react-icons/fa';
import { dashboardService } from '../../services/dashboardService';
import StatCard from '../../components/dashboard/StatCard';
import { 
  MonthlyApplicationsChart, 
  MonthlyRevenueChart, 
  StatusDistributionChart 
} from '../../components/dashboard/AnalyticsChart';
import { formatCurrency } from '../../utils/formatters';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.getStats();
      setData(res.data.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Analytics Dashboard...</span>
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const charts = data?.charts || {};

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="font-heading fw-bold text-dark mb-1">System Overview & Analytics</h3>
          <p className="text-muted small mb-0">Real-time metrics for passes, applications, transit fleet, and revenue.</p>
        </div>
        <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" onClick={fetchDashboardData}>
          <FaSyncAlt /> Refresh Data
        </button>
      </div>

      {/* KPI Dashboard Cards Grid */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-4 col-xl-3">
          <StatCard title="Total Applications" value={metrics.total_applications || 0} icon={<FaFileAlt size={22} />} color="primary" />
        </div>
        <div className="col-sm-6 col-lg-4 col-xl-3">
          <StatCard title="Pending Review" value={metrics.pending_applications || 0} icon={<FaClock size={22} />} color="warning" />
        </div>
        <div className="col-sm-6 col-lg-4 col-xl-3">
          <StatCard title="Approved Apps" value={metrics.approved_applications || 0} icon={<FaCheckCircle size={22} />} color="info" />
        </div>
        <div className="col-sm-6 col-lg-4 col-xl-3">
          <StatCard title="Issued Bus Passes" value={metrics.issued_passes || 0} icon={<FaIdCard size={22} />} color="success" />
        </div>

        <div className="col-sm-6 col-lg-4 col-xl-3">
          <StatCard title="Active Passes" value={metrics.active_passes || 0} icon={<FaCheckDouble size={22} />} color="success" />
        </div>
        <div className="col-sm-6 col-lg-4 col-xl-3">
          <StatCard title="Expired Passes" value={metrics.expired_passes || 0} icon={<FaExclamationCircle size={22} />} color="danger" />
        </div>
        <div className="col-sm-6 col-lg-4 col-xl-3">
          <StatCard title="Transit Fleet (Buses)" value={metrics.total_buses || 0} icon={<FaBus size={22} />} color="secondary" />
        </div>
        <div className="col-sm-6 col-lg-4 col-xl-3">
          <StatCard title="Active Routes" value={metrics.total_routes || 0} icon={<FaRoute size={22} />} color="dark" />
        </div>
      </div>

      {/* Revenue Highlight Card */}
      <div className="app-card p-4 mb-4 bg-primary text-white shadow-sm" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <span className="text-blue-200 text-uppercase fw-bold fs-8 tracking-wider">Total Collection Revenue</span>
            <h1 className="font-heading fw-bold display-5 mb-0 text-white">{formatCurrency(metrics.total_revenue || 0)}</h1>
            <small className="opacity-80">Accumulated pass subscriptions and renewal fees.</small>
          </div>
          <div className="p-3 bg-white text-primary rounded-circle shadow">
            <FaMoneyBillWave size={40} />
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="app-card p-4 h-100 shadow-sm">
            <h5 className="font-heading fw-bold text-dark mb-3">Applications Trend by Month</h5>
            <MonthlyApplicationsChart data={charts.applications_by_month} />
          </div>
        </div>

        <div className="col-lg-4">
          <div className="app-card p-4 h-100 shadow-sm">
            <h5 className="font-heading fw-bold text-dark mb-3">Applications Status Distribution</h5>
            <StatusDistributionChart data={charts.applications_by_status} />
          </div>
        </div>

        <div className="col-lg-12">
          <div className="app-card p-4 shadow-sm">
            <h5 className="font-heading fw-bold text-dark mb-3">Revenue Collection Trend (₹)</h5>
            <MonthlyRevenueChart data={charts.revenue_by_month} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

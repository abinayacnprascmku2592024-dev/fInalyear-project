import React, { useState, useEffect } from 'react';
import { FaPrint, FaDownload, FaChartBar, FaFileAlt } from 'react-icons/fa';
import { dashboardService } from '../../services/dashboardService';
import { applicationService } from '../../services/applicationService';
import { passService } from '../../services/passService';
import { formatDate, formatCurrency } from '../../utils/formatters';

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [recentPasses, setRecentPasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const [dashRes, appRes, passRes] = await Promise.all([
        dashboardService.getStats(),
        applicationService.getAll({ page_size: 15 }),
        passService.getAll({ page_size: 15 })
      ]);
      setStats(dashRes.data.data?.metrics || {});
      setRecentApps(appRes.data.results || appRes.data || []);
      setRecentPasses(passRes.data.results || passRes.data || []);
    } catch (err) {
      console.error('Error fetching report data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="printable-area">
      <div className="d-flex justify-content-between align-items-center mb-4 no-print">
        <div>
          <h3 className="font-heading fw-bold text-dark mb-1">Transit System Reports & Analytics</h3>
          <p className="text-muted small mb-0">Generate audit logs, revenue statistics, and pass issuance summaries.</p>
        </div>
        <button className="btn btn-primary-custom d-flex align-items-center gap-2" onClick={handlePrint}>
          <FaPrint /> Print Official Report
        </button>
      </div>

      {/* Header for Printed Document */}
      <div className="d-none d-print-block mb-4 text-center border-bottom pb-3">
        <h2 className="font-heading fw-bold">ONLINE BUS PASS MANAGEMENT SYSTEM</h2>
        <h5 className="text-muted">Official Department Audit & System Report</h5>
        <small className="text-secondary">Generated on: {new Date().toLocaleString()}</small>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="app-card p-3 border-start border-4 border-primary">
            <small className="text-muted text-uppercase fw-bold">Total Applications</small>
            <h3 className="font-heading fw-bold my-1">{stats?.total_applications || 0}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="app-card p-3 border-start border-4 border-success">
            <small className="text-muted text-uppercase fw-bold">Issued Passes</small>
            <h3 className="font-heading fw-bold my-1">{stats?.issued_passes || 0}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="app-card p-3 border-start border-4 border-warning">
            <small className="text-muted text-uppercase fw-bold">Pending Review</small>
            <h3 className="font-heading fw-bold my-1">{stats?.pending_applications || 0}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="app-card p-3 border-start border-4 border-info">
            <small className="text-muted text-uppercase fw-bold">Total Revenue</small>
            <h3 className="font-heading fw-bold my-1 text-primary">{formatCurrency(stats?.total_revenue || 0)}</h3>
          </div>
        </div>
      </div>

      {/* Recent Applications Audit Table */}
      <div className="app-card shadow-sm p-4 mb-4">
        <h5 className="font-heading fw-bold text-dark mb-3 d-flex align-items-center gap-2">
          <FaFileAlt className="text-primary" /> Application Audit Log
        </h5>
        <div className="table-responsive">
          <table className="table table-sm table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>App ID</th>
                <th>Applicant Name</th>
                <th>Pass Type</th>
                <th>Route</th>
                <th>Status</th>
                <th>Submitted Date</th>
              </tr>
            </thead>
            <tbody>
              {recentApps.map(a => (
                <tr key={a.id}>
                  <td className="font-mono fw-bold">{a.application_id}</td>
                  <td>{a.applicant?.name}</td>
                  <td>{a.pass_type?.name}</td>
                  <td>{a.route?.route_number}</td>
                  <td><span className="badge bg-secondary">{a.status}</span></td>
                  <td>{formatDate(a.application_date || a.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Passes Audit Table */}
      <div className="app-card shadow-sm p-4">
        <h5 className="font-heading fw-bold text-dark mb-3 d-flex align-items-center gap-2">
          <FaChartBar className="text-success" /> Active Bus Pass Registry
        </h5>
        <div className="table-responsive">
          <table className="table table-sm table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>Pass Number</th>
                <th>Commuter</th>
                <th>Route</th>
                <th>Issue Date</th>
                <th>Expiry Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPasses.map(p => (
                <tr key={p.id}>
                  <td className="font-mono fw-bold text-primary">{p.pass_number}</td>
                  <td>{p.application?.applicant?.name}</td>
                  <td>{p.route?.route_number}</td>
                  <td>{formatDate(p.issue_date)}</td>
                  <td>{formatDate(p.expiry_date)}</td>
                  <td><span className="badge bg-success">{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;

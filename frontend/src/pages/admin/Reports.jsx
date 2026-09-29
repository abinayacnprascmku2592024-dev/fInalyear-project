import React, { useState, useEffect } from 'react';
import { BarChart3, Download, FileText, Calendar, Filter } from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import { formatCurrency } from '../../utils/helpers';
import LoadingSpinner from '../../components/LoadingSpinner';

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardService.getStats();
        setData(res.data?.data || null);
      } catch (err) {
        console.error('Failed to load report data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExportCSV = () => {
    alert('Exporting system reports data to CSV...');
  };

  if (loading) return <LoadingSpinner text="Generating system reports..." />;

  const { summary } = data || {};

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">System Reports & Financial Summaries</h3>
          <p className="text-muted mb-0">Generate, view, and export operational summaries and revenue reports.</p>
        </div>
        <button className="btn btn-outline-primary rounded-pill px-4 d-flex align-items-center gap-2" onClick={handleExportCSV}>
          <Download size={18} />
          <span>Export Summary CSV</span>
        </button>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="custom-card p-4 text-center">
            <h6 className="text-muted text-uppercase mb-2 fs-7 fw-bold">Total Application Volume</h6>
            <h2 className="fw-extrabold text-primary mb-0">{summary?.total_applications || 0}</h2>
            <small className="text-muted">Applications cataloged to date</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="custom-card p-4 text-center">
            <h6 className="text-muted text-uppercase mb-2 fs-7 fw-bold">Issued Digital Passes</h6>
            <h2 className="fw-extrabold text-success mb-0">{summary?.issued_passes || 0}</h2>
            <small className="text-muted">Active and expired pass cards</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="custom-card p-4 text-center">
            <h6 className="text-muted text-uppercase mb-2 fs-7 fw-bold">System Gross Revenue</h6>
            <h2 className="fw-extrabold text-warning mb-0">{formatCurrency(summary?.total_revenue || 0)}</h2>
            <small className="text-muted">Pass sales + Renewal receipts</small>
          </div>
        </div>
      </div>

      <div className="custom-card p-4 shadow-sm">
        <h5 className="fw-bold text-dark mb-3">System Report Status Audit</h5>
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Metric Area</th>
              <th>Count</th>
              <th>Percentage / Breakdown</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total Applications Submitted</td>
              <td><strong>{summary?.total_applications}</strong></td>
              <td>100% Total Volume</td>
            </tr>
            <tr>
              <td>Pending Applications</td>
              <td><strong>{summary?.pending_applications}</strong></td>
              <td>{Math.round(((summary?.pending_applications || 0) / (summary?.total_applications || 1)) * 100)}% of total</td>
            </tr>
            <tr>
              <td>Approved Applications</td>
              <td><strong>{summary?.approved_applications}</strong></td>
              <td>{Math.round(((summary?.approved_applications || 0) / (summary?.total_applications || 1)) * 100)}% of total</td>
            </tr>
            <tr>
              <td>Active Commuter Passes</td>
              <td><strong className="text-success">{summary?.active_passes}</strong></td>
              <td>Currently Valid Passes</td>
            </tr>
            <tr>
              <td>Expired Commuter Passes</td>
              <td><strong className="text-danger">{summary?.expired_passes}</strong></td>
              <td>Expired Validity Passes</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;

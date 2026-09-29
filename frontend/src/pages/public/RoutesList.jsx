import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaRoute, FaMapMarkerAlt, FaSearch, FaClock, FaRulerHorizontal } from 'react-icons/fa';
import { routeService } from '../../services/routeService';

const RoutesList = () => {
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await routeService.getAll();
      setRoutes(res.data.results || res.data || []);
    } catch (err) {
      console.error('Error fetching routes:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoutes = routes.filter(r => 
    r.route_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.route_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.starting_point?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.destination?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-5">
      <div className="text-center max-w-2xl mx-auto mb-4">
        <span className="badge bg-primary-light text-primary font-heading fw-bold px-3 py-2 rounded-pill mb-2">
          Transit Network
        </span>
        <h2 className="font-heading fw-bold text-dark mb-1">Available Bus Routes</h2>
        <p className="text-muted">Browse all active city bus routes, distance, travel time, and stop sequences.</p>
      </div>

      {/* Search Filter */}
      <div className="app-card p-3 shadow-sm mb-4 max-w-2xl mx-auto">
        <div className="input-group">
          <span className="input-group-text bg-white text-muted border-end-0"><FaSearch /></span>
          <input 
            type="text" 
            className="form-control border-start-0 ps-0" 
            placeholder="Search by route number, name, origin, or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading routes...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {filteredRoutes.map((r) => (
            <div key={r.id} className="col-md-6">
              <div className="app-card p-4 h-100 shadow-sm border-0 position-relative">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge bg-dark font-mono fs-6 px-3 py-2">{r.route_number}</span>
                  <span className="badge bg-success-light text-success font-heading fw-bold">{r.status}</span>
                </div>

                <h4 className="font-heading fw-bold text-primary mb-2">{r.route_name}</h4>

                <div className="bg-light p-3 rounded-3 mb-3 border">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div>
                      <small className="text-muted d-block">Origin</small>
                      <strong className="text-dark">{r.starting_point}</strong>
                    </div>
                    <div className="text-muted font-mono px-2">&rarr;</div>
                    <div className="text-end">
                      <small className="text-muted d-block">Destination</small>
                      <strong className="text-dark">{r.destination}</strong>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between border-top pt-2 mt-2 small text-secondary">
                    <span className="d-flex align-items-center gap-1">
                      <FaRulerHorizontal className="text-primary" /> Distance: <strong>{r.distance}</strong>
                    </span>
                    <span className="d-flex align-items-center gap-1">
                      <FaClock className="text-warning" /> Est. Time: <strong>{r.estimated_time}</strong>
                    </span>
                  </div>
                </div>

                {/* Stops Preview */}
                {r.stops && r.stops.length > 0 && (
                  <div className="mb-3">
                    <small className="text-muted font-heading fw-bold d-block mb-2">
                      <FaMapMarkerAlt className="text-danger me-1" /> Route Stops ({r.stops.length}):
                    </small>
                    <div className="d-flex flex-wrap gap-1">
                      {r.stops.map((st, idx) => (
                        <span key={st.id} className="badge bg-secondary-subtle text-secondary border font-normal">
                          {idx + 1}. {st.stop_name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-2 border-top">
                  <Link to={`/apply?route=${r.id}`} className="btn btn-outline-custom w-100 btn-sm text-center">
                    Apply Pass For This Route &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoutesList;

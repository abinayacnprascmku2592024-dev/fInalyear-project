import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Navigation, ChevronDown, ChevronUp } from 'lucide-react';
import { routeService } from '../services/routeService';
import LoadingSpinner from '../components/LoadingSpinner';

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedRouteId, setExpandedRouteId] = useState(null);

  const fetchRoutes = async (query = '') => {
    setLoading(true);
    try {
      const res = await routeService.getAllRoutes({ search: query, status: 'Active' });
      setRoutes(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load routes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRoutes(search);
  };

  const toggleExpand = (id) => {
    setExpandedRouteId(expandedRouteId === id ? null : id);
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-dark">Available Bus Routes</h2>
        <p className="text-muted">Explore transit networks, distance, travel duration, and route stops.</p>
      </div>

      {/* Search Filter */}
      <div className="custom-card p-3 mb-4 shadow-sm max-w-700 mx-auto">
        <form onSubmit={handleSearch} className="d-flex gap-2">
          <div className="input-group">
            <span className="input-group-text bg-light text-muted border-end-0">
              <Search size={18} />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search by route number, starting point or destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary px-4 fw-semibold rounded-3">Search</button>
        </form>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading bus routes..." />
      ) : (
        <div className="row g-4">
          {routes.length === 0 ? (
            <div className="col-12 text-center py-5 text-muted">No bus routes found.</div>
          ) : (
            routes.map((route) => {
              const isExpanded = expandedRouteId === route.id;
              return (
                <div key={route.id} className="col-12">
                  <div className="custom-card p-4">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="badge bg-primary fs-7 font-monospace">Route #{route.route_number}</span>
                          <span className="badge bg-success bg-opacity-10 text-success px-2 py-1 fs-8">{route.status}</span>
                        </div>
                        <h4 className="fw-bold text-dark mb-1">{route.route_name}</h4>
                        <div className="d-flex align-items-center gap-2 text-muted small mt-2">
                          <MapPin size={16} className="text-danger" />
                          <strong className="text-dark">{route.starting_point}</strong>
                          <span className="text-primary fw-bold">➔</span>
                          <MapPin size={16} className="text-success" />
                          <strong className="text-dark">{route.destination}</strong>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-4">
                        <div className="text-md-end small">
                          <div className="text-muted d-flex align-items-center gap-1 justify-content-md-end">
                            <Navigation size={14} /> {route.distance} km
                          </div>
                          <div className="text-muted d-flex align-items-center gap-1 justify-content-md-end">
                            <Clock size={14} /> {route.estimated_time}
                          </div>
                        </div>

                        <button
                          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 rounded-pill"
                          onClick={() => toggleExpand(route.id)}
                        >
                          <span>{isExpanded ? 'Hide Stops' : 'View Stops'}</span>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Stops List */}
                    {isExpanded && (
                      <div className="mt-4 pt-3 border-top">
                        <h6 className="fw-bold text-secondary mb-3">Bus Stops along this Route:</h6>
                        {route.stops && route.stops.length > 0 ? (
                          <div className="row g-2">
                            {route.stops.map((stop) => (
                              <div key={stop.id} className="col-md-4">
                                <div className="bg-light p-2 rounded-2 border d-flex align-items-center gap-2 small">
                                  <span className="badge bg-secondary rounded-circle">{stop.sequence_number}</span>
                                  <div>
                                    <strong className="d-block text-dark">{stop.stop_name}</strong>
                                    <small className="text-muted fs-8">{stop.location}</small>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted small">No specific stops cataloged for this route yet.</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default RoutesPage;

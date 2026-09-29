import React from 'react';

const Modal = ({ isOpen, onClose, title, children, footerButtons }) => {
  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 16, overflow: 'hidden' }}>
          <div className="modal-header bg-dark text-white px-4 py-3 border-0">
            <h5 className="modal-title font-heading fw-bold">{title}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body p-4">
            {children}
          </div>
          {footerButtons && (
            <div className="modal-footer bg-light px-4 py-3 border-top-0">
              {footerButtons}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;

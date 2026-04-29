import "../cssmodule/Modal.css";

function DeleteModal({ product, onClose, onConfirm }) {

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Delete Product</h3>
          <button className="modal-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <p className="delete-confirm-text">
            Are you sure you really want to delete this Product
            <br />
            “ <strong>{product?.name}</strong> ” ?
          </p>
          <div className="delete-modal-footer">
            <button className="btn-delete-confirm" onClick={() => onConfirm(product._id)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;

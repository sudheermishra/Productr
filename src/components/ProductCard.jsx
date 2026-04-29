import { useState } from "react";
import "../cssmodule/Products.css";


function ProductCard({ product, onEdit, onDelete, onToggleStatus }) {
  const [activeImage, setActiveImage] = useState(0);
  const images = product.images && product.images.length > 0 ? product.images : [];
  const isPublished = product.status === "Published";
  const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5100/api").replace("/api", "");

  const getImageSrc = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${API_BASE}${img}`;
  };

  return (
    <div className="product-card">
      {/* Image */}
      <div className="product-card-image">
        {images.length > 0 ? (
          <img
            src={getImageSrc(images[activeImage])}
            alt={product.name}
            onError={(e) => { e.target.src = "https://via.placeholder.com/280x200?text=No+Image"; }}
          />
        ) : (
          <img src="https://via.placeholder.com/280x200?text=No+Image" alt="No image" />
        )}
        {images.length > 1 && (
          <div className="carousel-dots">
            {images.map((_, i) => (
              <span
                key={i}
                className={`carousel-dot ${i === activeImage ? "active" : ""}`}
                onClick={() => setActiveImage(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="product-card-details">
        <div className="product-card-name">{product.name}</div>
        <div className="product-card-info">
          <div className="info-row">
            <span className="info-label">Product type -</span>
            <span className="info-value">{product.type}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Quantity Stock -</span>
            <span className="info-value">{product.quantityStock}</span>
          </div>
          <div className="info-row">
            <span className="info-label">MRP-</span>
            <span className="info-value">₹ {product.mrp}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Selling Price -</span>
            <span className="info-value">₹ {product.sellingPrice}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Brand Name -</span>
            <span className="info-value">{product.brand}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Total Number of Images -</span>
            <span className="info-value">{images.length}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Exchange Eligibility -</span>
            <span className="info-value">{product.isEligibleForReturn ? "YES" : "NO"}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="product-card-actions">
        {isPublished ? (
          <button className="card-btn card-btn-unpublish" onClick={() => onToggleStatus(product._id, "Unpublished")}>
            Unpublish
          </button>
        ) : (
          <button className="card-btn card-btn-publish" onClick={() => onToggleStatus(product._id, "Published")}>
            Publish
          </button>
        )}
        <button className="card-btn card-btn-edit" onClick={() => onEdit(product)}>
          Edit
        </button>
        <button className="card-btn-delete" onClick={() => onDelete(product)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ProductCard;

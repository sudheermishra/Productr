import { useState, useCallback } from "react";
import { useLoaderData, useRevalidator } from "react-router-dom";
import { fetchProducts, updateProduct } from "../api/services";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import Toast from "../components/Toast";
import "../cssmodule/Products.css";
import "../cssmodule/Misc.css";


// React Router loader function
export async function homeLoader() {
  try {
    const res = await fetchProducts();
    return { products: res.data.products, error: null };
  } catch {
    return { products: [], error: null };
  }
}

function Home() {
  const { products } = useLoaderData();
  const revalidator = useRevalidator();
  const [activeTab, setActiveTab] = useState("Published");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const filteredProducts = products.filter((p) => p.status === activeTab);

  const handleToggleStatus = async (id, newStatus) => {
    try {
      await updateProduct(id, { status: newStatus });
      showToast(`Product ${newStatus.toLowerCase()} successfully`);
      revalidator.revalidate();
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const handleSave = async (data) => {
    try {
      await updateProduct(editProduct._id, data);
      showToast("Product updated successfully");
      setShowModal(false);
      setEditProduct(null);
      revalidator.revalidate();
    } catch {
      showToast("Failed to update product", "error");
    }
  };

  return (
    <div className="page-content">
      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === "Published" ? "active" : ""}`} onClick={() => setActiveTab("Published")}>
          Published
        </button>
        <button className={`tab ${activeTab === "Unpublished" ? "active" : ""}`} onClick={() => setActiveTab("Unpublished")}>
          Unpublished
        </button>
      </div>

      {/* Cards */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Corrected Spacing Rounded Squares */}
              <rect x="15" y="15" width="28" height="28" rx="6" stroke="#071074" strokeWidth="6.25" strokeLinejoin="round" />
              <rect x="57" y="15" width="28" height="28" rx="6" stroke="#071074" strokeWidth="6.25" strokeLinejoin="round" />
              <rect x="15" y="57" width="28" height="28" rx="6" stroke="#071074" strokeWidth="6.25" strokeLinejoin="round" />
              {/* Corrected Plus Symbol */}
              <path d="M71 57V85" stroke="#071074" strokeWidth="6.25" strokeLinecap="round" />
              <path d="M57 71H85" stroke="#071074" strokeWidth="6.25" strokeLinecap="round" />
            </svg>
          </div>
          <div className="empty-state-text-container">
            <h2>No {activeTab} Products</h2>
            <p>Your {activeTab} Products will appear here{"\n"}Create your first product to publish</p>
          </div>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={handleEdit}
              onDelete={() => {}}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      {showModal && (
        <ProductModal
          product={editProduct}
          onClose={() => { setShowModal(false); setEditProduct(null); }}
          onSave={handleSave}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default Home;

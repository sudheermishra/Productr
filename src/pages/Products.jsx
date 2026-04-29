import { useState, useCallback } from "react";
import { useLoaderData, useRevalidator } from "react-router-dom";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../api/services";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import DeleteModal from "../components/DeleteModal";
import Toast from "../components/Toast";
import "../cssmodule/Products.css";
import "../cssmodule/Misc.css";
import "../cssmodule/Common.css";



// React Router loader function
export async function productsLoader() {
  try {
    const res = await fetchProducts();
    return { products: res.data.products, error: null };
  } catch (err) {
    return { products: [], error: err.response?.data?.message || "Failed to load products" };
  }
}

function Products() {
  const { products, error } = useLoaderData();
  const revalidator = useRevalidator();
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const handleSave = async (data) => {
    try {
      if (editProduct) {
        await updateProduct(editProduct._id, data);
        showToast("Product updated successfully");
      } else {
        await createProduct(data);
        showToast("Product added Successfully");
      }
      setShowModal(false);
      setEditProduct(null);
      revalidator.revalidate();
    } catch (err) {
      showToast(err.response?.data?.message || "Something went wrong", "error");
    }
  };

  const handleDeleteConfirm = async (id) => {
    try {
      await deleteProduct(id);
      showToast("Product deleted successfully");
      setDeleteTarget(null);
      revalidator.revalidate();
    } catch {
      showToast("Failed to delete product", "error");
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const handleToggleStatus = async (id, newStatus) => {
    try {
      await updateProduct(id, { status: newStatus });
      showToast(`Product ${newStatus.toLowerCase()} successfully`);
      revalidator.revalidate();
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div className="products-header">
        <h2>Products</h2>
        {products.length > 0 && (
          <button className="add-product-btn" onClick={() => { setEditProduct(null); setShowModal(true); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Products
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Cards */}
      {products.length === 0 ? (
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
            <h2>Feels a little empty over here...</h2>
            <p>You can create products without connecting store{"\n"}you can add products to store anytime</p>
          </div>
          <button className="empty-state-add-btn" onClick={() => { setEditProduct(null); setShowModal(true); }}>
            Add your Products
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={handleEdit}
              onDelete={setDeleteTarget}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <ProductModal
          product={editProduct}
          onClose={() => { setShowModal(false); setEditProduct(null); }}
          onSave={handleSave}
        />
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          product={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default Products;

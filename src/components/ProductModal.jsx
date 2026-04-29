import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../cssmodule/Modal.css";
import "../cssmodule/Common.css";


const PRODUCT_TYPES = ["Foods", "Electronics", "Clothes", "Beauty Products", "Others"];
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5100/api").replace("/api", "");

const emptyForm = {
  name: "",
  type: "Foods",
  quantityStock: "",
  mrp: "",
  sellingPrice: "",
  brand: "",
  isEligibleForReturn: false,
  status: "Unpublished",
};

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);
  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        type: product.type || "Foods",
        quantityStock: product.quantityStock ?? "",
        mrp: product.mrp ?? "",
        sellingPrice: product.sellingPrice ?? "",
        brand: product.brand || "",
        isEligibleForReturn: product.isEligibleForReturn || false,
        status: product.status || "Unpublished",
      });
      setExistingImages(product.images || []);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setNewImageFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNewImagePreviews((prev) => [...prev, ev.target.result]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const getImageSrc = (img) => {
    if (!img) return "";
    if (img.startsWith("http") || img.startsWith("data:")) return img;
    return `${API_BASE}${img}`;
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Please enter product name";
    if (!form.type) newErrors.type = "Please select product type";
    if (form.quantityStock === "" || form.quantityStock === null) newErrors.quantityStock = "Please enter quantity";
    if (!form.mrp) newErrors.mrp = "Please enter MRP";
    if (!form.sellingPrice) newErrors.sellingPrice = "Please enter selling price";
    if (!form.brand.trim()) newErrors.brand = "Please enter brand name";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      let uploadedUrls = [];

      // Upload new files
      if (newImageFiles.length > 0) {
        const formData = new FormData();
        newImageFiles.forEach((file) => formData.append("images", file));

        const uploadRes = await axios.post(`${API_BASE}/api/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (uploadRes.data.success) {
          uploadedUrls = uploadRes.data.urls;
        }
      }

      const data = {
        ...form,
        quantityStock: Number(form.quantityStock),
        mrp: Number(form.mrp),
        sellingPrice: Number(form.sellingPrice),
        images: [...existingImages, ...uploadedUrls],
      };

      await onSave(data);
    } catch (err) {
      setErrors({ server: err.response?.data?.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{product ? "Edit Product" : "Add a Product"}</h3>
          <button className="modal-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errors.server && <div className="alert alert-error">{errors.server}</div>}

            <div className="form-group">
              <label>Product Name</label>
              <input 
                type="text" 
                name="name" 
                className={errors.name ? "input-error" : ""}
                placeholder="e.g. CakeZone Walnut Brownie" 
                value={form.name} 
                onChange={handleChange} 
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Product Type</label>
              <select 
                name="type" 
                className={errors.type ? "input-error" : ""}
                value={form.type} 
                onChange={handleChange}
              >
                {PRODUCT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.type && <span className="field-error">{errors.type}</span>}
            </div>

            <div className="form-group">
              <label>Quantity Stock</label>
              <input 
                type="number" 
                name="quantityStock" 
                className={errors.quantityStock ? "input-error" : ""}
                placeholder="0" 
                value={form.quantityStock} 
                onChange={handleChange} 
                min="0" 
              />
              {errors.quantityStock && <span className="field-error">{errors.quantityStock}</span>}
            </div>

            <div className="form-group">
              <label>MRP</label>
              <input 
                type="number" 
                name="mrp" 
                className={errors.mrp ? "input-error" : ""}
                placeholder="Total numbers of Stock available" 
                value={form.mrp} 
                onChange={handleChange} 
                min="0" 
              />
              {errors.mrp && <span className="field-error">{errors.mrp}</span>}
            </div>

            <div className="form-group">
              <label>Selling Price</label>
              <input 
                type="number" 
                name="sellingPrice" 
                className={errors.sellingPrice ? "input-error" : ""}
                placeholder="Total numbers of Stock available" 
                value={form.sellingPrice} 
                onChange={handleChange} 
                min="0" 
              />
              {errors.sellingPrice && <span className="field-error">{errors.sellingPrice}</span>}
            </div>

            <div className="form-group">
              <label>Brand Name</label>
              <input 
                type="text" 
                name="brand" 
                className={errors.brand ? "input-error" : ""}
                placeholder="Total numbers of Stock available" 
                value={form.brand} 
                onChange={handleChange} 
              />
              {errors.brand && <span className="field-error">{errors.brand}</span>}
            </div>

            {/* Image Upload */}
            <div className="upload-section">
              <div className="upload-section-header">
                <label>Upload Product Images</label>
                {(existingImages.length > 0 || newImagePreviews.length > 0) && (
                  <button type="button" onClick={() => fileInputRef.current?.click()}>Add More Photos</button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden-file-input"
                onChange={handleFileSelect}
              />

              {existingImages.length === 0 && newImagePreviews.length === 0 ? (
                <div className="upload-placeholder" onClick={() => fileInputRef.current?.click()}>
                  <span>Enter Description</span>
                  <strong>Browse</strong>
                </div>
              ) : (
                <div className="upload-previews">
                  {existingImages.map((img, i) => (
                    <div key={`existing-${i}`} className="upload-preview">
                      <img src={getImageSrc(img)} alt="" />
                      <button type="button" className="upload-preview-remove" onClick={() => removeExistingImage(i)}>×</button>
                    </div>
                  ))}
                  {newImagePreviews.map((preview, i) => (
                    <div key={`new-${i}`} className="upload-preview">
                      <img src={preview} alt="" />
                      <button type="button" className="upload-preview-remove" onClick={() => removeNewImage(i)}>×</button>
                    </div>
                  ))}
                  <button type="button" className="upload-add-btn" onClick={() => fileInputRef.current?.click()}>+</button>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Exchange or return eligibility</label>
              <select name="isEligibleForReturn" value={form.isEligibleForReturn ? "Yes" : "No"} onChange={(e) => setForm((prev) => ({ ...prev, isEligibleForReturn: e.target.value === "Yes" }))}>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          <div className="modal-footer-single">
            <button type="submit" className="btn-update" disabled={loading}>
              {loading ? "Saving..." : product ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;

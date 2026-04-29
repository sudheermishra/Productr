import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../api/services";
import "../cssmodule/Auth.css";
import "../cssmodule/Common.css";
import "../cssmodule/Responsive.css";
import backImg from "../assets/back.png";
import frontImg from "../assets/front.jpg";
import logoVector from "../assets/Vector.png";

function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.name) {
      setError("Name and email are required");
      return;
    }

    setLoading(true);
    try {
      const res = await signupUser(form);
      if (res.data.success) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side: Poster */}
        <div className="auth-left">
          <div className="poster-bg">
            <img src={backImg} alt="" className="poster-back-image" />

            <div className="poster-logo">
              <span>Productr</span>
              <img src={logoVector} alt="Logo" />
            </div>


            {/* Antigravity Inner Card */}
            <div className="inner-card" style={{ backgroundImage: `url(${frontImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="inner-content-text">

                Uplist your <br /> product to market
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="auth-right">
          <div className="auth-form-wrapper">
            <h2 className="auth-title">Create your Productr Account</h2>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
              <div className="form-group">
                <label htmlFor="signup-email">Email or Phone number</label>
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  placeholder="Enter email or phone number"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>

              <button type="submit" className="btn-auth-primary" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            <div className="auth-footer-card">
              Already have a Productr Account? <Link to="/login">Login Here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;

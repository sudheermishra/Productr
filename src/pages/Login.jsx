import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendOtp } from "../api/services";
import "../cssmodule/Auth.css";
import "../cssmodule/Common.css";
import "../cssmodule/Responsive.css";
import backImg from "../assets/back.png";
import frontImg from "../assets/front.jpg";
import logoVector from "../assets/Vector.png";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtp({ email });
      if (res.data.success) {
        sessionStorage.setItem("otp_email", email);
        navigate("/otp");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
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
            <h2 className="auth-title">Login to your Productr Account</h2>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email or Phone number</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email or phone number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <button type="submit" className="btn-auth-primary" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="auth-footer-card">
              Don’t have a Productr Account? <Link to="/signup">SignUp Here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

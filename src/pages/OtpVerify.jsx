import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp, sendOtp } from "../api/services";
import "../cssmodule/Auth.css";
import "../cssmodule/Common.css";
import backImg from "../assets/back.png";
import frontImg from "../assets/front.jpg";
import logoVector from "../assets/Vector.png";

function OtpVerify() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(20);
  const inputRefs = useRef([]);
  const verifiedRef = useRef(false); // prevents useEffect redirect after successful verify
  const email = sessionStorage.getItem("otp_email");

  useEffect(() => {
    if (!email && !verifiedRef.current) {
      navigate("/login");
      return;
    }
    inputRefs.current[0]?.focus();
  }, [email, navigate]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setResending(true);
    setError("");
    try {
      await sendOtp({ email });
      setSuccess("OTP resent successfully!");
      setTimer(20);
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await verifyOtp({ email, otp: code });
      if (res.data.success) {
        verifiedRef.current = true; // block the useEffect redirect
        localStorage.setItem("productr_token", res.data.token);
        localStorage.setItem("productr_user", JSON.stringify(res.data.user));
        sessionStorage.removeItem("otp_email");
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
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

            {success && <div className="alert alert-success">{success}</div>}



            <form onSubmit={handleVerify}>
              <div className="otp-form-group">
                <label className="otp-label">Enter OTP</label>
                <div className="otp-inputs">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputRefs.current[i] = el)}
                      type="text"
                      className={`otp-box ${error ? 'error' : ''}`}
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>
                {error && <div className="otp-error" style={{ marginTop: '8px' }}>{error}</div>}
              </div>


              <button type="submit" className="btn-auth-primary" disabled={loading}>
                {loading ? "Verifying..." : "Enter your OTP"}
              </button>
            </form>

            <div className="otp-resend-text">
              Didnt recive OTP ?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); handleResend(); }}>
                {timer > 0 ? `Resend in ${timer}s` : "Resend"}
              </a>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}

export default OtpVerify;

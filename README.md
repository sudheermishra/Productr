# Productr — Frontend

A product management dashboard built with **React + Vite**. It lets you add, edit, publish, and delete products through a clean and modern UI.

---

##  What This App Does

- **Login / Sign Up** using your email
- **OTP Verification** — a 6-digit code is sent to your email to confirm your identity (no password needed)
- **Dashboard** — view all your products in a grid layout
- **Add / Edit Products** — fill in product details and upload images
- **Publish / Unpublish** products with one click
- **Delete** products with a confirmation prompt
- **Protected Routes** — you can't access the dashboard without logging in, and you can't visit the login page again once you're already logged in

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Fast development server |
| React Router v6 | Page routing & navigation |
| Axios | API calls to the backend |
| CSS Modules | Scoped component styling |
| Inter (Google Font) | Typography |

---

##  Folder Structure

```
src/
│
├── api/
│   ├── axios.js          # Axios instance with auth token interceptor
│   └── services.js       # All API functions (login, products, etc.)
│
├── assets/               # Images and icons
│
├── components/
│   ├── GuestRoute.jsx    # Blocks logged-in users from seeing auth pages
│   ├── PrivateRoute.jsx  # Blocks logged-out users from seeing dashboard
│   ├── ProductCard.jsx   # Single product card in the grid
│   ├── ProductModal.jsx  # Add / Edit product form modal
│   ├── DeleteModal.jsx   # Delete confirmation popup
│   └── Toast.jsx         # Success / error notification
│
├── cssmodule/
│   ├── Auth.css          # Login, Signup, OTP page styles
│   ├── Dashboard.css     # Sidebar and header styles
│   ├── Modal.css         # Modal popup styles
│   ├── Misc.css          # Empty state styles
│   ├── Products.css      # Product card grid styles
│   ├── Toast.css         # Toast notification styles
│   └── Common.css        # Shared reusable styles
│
├── Layout/
│   └── DashboardLayout.jsx  # Sidebar + header wrapper for all dashboard pages
│
├── pages/
│   ├── Login.jsx         # Email entry → sends OTP
│   ├── SignUp.jsx        # New user registration
│   ├── OtpVerify.jsx     # 6-digit OTP input
│   ├── Home.jsx          # Dashboard home page
│   ├── Products.jsx      # Products list page
│   └── Logout.jsx        # Clears token and redirects to login
│
├── App.jsx               # Router setup with auth guards
├── main.jsx              # App entry point
└── index.css             # Global styles and CSS variables
```

---

##  Getting Started

### 1. Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org/) (v18 or above)
- npm (comes with Node.js)
- The **backend server** running on `http://localhost:5100`

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

The app will open at **http://localhost:5173** (or the next available port).

---

##  How Authentication Works

1. User enters their **email** on the Login page
2. Backend sends a **6-digit OTP** to that email
3. User enters the OTP on the Verify page
4. On success, a **token** is saved in `localStorage` (`productr_token`)
5. All future API requests automatically include this token via the Axios interceptor
6. On **Logout**, the token is removed and the user is sent back to the login page

### Route Protection

| Route | Who can access |
|---|---|
| `/login`, `/signup`, `/otp` | Only users who are **NOT** logged in |
| `/`, `/products`, `/logout` | Only users who **ARE** logged in |

If you're already logged in and try to visit `/login` — you'll be redirected to **Home**.  
If you're not logged in and try to visit `/products` — you'll be redirected to **Login**.

---

##  API Base URL

The frontend connects to the backend at:

```
http://localhost:5100/api
```

This is set in `src/api/axios.js`. If your backend runs on a different port, update it there.

---

##  Build for Production

```bash
npm run build
```

This creates an optimized `dist/` folder ready for deployment.

---

##  Notes for Developers

- **Token storage**: `localStorage` key is `productr_token`
- **User storage**: `localStorage` key is `productr_user` (JSON)
- **OTP email storage**: `sessionStorage` key is `otp_email` (cleared after verification)
- **Image uploads**: sent as `multipart/form-data` to `http://localhost:5100/api/upload`
- **Empty state**: shown on Products page when no products exist, with an "Add your Products" button

Elite Verse E-Commerce Platform
A full-stack ecommerce application featuring product management, shopping cart functionality, category filtering, and an admin dashboard built using React, PHP, MySQL, and Tailwind CSS.

---
## 📁 Complete File Structure

ecommerce/
│
├── 📄 database.sql                    ← Import into phpMyAdmin first
├── 📄 README.md
│
├── 📂 backend/
│   ├── 📂 config/
│   │   ├── database.php               ← DB connection + helper functions
│   │   ├── jwt.php                    ← JWT auth (generate/verify)
│   │   └── cors.php                   ← CORS headers for all API files
│   │
│   └── 📂 api/
│       ├── 📂 auth/
│       │   ├── login.php              ← POST: login → returns JWT
│       │   ├── register.php           ← POST: register new customer
│       │   └── profile.php            ← GET/PUT: view/update profile
│       │
│       ├── 📂 products/
│       │   ├── get_all.php            ← GET: list products (search, filter, paginate)
│       │   ├── get_single.php         ← GET: single product with reviews + related
│       │   ├── manage.php             ← GET/POST/PUT/DELETE: admin CRUD
│       │   └── review.php             ← POST: submit product review
│       │
│       ├── 📂 categories/
│       │   └── index.php              ← GET/POST/DELETE: categories
│       │
│       ├── 📂 cart/
│       │   └── index.php              ← GET/POST/PUT/DELETE: cart management
│       │
│       ├── 📂 orders/
│       │   ├── index.php              ← GET/POST/PUT: place & manage orders
│       │   └── wishlist.php           ← GET/POST/DELETE: wishlist
│       │
│       └── 📂 admin/
│           └── dashboard.php          ← GET: stats, charts, recent orders
│
└── 📂 frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    │
    └── 📂 src/
        ├── main.jsx                   ← ReactDOM render entry
        ├── App.jsx                    ← All routes defined here
        ├── index.css                  ← Tailwind + custom styles
        │
        ├── 📂 context/
        │   ├── AuthContext.jsx        ← Global auth state (user, login, logout)
        │   └── CartContext.jsx        ← Global cart state + API calls
        │
        ├── 📂 utils/
        │   ├── api.js                 ← Axios instance with JWT interceptor
        │   └── helpers.js             ← formatPrice, discount, truncate, etc.
        │
        ├── 📂 components/
        │   ├── 📂 layout/
        │   │   ├── Navbar.jsx         ← Responsive navbar with cart count badge
        │   │   ├── Footer.jsx         ← Site footer with links
        │   │   └── AdminSidebar.jsx   ← Admin panel sidebar navigation
        │   └── 📂 common/
        │       ├── ProductCard.jsx    ← Reusable product card with hover effects
        │       ├── StarRating.jsx     ← Interactive star rating component
        │       └── ProtectedRoute.jsx ← Route guard for auth + role
        │
        └── 📂 pages/
            ├── Home.jsx               ← Hero, categories, featured products
            ├── Products.jsx           ← Product listing with filters + search
            ├── ProductDetail.jsx      ← Full product page with reviews
            ├── Cart.jsx               ← Shopping cart with qty controls
            ├── Checkout.jsx           ← Checkout form + order placement
            ├── Orders.jsx             ← Customer order history
            ├── Wishlist.jsx           ← Saved products
            ├── Login.jsx              ← Login form
            ├── Register.jsx           ← Registration form
            ├── Profile.jsx            ← User profile settings
            └── 📂 admin/
                ├── Dashboard.jsx      ← Stats cards + Recharts graphs
                ├── AdminProducts.jsx  ← CRUD product management
                ├── AdminOrders.jsx    ← View & update all orders
                └── AdminCustomers.jsx ← View customers

---

## Setup in 3 Steps

### Step 1 — Database
1. Open **phpMyAdmin** (via XAMPP → http:8080//localhost/phpmyadmin)
2. Create database: `eliteverse_db`
3. Click **Import** → select `database.sql` → Click **Go** ✅

### Step 2 — Backend
1. Copy `ecommerce/` folder to `C:/xampp/htdocs/`
2. Edit `backend/config/database.php` if your MySQL credentials differ
3. Start XAMPP: Apache + MySQL ✅

### Step 3 — Frontend
```bash
cd ecommerce/frontend
npm install
npm run dev
```
Open **http://localhost:5173** 

---

##  Features

### Customer
- Browse products with search, filter by category, sort by price
- Product detail page with image, reviews, related products
- Add to cart with quantity control
- Wishlist (save for later)
- Checkout with address + payment method selection
- Order history with item breakdown
- User profile management
- Star rating & review system

###  Admin
- Dashboard: revenue charts, order stats, top products
- Full product CRUD (add/edit/delete with modal)
- Order management with status updates
- Customer listing

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, React Router v6         |
| State     | Context API (Auth + Cart)         |
| Styling   | Tailwind CSS                      |
| Charts    | Recharts                          |
| HTTP      | Axios                             |
| Backend   | PHP 8 (PDO)                       |
| Auth      | JWT (custom implementation)       |
| Database  | MySQL                             |
| Dev Server| XAMPP (Apache + MySQL)            |
| Bundler   | Vite                              |

---

##  Endpoints

| Method | Endpoint                        | Auth    | Description               |
|--------|---------------------------------|---------|---------------------------|
| POST   | /api/auth/login.php             | None    | Login                     |
| POST   | /api/auth/register.php          | None    | Register                  |
| GET    | /api/products/get_all.php       | None    | List products             |
| GET    | /api/products/get_single.php    | None    | Single product            |
| POST   | /api/products/manage.php        | Admin   | Add product               |
| PUT    | /api/products/manage.php        | Admin   | Edit product              |
| DELETE | /api/products/manage.php?id=1   | Admin   | Delete product            |
| GET    | /api/categories/index.php       | None    | List categories           |
| GET    | /api/cart/index.php             | Customer| View cart                 |
| POST   | /api/cart/index.php             | Customer| Add to cart               |
| PUT    | /api/cart/index.php             | Customer| Update quantity           |
| DELETE | /api/cart/index.php?id=1        | Customer| Remove from cart          |
| POST   | /api/orders/index.php           | Customer| Place order               |
| GET    | /api/orders/index.php           | Any     | List orders               |
| PUT    | /api/orders/index.php           | Admin   | Update order status       |
| POST   | /api/orders/wishlist.php        | Customer| Add to wishlist           |
| GET    | /api/admin/dashboard.php        | Admin   | Dashboard stats           |

---

## Author
Asmu
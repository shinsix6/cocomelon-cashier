# Cocomelon WEB — Frontend

Frontend lengkap untuk sistem Point of Sale **Cocomelon WEB**, dibangun berdasarkan dokumen SRS (IEEE 830) sesuai kebutuhan mata kuliah Pemrograman Berorientasi Platform.

Frontend ini **siap dihubungkan** ke Backend REST API (Express.js + MongoDB) — cukup jalankan backend di `http://localhost:5000` (atau ubah `VITE_API_URL`) dan seluruh fitur akan langsung memanggil endpoint sungguhan melalui Axios.

## Tech Stack

- React 19 (Vite)
- React Router DOM v7
- Axios (dengan interceptor Bearer Token)
- Tailwind CSS v4 (tema Emerald)
- React Hook Form (validasi form)
- React Icons (Heroicons v2)
- React Hot Toast
- Recharts (grafik dashboard & laporan)
- Context API (Auth, Product, Category, Transaction)

## Menjalankan Proyek

```bash
cd frontend
npm install
npm run dev
```

Buka `http://localhost:5173`.

Untuk build produksi:

```bash
npm run build
npm run preview
```

## Environment Variable

Salin `.env.example` menjadi `.env` lalu sesuaikan:

```
VITE_API_URL=http://localhost:5000/api
```

## Struktur Folder

```
src/
├── assets
├── components
│   ├── layout      -> Sidebar, Navbar, Breadcrumb, Footer
│   ├── ui           -> Button, Card, Badge, Input, EmptyState, dll
│   ├── tables       -> Pagination, RecentTransactionsList
│   ├── forms        -> ProductForm, CategoryForm
│   ├── charts       -> DailySalesChart, MonthlySalesChart, TopProductsChart
│   ├── modal        -> Modal, ConfirmDialog
│   └── loading      -> Spinner, Skeleton
├── pages
│   ├── auth         -> Login
│   ├── dashboard    -> Dashboard (Admin)
│   ├── products     -> Manajemen Produk (Admin)
│   ├── categories   -> Manajemen Kategori (Admin)
│   ├── cashier      -> Transaksi POS & Riwayat Transaksi (Admin + Kasir)
│   ├── reports      -> Laporan Penjualan (Admin)
│   ├── profile      -> Profil (semua role)
│   └── settings     -> Pengaturan toko & akun kasir (Admin)
├── services         -> axiosClient + authService, productService, categoryService,
│                        transactionService, reportService
├── hooks            -> useAuth, useProducts, useCategories, useTransactions,
│                        useDarkMode, useDebounce
├── context          -> AuthContext, ProductContext, CategoryContext, TransactionContext
├── routes           -> ProtectedRoute (auth + role guard), PublicRoute
├── utils            -> format.js, constants.js, navigation.js, cn.js
├── layouts          -> MainLayout (sidebar shell), AuthLayout (login shell)
└── App.jsx
```

## Role & Akses Halaman

| Role  | Akses Menu                                                                 |
|-------|------------------------------------------------------------------------------|
| Admin | Dashboard, Produk, Kategori, Laporan, Transaksi POS, Profil, Pengaturan       |
| Kasir | Transaksi POS, Riwayat Transaksi, Profil                                     |

`ProtectedRoute` akan mengarahkan pengguna ke `/login` jika token tidak ada, dan mengarahkan ke halaman default sesuai role jika mencoba mengakses halaman di luar hak aksesnya.

## Kontrak API yang Diharapkan Backend

Base URL: `VITE_API_URL` (default `http://localhost:5000/api`). Semua request terautentikasi otomatis mengirim header `Authorization: Bearer <token>`.

### Auth
- `POST /auth/login` → `{ email, password }` → respons **wajib** `{ token, user: { name, email, role: "admin" | "kasir", avatar? } }`
- `POST /auth/logout`
- `GET /auth/profile`
- `PUT /auth/profile`
- `PUT /auth/change-password` → `{ currentPassword, newPassword, confirmPassword }`
- `GET /auth/users` — daftar akun kasir (Admin)
- `POST /auth/users`, `PUT /auth/users/:id`, `DELETE /auth/users/:id`

### Produk
- `GET /products?search=&category=&page=&limit=&isActive=` → `{ items: [...], total, page }`
- `POST /products` (multipart/form-data jika ada file `image`)
- `PUT /products/:id`
- `DELETE /products/:id`

### Kategori
- `GET /categories?search=`
- `POST /categories`, `PUT /categories/:id`, `DELETE /categories/:id`

### Transaksi
- `GET /transactions?search=&page=&limit=&sort=`
- `POST /transactions` → body: `{ items: [{ product, name, price, qty }], subtotal, discount, tax, total, paymentMethod, cashReceived?, change?, customerName }`

### Laporan
- `GET /reports/dashboard` → `{ todaySales, todayRevenue, totalTransactions, totalProducts, totalCustomers, lowStockCount, dailySales: [{label, total}], monthlySales: [{label, total}] }`
- `GET /reports?period=daily|weekly|monthly|custom&from=&to=&search=&page=&limit=` → `{ totalRevenue, totalTransactions, averageOrder, newCustomers, trend: [{label, total}], topProducts: [{name, qty}], transactions: [...] }`
- `GET /reports/export/pdf` dan `GET /reports/export/excel` → mengembalikan file binary (blob)

## Catatan

- Backend **tidak** disertakan dalam scaffold frontend ini (lihat folder `../backend`), namun struktur endpoint di atas sudah konsisten dengan pemanggilan Axios pada seluruh halaman.
- Loading state (skeleton/spinner), empty state, dan error state (dengan tombol "Coba Lagi") sudah diimplementasikan di setiap halaman data sesuai kebutuhan SRS — jadi tampilan akan tetap rapi walau backend belum aktif.
- Dark mode tersimpan di `localStorage` dan dapat di-toggle dari Navbar.

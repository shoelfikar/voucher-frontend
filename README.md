# Voucher Management System - Frontend

Frontend application untuk Voucher Management System yang dibangun dengan React + TypeScript + Vite.

## Tech Stack

- **Framework**: React 19.2
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Yup
- **Icons**: Lucide React
- **CSV Parsing**: PapaParse

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── ui/              # Reusable UI components
│   ├── contexts/            # React contexts (Auth, etc.)
│   ├── lib/                 # Library configurations (axios, etc.)
│   ├── pages/               # Page components
│   ├── services/            # API services
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── .env.example             # Example environment variables
├── .env                     # Environment variables (local)
└── package.json
```

## Setup & Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` dengan konfigurasi yang sesuai:
   ```env
   VITE_API_URL=http://localhost:8080/api/v1
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

   Server akan berjalan di `http://localhost:5173`

## Available Scripts

```bash
npm run dev       # Run development server
npm run build     # Build for production
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

## API Integration

Frontend terintegrasi dengan backend API melalui Axios client yang dikonfigurasi di `src/lib/axios.ts`.

### Authentication

- **Login**: POST `/auth/login`
  - Request: `{ email: string, password: string }`
  - Response: `{ status: "success", data: { token: string, user: { email: string } } }`

### Axios Interceptors

- **Request Interceptor**: Otomatis menambahkan JWT token ke header `Authorization`
- **Response Interceptor**:
  - Menangani error 401 (Unauthorized) dengan redirect ke login
  - Mengekstrak error message dari response

### Protected Routes

Semua routes kecuali `/login` memerlukan autentikasi. Token JWT disimpan di `localStorage` dan dikirim dalam setiap request.

## Features

### UI Components

Aplikasi menyediakan 19+ reusable UI components di `src/components/ui/`:

1. **Button** - Primary, Secondary, Danger, Ghost variants
2. **Input** - Standard text input dengan validation
3. **Input with Icon** - Input field dengan left/right icons
4. **Breadcrumb** - Navigation breadcrumb
5. **Badge** - Status dan label indicators
6. **Avatar** - User profile pictures or initials
7. **Upload** - Drag and drop file upload
8. **Modal** - Popup dialog windows
9. **Dropdown Menu** - Action menu dengan icons
10. **Data Table** - Interactive table dengan search dan sort
11. **Card** - Container dengan title dan subtitle
12. **Dropdown** - Select/dropdown form control
13. **Checkbox** - Checkbox input
14. **Radio** - Radio button input
15. **Switch** - Toggle switch
16. **Pagination** - Page navigation
17. **Toast** - Notification messages
18. **Alert** - Important contextual messages
19. **Progress Bar** - Visual progress indicators
20. **Loading Spinner** - Loading animations (Spinner, Dots, Skeleton)
21. **Empty State** - Display when no data available

Lihat semua komponen di halaman `/components` (Components Showcase).

### Pages

- **Login** (`/login`) - User authentication
- **Voucher List** (`/vouchers`) - List semua vouchers dengan pagination, search, dan sort
- **Voucher Form** (`/vouchers/new`, `/vouchers/:id/edit`) - Create/Edit voucher
- **CSV Upload** (`/vouchers/upload`) - Bulk import vouchers dari CSV
- **Components** (`/components`) - Showcase semua UI components

## Authentication Flow

1. User login dengan email dan password
2. Backend mengembalikan JWT token
3. Token disimpan di localStorage
4. Setiap request ke protected endpoints menyertakan token di header
5. Jika token expired/invalid (401), user di-redirect ke login

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API base URL | http://localhost:8080/api/v1 |

## Build for Production

```bash
npm run build
```

Build output akan berada di folder `dist/`.

## Login Credentials

Aplikasi menggunakan dummy authentication di backend. Gunakan email dan password apapun (minimal 6 karakter):

```
Email: admin@example.com
Password: password123
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

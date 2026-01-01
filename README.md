# Voucher Management System - Frontend

Modern, responsive frontend application for the Voucher Management System built with React, TypeScript, and Vite.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Environment Variables](#environment-variables)
- [API Integration](#api-integration)
- [UI Components](#ui-components)
- [Authentication](#authentication)
- [Browser Support](#browser-support)

## Tech Stack

- **Framework**: React 19.2
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form
- **Validation**: Yup
- **Icons**: Lucide React
- **CSV Parsing**: PapaParse

## Features

### Core Features
- ✅ User authentication with JWT
- ✅ CRUD operations for vouchers
- ✅ CSV bulk upload and export
- ✅ Real-time search functionality
- ✅ Advanced filtering (by expiry date, discount percentage)
- ✅ Sorting (ascending/descending)
- ✅ Pagination with customizable items per page
- ✅ Form validation with Yup schema
- ✅ Toast notifications for user feedback
- ✅ Responsive design (mobile-first)
- ✅ Loading states and error handling
- ✅ Protected routes

### UI/UX Features
- 🎨 Modern, clean design with TailwindCSS
- 🌗 Consistent color scheme and spacing
- 📱 Mobile-responsive layout
- ⚡ Fast page transitions
- 🔔 Toast notifications with auto-close
- 📊 Data tables with search and sort
- 🎯 Intuitive navigation

## Project Structure

```
voucher-frontend/
├── public/
│   └── favicon.svg          # Application favicon
├── src/
│   ├── components/
│   │   └── ui/              # 20+ Reusable UI components
│   │       ├── Alert.tsx
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Checkbox.tsx
│   │       ├── DataTable.tsx
│   │       ├── Dropdown.tsx
│   │       ├── EmptyState.tsx
│   │       ├── Input.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── Modal.tsx
│   │       ├── Pagination.tsx
│   │       ├── ProgressBar.tsx
│   │       ├── Radio.tsx
│   │       ├── Switch.tsx
│   │       ├── Toast.tsx
│   │       └── Upload.tsx
│   ├── contexts/            # React Context providers
│   │   ├── AuthContext.tsx  # Authentication state
│   │   └── VoucherContext.tsx # Voucher state management
│   ├── lib/
│   │   └── axios.ts         # Axios configuration & interceptors
│   ├── pages/               # Page components
│   │   ├── ComponentsShowcase.tsx
│   │   ├── CSVUpload.tsx
│   │   ├── Login.tsx
│   │   ├── VoucherForm.tsx
│   │   └── VoucherList.tsx
│   ├── services/            # API service layer
│   │   ├── authService.ts
│   │   └── voucherService.ts
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── .env.example             # Environment variables template
├── Dockerfile               # Docker build configuration
├── nginx.conf               # Nginx server configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── package.json             # Dependencies and scripts
```

## Prerequisites

- **Node.js**: v20 or higher
- **npm**: v10 or higher (comes with Node.js)

## Installation

1. **Clone the repository** (if not already cloned):

```bash
git clone https://github.com/your-username/voucher-frontend.git
cd voucher-frontend
```

2. **Install dependencies**:

```bash
npm install
```

3. **Set up environment variables**:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

## Development

### Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

## Building for Production

### Local Build

```bash
npm run build
```

Build output will be in the `dist/` directory.

### Docker Build

```bash
docker build -t voucher-frontend:latest .
docker run -p 80:80 voucher-frontend:latest
```

The application will be served by Nginx on port 80.

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8080/api/v1` | Yes |

**Note**: Environment variables in Vite must be prefixed with `VITE_` to be exposed to the client.

## API Integration

The frontend integrates with the backend API through an Axios client configured in `src/lib/axios.ts`.

### Axios Configuration

- **Base URL**: Configured from `VITE_API_URL` environment variable
- **Timeout**: 10 seconds
- **Headers**: Automatically includes JWT token in `Authorization` header

### Request Interceptor

Automatically adds JWT token to all requests:

```typescript
Authorization: Bearer <token>
```

### Response Interceptor

- Handles 401 (Unauthorized) errors by redirecting to login
- Extracts error messages from API responses
- Provides consistent error handling

### API Endpoints

#### Authentication
- **POST** `/auth/login` - User login
- **POST** `/auth/register` - User registration

#### Vouchers
- **GET** `/vouchers` - Get all vouchers (with pagination, search, filter)
- **GET** `/vouchers/:id` - Get voucher by ID
- **POST** `/vouchers` - Create new voucher
- **PUT** `/vouchers/:id` - Update voucher
- **DELETE** `/vouchers/:id` - Delete voucher
- **POST** `/vouchers/upload` - Upload vouchers via CSV
- **GET** `/vouchers/export` - Export vouchers to CSV

## UI Components

The application includes 20+ reusable UI components in `src/components/ui/`:

### Form Components
1. **Button** - Multiple variants (primary, secondary, danger, ghost)
2. **Input** - Text input with validation support
3. **Checkbox** - Checkbox input
4. **Radio** - Radio button input
5. **Switch** - Toggle switch
6. **Dropdown** - Select dropdown

### Display Components
7. **Card** - Container with header and content
8. **Badge** - Status and label indicators
9. **Avatar** - User profile pictures or initials
10. **Alert** - Contextual alert messages
11. **Toast** - Notification messages with auto-close
12. **EmptyState** - Display when no data available

### Data Components
13. **DataTable** - Interactive table with search and sort
14. **Pagination** - Page navigation control

### Feedback Components
15. **LoadingSpinner** - Loading animations (Spinner, Dots, Skeleton)
16. **ProgressBar** - Visual progress indicators

### Overlay Components
17. **Modal** - Popup dialog windows
18. **DropdownMenu** - Action menu with icons

### Utility Components
19. **Breadcrumb** - Navigation breadcrumb
20. **Upload** - Drag and drop file upload

View all components at `/components` (Components Showcase page).

## Authentication

### Authentication Flow

1. User enters email and password on login page
2. Frontend sends POST request to `/api/auth/login`
3. Backend validates credentials and returns JWT token
4. Token is stored in `localStorage`
5. All subsequent requests include token in `Authorization` header
6. If token is invalid/expired (401 response), user is redirected to login

### Protected Routes

All routes except `/login` require authentication. The app uses React Router with protected route wrapper that:
- Checks for valid token in localStorage
- Redirects to login if no token found
- Validates token with backend on initial load

### Token Storage

```typescript
// Token is stored in localStorage
localStorage.setItem('token', token);

// Retrieved for authenticated requests
const token = localStorage.getItem('token');
```

## Pages

### 1. Login Page (`/login`)
- User authentication
- Email and password validation
- Error handling with user feedback
- Auto-redirect to vouchers list on success

### 2. Voucher List (`/vouchers`)
- Display all vouchers with pagination
- Real-time search by voucher code
- Advanced filtering:
  - Filter by expiry date
  - Filter by discount percentage
  - Sort ascending/descending
  - Multiple filters simultaneously
- Items per page selection (10, 25, 50, 100)
- Quick actions: Edit, Delete
- Bulk actions: CSV Export
- Toast notifications for actions

### 3. Voucher Form (`/vouchers/create`, `/vouchers/edit/:id`)
- Create new voucher
- Edit existing voucher
- Form validation with Yup:
  - Voucher code: Alphanumeric uppercase only
  - Discount: 1-100%
  - Expiry date: Must be today or future
- Auto-uppercase for voucher code
- Toast notification on success/error

### 4. CSV Upload (`/vouchers/upload`)
- Drag and drop CSV upload
- File validation (CSV only)
- Preview uploaded data
- Bulk import vouchers
- Error handling for invalid data
- Download sample CSV template

### 5. Components Showcase (`/components`)
- Interactive demonstration of all UI components
- Example usage and variants
- Useful for development and testing

## Form Validation

All forms use **React Hook Form** with **Yup** schema validation:

### Voucher Validation Rules

```typescript
{
  voucher_code: string (required, alphanumeric uppercase, max 50 chars)
  discount_percent: number (required, 1-100)
  expiry_date: date (required, today or future)
}
```

### Validation Features
- Real-time validation on blur
- Error messages display below fields
- Submit button disabled during validation
- Automatic error clearing on correction

## State Management

### Context API

The app uses React Context for global state:

#### AuthContext
- Current user data
- Authentication status
- Login/logout functions
- Token management

#### VoucherContext
- Voucher list data
- Loading states
- Error handling
- CRUD operations
- Pagination metadata

## Styling

### Tailwind CSS Configuration

Custom theme defined in `tailwind.config.js`:

```javascript
colors: {
  primary: '#2563EB',
  success: '#16A34A',
  error: '#DC2626',
  warning: '#D97706',
  // ... more colors
}
```

### Design System

- **Font**: System font stack
- **Spacing**: 4px base unit
- **Border Radius**: 8px default
- **Shadows**: Subtle elevation
- **Colors**: Blue primary, semantic status colors

## Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | Latest 2 versions |
| Firefox | Latest 2 versions |
| Safari | Latest 2 versions |
| Edge | Latest 2 versions |

**Note**: Internet Explorer is not supported.

## Performance

### Optimizations

- ✅ Code splitting with React Router
- ✅ Lazy loading for routes
- ✅ Debounced search (500ms)
- ✅ Memoized components where needed
- ✅ Optimized images and assets
- ✅ Minified production builds
- ✅ Gzip compression (Nginx)

### Bundle Size

- **Development**: ~2.5MB (uncompressed with source maps)
- **Production**: ~200KB (minified + gzipped)

## Testing

### Manual Testing Checklist

- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Create new voucher
- [ ] Edit existing voucher
- [ ] Delete voucher with confirmation
- [ ] Search vouchers
- [ ] Filter by expiry date
- [ ] Filter by discount percentage
- [ ] Pagination navigation
- [ ] CSV upload
- [ ] CSV export
- [ ] Toast notifications appear and auto-close
- [ ] Responsive design on mobile
- [ ] Protected route redirects

## Troubleshooting

### Common Issues

**1. API connection error**
```
Error: Network Error
```
**Solution**: Check if backend is running on the correct port and VITE_API_URL is configured properly.

**2. Token expired**
```
Error: Unauthorized (401)
```
**Solution**: Token has expired. Clear localStorage and login again.

**3. Build fails**
```
Error: Cannot find module
```
**Solution**: Delete node_modules and package-lock.json, then run `npm install` again.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new files
- Follow ESLint rules
- Use functional components with hooks
- Add proper types for all props and state
- Write meaningful commit messages

## License

This project is licensed under the MIT License.

## Support

For issues or questions:
- Open an issue on GitHub
- Contact the maintainers

---

**Built with ❤️ using React, TypeScript, and Vite**

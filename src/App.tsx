import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { VoucherProvider } from './contexts/VoucherContext';
import { DashboardLayout } from './components/layouts/DashboardLayout';
import Login from './pages/Login';
import VoucherList from './pages/VoucherList';
import CSVUpload from './pages/CSVUpload';
import VoucherForm from './pages/VoucherForm';
import Components from './pages/Components';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VoucherProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes with Dashboard Layout */}
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/vouchers" replace />} />
              <Route path="vouchers" element={<VoucherList />} />
              <Route path="vouchers/upload" element={<CSVUpload />} />
              <Route path="vouchers/new" element={<VoucherForm />} />
              <Route path="vouchers/edit/:id" element={<VoucherForm />} />
              <Route path="components" element={<Components />} />
            </Route>

            {/* Catch all - redirect to vouchers */}
            <Route path="*" element={<Navigate to="/vouchers" replace />} />
          </Routes>
        </VoucherProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

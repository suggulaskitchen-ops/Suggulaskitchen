import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import SharedLayout from './components/SharedLayout'
import AdminRoute from './components/AdminRoute'
import CustomerPage from './pages/CustomerPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import AdminPage from './pages/AdminPage'
import AdminBusinessInfo from './pages/AdminBusinessInfo'
import AdminCategories from './pages/AdminCategories'
import AdminProducts from './pages/AdminProducts'
import AdminGallery from './pages/AdminGallery'
import AdminTestimonials from './pages/AdminTestimonials'

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<SharedLayout title="Suggula's Kitchen" description="Fresh homemade food delivered with warmth and care." />}>
              <Route index element={<Navigate to="/customer" replace />} />
              <Route path="customer" element={<CustomerPage />} />
            </Route>

            <Route path="/admin/login" element={<SharedLayout title="Admin Login" description="Secure access for Suggula's Kitchen staff."><AdminLogin /></SharedLayout>} />

            <Route path="/admin" element={<SharedLayout title="Admin Dashboard" description="Manage every piece of content shown on Suggula's Kitchen." />}>
              <Route element={<AdminRoute />}>
                <Route element={<AdminDashboard />}>
                  <Route index element={<AdminPage />} />
                  <Route path="business" element={<AdminBusinessInfo />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="gallery" element={<AdminGallery />} />
                  <Route path="testimonials" element={<AdminTestimonials />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </HashRouter>
      </AppProvider>
    </AuthProvider>
  )
}

export default App

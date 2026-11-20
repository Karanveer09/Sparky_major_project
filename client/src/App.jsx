import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import Loader from '@/components/Loader';
import PWAProvider from '@/components/PWAProvider';

// Lazy load pages for fast performance and clean code splitting
const HomePage = lazy(() => import('@/pages/HomePage'));
const BeautyPage = lazy(() => import('@/pages/BeautyPage'));
const BookingsPage = lazy(() => import('@/pages/BookingsPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const CleanPage = lazy(() => import('@/pages/CleanPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const DataDeletionPage = lazy(() => import('@/pages/DataDeletionPage'));
const EventDecorPage = lazy(() => import('@/pages/EventDecorPage'));
const HautePage = lazy(() => import('@/pages/HautePage'));
const HelpPage = lazy(() => import('@/pages/HelpPage'));
const LocationPage = lazy(() => import('@/pages/LocationPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const MapPage = lazy(() => import('@/pages/MapPage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const RefundPage = lazy(() => import('@/pages/RefundPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ReviewPage = lazy(() => import('@/pages/ReviewPage'));
const ServicesPage = lazy(() => import('@/pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('@/pages/ServiceDetailPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const TaskPage = lazy(() => import('@/pages/TaskPage'));
const TrackPage = lazy(() => import('@/pages/TrackPage'));
const UserPage = lazy(() => import('@/pages/UserPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export default function App() {
  const location = useLocation();
  const pathname = location.pathname;

  const hideNavbar =
    pathname === '/checkout' ||
    pathname === '/cart' ||
    pathname === '/onboarding';

  const hideFooter =
    pathname === '/checkout' ||
    pathname === '/cart' ||
    pathname === '/beauty' ||
    pathname.startsWith('/services/') ||
    pathname === '/onboarding';

  return (
    <PWAProvider>
      {!hideNavbar && <Navbar />}

      <main className="min-h-screen">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/beauty" element={<BeautyPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/clean" element={<CleanPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/data-deletion" element={<DataDeletionPage />} />
            <Route path="/eventdecor" element={<EventDecorPage />} />
            <Route path="/haute" element={<HautePage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/location" element={<LocationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/refund" element={<RefundPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/review/:id" element={<ReviewPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:serviceName" element={<ServiceDetailPage />} />
            <Route path="/t&c" element={<TermsPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/task/:id" element={<TaskPage />} />
            <Route path="/tasks/:id" element={<TaskPage />} />
            <Route path="/track/:orderId" element={<TrackPage />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" />
      </main>

      {!hideFooter && <Footer />}
      <BottomNav />
    </PWAProvider>
  );
}


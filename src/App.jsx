import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/Toast'
import { ProtectedRoute } from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

// Public Pages
const LandingPage = lazy(() => import('./pages/LandingPage'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Docs = lazy(() => import('./pages/Docs'))

// Student Pages
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'))
const EventsList = lazy(() => import('./pages/student/EventsList'))
const EventDetails = lazy(() => import('./pages/student/EventDetails'))
const MyRegistrations = lazy(() => import('./pages/student/MyRegistrations'))
const Announcements = lazy(() => import('./pages/student/Announcements'))
const Profile = lazy(() => import('./pages/student/Profile'))

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const ManageEvents = lazy(() => import('./pages/admin/ManageEvents'))
const EventForm = lazy(() => import('./pages/admin/EventForm'))
const ManageParticipants = lazy(() => import('./pages/admin/ManageParticipants'))
const ManageAnnouncements = lazy(() => import('./pages/admin/ManageAnnouncements'))
const Analytics = lazy(() => import('./pages/admin/Analytics'))

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
  </div>
)

// Student Module Wrapper (Top Navbar style)
const StudentLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Navbar />
      <main className="flex-1 w-full pb-16">
        <Routes>
          <Route path="dashboard" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="events" element={<EventsList />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="registrations" element={
            <ProtectedRoute allowedRoles={['student']}>
              <MyRegistrations />
            </ProtectedRoute>
          } />
          <Route path="announcements" element={
            <ProtectedRoute allowedRoles={['student']}>
              <Announcements />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute allowedRoles={['student']}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  )
}

// Admin Module Wrapper (Left Sidebar style)
const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto h-screen bg-slate-900/10">
        <Routes>
          <Route path="dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="events" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageEvents />
            </ProtectedRoute>
          } />
          <Route path="events/new" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EventForm />
            </ProtectedRoute>
          } />
          <Route path="events/edit/:id" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EventForm />
            </ProtectedRoute>
          } />
          <Route path="participants" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageParticipants />
            </ProtectedRoute>
          } />
          <Route path="announcements" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageAnnouncements />
            </ProtectedRoute>
          } />
          <Route path="analytics" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  )
}

// General Docs Wrapper with Navbar
const GeneralDocsLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Navbar />
      <main className="flex-1 w-full pb-16">
        <Docs />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
            {/* General Guest/Landing Routes */}
            <Route path="/" element={
              <>
                <Navbar />
                <LandingPage />
              </>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Documentation Route */}
            <Route path="/docs" element={<GeneralDocsLayout />} />

            {/* Role Modules */}
            <Route path="/student/*" element={<StudentLayout />} />
            <Route path="/admin/*" element={<AdminLayout />} />

            {/* Fallback redirection */}
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}

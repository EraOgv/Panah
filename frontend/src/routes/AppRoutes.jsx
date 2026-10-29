import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import ReviewsPage from '../pages/ReviewsPage';
import WriteReviewPage from '../pages/WriteReviewPage';
import ComplaintsPage from '../pages/ComplaintsPage';
import ComplaintFormPage from '../pages/ComplaintFormPage';
import EmergencyPage from '../pages/EmergencyPage';
import MyComplaintsPage from '../pages/MyComplaintsPage';
import MyReviewsPage from '../pages/MyReviewsPage';
import ProfilePage from '../pages/ProfilePage';
import AdminLayout from '../components/layout/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminComplaints from '../pages/admin/AdminComplaints';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminFlaggedContent from '../pages/admin/AdminFlaggedContent';
import AdminHotspots from '../pages/admin/AdminHotspots';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/reviews" element={<ReviewsPage />} />
      <Route path="/reviews/new" element={<WriteReviewPage />} />
      <Route path="/complaints" element={<ComplaintsPage />} />
      <Route path="/complaints/new" element={<ComplaintFormPage />} />
      <Route path="/emergency" element={<EmergencyPage />} />
      <Route path="/my-complaints" element={<MyComplaintsPage />} />
      <Route path="/my-reviews" element={<MyReviewsPage />} />
      <Route path="/profile" element={<ProfilePage />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="complaints" element={<AdminComplaints />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="flagged" element={<AdminFlaggedContent />} />
        <Route path="hotspots" element={<AdminHotspots />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
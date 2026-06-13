import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles }) => {
  // Redux store එකෙන් user ලොග් වෙලාද සහ එයාගේ role එක මොකක්ද (student/tutor/admin) කියලා ගන්නවා
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  // Redux එකෙන් තවම ඩේටා ලෝඩ් වෙනවා නම් පොඩි Loading එකක් පෙන්වනවා
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // 1. පරිශීලකයා ලොග් වී නොමැති නම් කෙලින්ම Login පිටුවට හරවා යවයි
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. ලොග් වී සිටියත්, අදාළ පිටුවට යාමට අවසර (Role) නොමැති නම් Home පිටුවට හරවා යවයි
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  // 3. සියල්ල නිවැරදි නම් යා යුතු පිටුව (Dashboard/Page) ලෝඩ් කරයි
  return <Outlet />;
};

export default ProtectedRoute;
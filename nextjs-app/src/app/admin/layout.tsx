'use client';

import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { AdminProvider } from '../../contexts/AdminContext';
import AdminSidebar from '../../components/admin/AdminSidebar';

const inter = Inter({ subsets: ['latin'] });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  return (
    <>
      {pathname === '/admin/login' ? (
        // Login page - no sidebar
        <>{children}</>
      ) : (
        // Protected admin pages - with sidebar
        <AdminProvider>
          <div className="min-h-screen bg-gray-50">
            <div className="flex">
              {/* Sidebar */}
              <AdminSidebar />
              
              {/* Main Content */}
              <main className="flex-1 ml-64 p-6">
                <div className="max-w-7xl mx-auto">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </AdminProvider>
      )}
    </>
  );
}

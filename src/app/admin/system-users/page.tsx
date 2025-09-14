'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SystemUsersPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Settings page with system-users tab
    router.replace('/admin/settings?tab=system-users');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Redirecting...</h2>
        <p className="text-gray-600">System Users has been moved to Settings.</p>
      </div>
    </div>
  );
};

export default SystemUsersPage;
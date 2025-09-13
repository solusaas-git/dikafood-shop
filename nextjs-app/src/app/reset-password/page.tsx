'use client'

import PasswordResetPage from '@/components/pages/auth/PasswordResetPage'

// Disable static generation for this page to avoid SSR issues
export const dynamic = 'force-dynamic'

export default function ResetPassword() {
  return <PasswordResetPage />
}

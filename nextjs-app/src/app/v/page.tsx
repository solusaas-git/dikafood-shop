'use client'

import VerificationSuccessPage from '@/components/pages/auth/VerificationSuccessPage'

// Disable static generation for this page to avoid SSR issues
export const dynamic = 'force-dynamic'

export default function V() {
  return <VerificationSuccessPage />
}

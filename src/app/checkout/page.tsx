'use client'

import MainLayout from '@/components/ui/layout/MainLayout'
import SimpleCheckoutPage from '@/components/pages/checkout/SimpleCheckoutPage'

// Disable static generation for this page to avoid SSR issues
export const dynamic = 'force-dynamic'

export default function Checkout() {
  return (
    <MainLayout>
      <SimpleCheckoutPage />
    </MainLayout>
  )
}

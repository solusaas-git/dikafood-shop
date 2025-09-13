'use client'

import MainLayout from '@/components/ui/layout/MainLayout'
import ShopPage from '@/components/pages/shop/ShopPage'

// Disable static generation for this page to avoid SSR issues
export const dynamic = 'force-dynamic'

export default function Shop() {
  return (
    <MainLayout>
      <ShopPage />
    </MainLayout>
  )
}

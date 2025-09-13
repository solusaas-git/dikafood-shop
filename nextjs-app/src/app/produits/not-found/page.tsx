'use client'

import MainLayout from '@/components/ui/layout/MainLayout'
import ProductNotFoundPage from '@/components/pages/product/ProductNotFoundPage'

// Disable static generation for this page to avoid SSR issues
export const dynamic = 'force-dynamic'

export default function ProductNotFound() {
  return (
    <MainLayout>
      <ProductNotFoundPage />
    </MainLayout>
  )
}

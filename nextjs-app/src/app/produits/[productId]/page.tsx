'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import MainLayout from '@/components/ui/layout/MainLayout'
import ProductDetailPage from '@/components/pages/product/ProductDetailPage'
import PageLoader from '@/components/ui/loading/PageLoader'

// Disable static generation for this page to avoid SSR issues
export const dynamic = 'force-dynamic'

export default function ProductDetail() {
  const params = useParams()
  const productId = params.productId as string
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      {isLoading && <PageLoader message="Chargement du produit..." />}
      <MainLayout>
        <ProductDetailPage 
          productId={productId} 
          onLoadingChange={setIsLoading}
        />
      </MainLayout>
    </>
  )
}

import React from 'react'
import HeroSection from './HeroSection'
import CategoryGrid from './CategoryGrid'
import ProductSection from './ProductSection'
import BottomNav from './BottomNav'

export default function Home({ categories = [] }) {
  return (
    <>
      <HeroSection/>
      <CategoryGrid categories={categories} />
      <ProductSection />
      <BottomNav />
    </>
  )
}

import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import TopBar from './TopBar'
import Navbar from './Navbar'
import Footer from './Footer'

// Kerangka semua halaman publik: TopBar + Navbar + konten + Footer.
export default function PublicLayout() {
  const { pathname, hash } = useLocation()

  // Pindah halaman → scroll ke atas; ada #hash → scroll ke bagian itu.
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return (
    <div className="bg-surface-light text-on-surface font-body-md antialiased min-h-screen flex flex-col">
      <TopBar />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

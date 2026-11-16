import { useEffect, useRef, useState } from 'react'

/**
 * Membungkus elemen agar beranimasi saat masuk viewport.
 * animation: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom' | 'fade'
 */
const KELAS_AWAL = {
  'fade-up': 'opacity-0 translate-y-8',
  'fade-down': 'opacity-0 -translate-y-8',
  'fade-left': 'opacity-0 translate-x-8',
  'fade-right': 'opacity-0 -translate-x-8',
  zoom: 'opacity-0 scale-95',
  fade: 'opacity-0',
}

export default function Reveal({
  as: Tag = 'div',
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  once = true,
  threshold = 0.15,
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null)
  const [tampil, setTampil] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Hormati pengguna yang mematikan animasi di sistem
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTampil(true)
      return
    }
    if (!('IntersectionObserver' in window)) {
      setTampil(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTampil(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setTampil(false)
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once, threshold])

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms`, transitionDuration: `${duration}ms` }}
      className={`transition-all ease-out will-change-transform ${
        tampil ? 'opacity-100 translate-x-0 translate-y-0 scale-100' : KELAS_AWAL[animation]
      } ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
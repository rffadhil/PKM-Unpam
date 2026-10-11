import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppRoutes from '@/routes'

// Render seluruh aplikasi pada URL tertentu dengan QueryClient baru; menunggu data selesai dimuat.
export async function renderAplikasi(url = '/admin/berita') {
  const user = userEvent.setup()
  const klien = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
  render(
    <QueryClientProvider client={klien}>
      <MemoryRouter initialEntries={[url]}>
        <AppRoutes />
      </MemoryRouter>
    </QueryClientProvider>,
  )
  await waitFor(() => expect(screen.queryByText('Memuat data…')).not.toBeInTheDocument())
  return user
}

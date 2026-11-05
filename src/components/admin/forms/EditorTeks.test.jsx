import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import EditorTeks from './EditorTeks'

// Editor sungguhan (TipTap) di jsdom. Isi disuntik lewat instance editor (onSiap) karena
// mengetik di contenteditable tidak andal di jsdom.
function Contoh({ awal = '', onUbahLuar, onUnggah = vi.fn(), tangkap }) {
  const [nilai, setNilai] = useState(awal)
  return (
    <EditorTeks
      id="konten"
      nilai={nilai}
      onUbah={(h) => {
        setNilai(h)
        onUbahLuar?.(h)
      }}
      onUnggahGambar={onUnggah}
      onSiap={tangkap}
    />
  )
}

async function siap(props = {}) {
  let editor
  render(<Contoh {...props} tangkap={(e) => (editor = e)} />)
  await waitFor(() => expect(editor).toBeTruthy())
  return { editor, user: userEvent.setup() }
}

describe('EditorTeks (TipTap)', () => {
  it('menampilkan isi awal HTML dan toolbar dengan label aksesibel', async () => {
    await siap({ awal: '<h2>Judul Bagian</h2><p>Halo <strong>dunia</strong></p>' })
    const editorEl = screen.getByRole('textbox', { name: 'Isi artikel' })
    expect(editorEl).toHaveAttribute('aria-multiline', 'true')
    expect(editorEl.querySelector('h2')).toHaveTextContent('Judul Bagian')
    expect(editorEl.querySelector('strong')).toHaveTextContent('dunia')
    const bar = screen.getByRole('toolbar', { name: 'Pemformatan teks' })
    ;['Tebal', 'Miring', 'Garis bawah', 'Daftar poin', 'Daftar angka', 'Kutipan', 'Tautan', 'Sisipkan gambar', 'Urungkan', 'Ulangi'].forEach(
      (n) => expect(bar.querySelector(`[aria-label="${n}"]`)).toBeTruthy(),
    )
  })

  it('perubahan isi dikirim sebagai HTML; kosong dikirim sebagai string kosong', async () => {
    const onUbahLuar = vi.fn()
    const { editor } = await siap({ onUbahLuar })
    act(() => editor.commands.setContent('<p>Berita baru</p>', { emitUpdate: true }))
    await waitFor(() => expect(onUbahLuar).toHaveBeenLastCalledWith('<p>Berita baru</p>'))
    act(() => editor.commands.clearContent(true))
    await waitFor(() => expect(onUbahLuar).toHaveBeenLastCalledWith(''))
  })

  it('tombol Tebal menandai aria-pressed dan memformat teks terpilih', async () => {
    const onUbahLuar = vi.fn()
    const { editor, user } = await siap({ awal: '<p>Halo dunia</p>', onUbahLuar })
    act(() => editor.commands.selectAll())
    const tebal = screen.getByRole('button', { name: 'Tebal' })
    expect(tebal).toHaveAttribute('aria-pressed', 'false')
    await user.click(tebal)
    await waitFor(() => expect(screen.getByRole('button', { name: 'Tebal' })).toHaveAttribute('aria-pressed', 'true'))
    expect(onUbahLuar.mock.lastCall[0]).toContain('<p><strong>Halo dunia</strong></p>')
  })

  it('Daftar poin mengubah paragraf menjadi <ul>', async () => {
    const onUbahLuar = vi.fn()
    const { editor, user } = await siap({ awal: '<p>Satu</p>', onUbahLuar })
    act(() => editor.commands.setTextSelection({ from: 1, to: 5 }))
    await user.click(screen.getByRole('button', { name: 'Daftar poin' }))
    await waitFor(() => expect(onUbahLuar.mock.lastCall?.[0]).toContain('<ul><li><p>Satu</p></li></ul>'))
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Daftar poin' })).toHaveAttribute('aria-pressed', 'true'),
    )
  })

  it('Gaya paragraf "Judul bagian" mengubah paragraf menjadi <h2> (hanya h2/h3 tersedia)', async () => {
    const onUbahLuar = vi.fn()
    const { editor, user } = await siap({ awal: '<p>Satu</p>', onUbahLuar })
    const pilihan = [...screen.getByLabelText('Gaya paragraf').querySelectorAll('option')].map((o) => o.value)
    expect(pilihan).toEqual(['p', 'h2', 'h3'])
    act(() => editor.commands.setTextSelection({ from: 1, to: 5 }))
    await user.selectOptions(screen.getByLabelText('Gaya paragraf'), 'h2')
    await waitFor(() => expect(onUbahLuar.mock.lastCall?.[0]).toContain('<h2>Satu</h2>'))
    await waitFor(() => expect(screen.getByLabelText('Gaya paragraf')).toHaveValue('h2'))
  })

  describe('tautan', () => {
    it('menerapkan tautan; alamat tanpa skema diberi https://', async () => {
      const onUbahLuar = vi.fn()
      const { editor, user } = await siap({ awal: '<p>Kunjungi portal</p>', onUbahLuar })
      act(() => editor.commands.selectAll())
      await user.click(screen.getByRole('button', { name: 'Tautan' }))
      await user.type(screen.getByLabelText('Alamat tautan'), 'smaharapanjaya.sch.id')
      await user.click(screen.getByRole('button', { name: 'Terapkan' }))
      await waitFor(() => expect(onUbahLuar).toHaveBeenCalled())
      expect(onUbahLuar.mock.lastCall[0]).toContain('href="https://smaharapanjaya.sch.id"')
      expect(screen.queryByLabelText('Alamat tautan')).not.toBeInTheDocument()
    })

    it('menolak tautan javascript: dengan pesan kesalahan', async () => {
      const onUbahLuar = vi.fn()
      const { editor, user } = await siap({ awal: '<p>Klik</p>', onUbahLuar })
      act(() => editor.commands.selectAll())
      await user.click(screen.getByRole('button', { name: 'Tautan' }))
      await user.type(screen.getByLabelText('Alamat tautan'), 'javascript:alert(1)')
      await user.click(screen.getByRole('button', { name: 'Terapkan' }))
      expect(screen.getByRole('alert')).toHaveTextContent('Gunakan tautan http(s):// atau mailto:.')
      expect(onUbahLuar).not.toHaveBeenCalled()
    })
  })

  describe('sisipkan gambar', () => {
    const buatFile = (nama, tipe, ukuran = 1000) =>
      Object.defineProperty(new File(['x'], nama, { type: tipe }), 'size', { value: ukuran })

    it('mengunggah lalu menyisipkan gambar dengan alt dari nama file', async () => {
      const onUbahLuar = vi.fn()
      const onUnggah = vi.fn().mockResolvedValue('https://cdn.test/foto-lomba.png')
      const { user } = await siap({ onUbahLuar, onUnggah })
      await user.upload(screen.getByLabelText('Pilih gambar untuk disisipkan'), buatFile('foto-lomba.png', 'image/png'))
      await waitFor(() => expect(onUbahLuar).toHaveBeenCalled())
      expect(onUnggah).toHaveBeenCalledTimes(1)
      expect(onUbahLuar.mock.lastCall[0]).toContain('src="https://cdn.test/foto-lomba.png"')
      expect(onUbahLuar.mock.lastCall[0]).toContain('alt="foto lomba"')
    })

    it('menolak format selain JPG/PNG/WebP tanpa memanggil unggah', async () => {
      const onUnggah = vi.fn()
      const { user } = await siap({ onUnggah })
      // `applyAccept: false` agar file ditolak oleh validasi aplikasi, bukan oleh filter accept user-event
      const u = userEvent.setup({ applyAccept: false })
      await u.upload(screen.getByLabelText('Pilih gambar untuk disisipkan'), buatFile('doc.pdf', 'application/pdf'))
      expect(await screen.findByRole('alert')).toHaveTextContent('JPG, PNG, atau WebP')
      expect(onUnggah).not.toHaveBeenCalled()
      expect(user).toBeTruthy()
    })
  })
})

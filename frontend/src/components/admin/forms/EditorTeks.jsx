import { useEffect, useRef, useState } from 'react'
import { useEditor, useEditorState, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Placeholder } from '@tiptap/extensions'
import clsx from 'clsx'
import Icon from '@/components/ui/Icon'
import { validasiGambar } from '@/utils/validasi'
import { rapikanTautan } from '@/utils/tautan'

// Editor teks kaya (WYSIWYG) berbasis TipTap. Menyimpan HTML.
// Nilai awal dibaca sekali; untuk mengganti isi dari luar, beri `key` baru pada komponen ini.
// `onUnggahGambar(file)` → Promise<string> URL gambar untuk disisipkan ke isi artikel.

function TombolBar({ label, ikon, aktif, onKlik, disabled }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={aktif === undefined ? undefined : aktif}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} // jaga fokus tetap di editor
      onClick={onKlik}
      className={clsx(
        'p-1.5 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
        aktif ? 'bg-secondary text-white' : 'text-on-surface hover:bg-surface-container-high',
      )}
    >
      <Icon name={ikon} className="text-[20px]" />
    </button>
  )
}

export default function EditorTeks({ id, nilai, onUbah, onUnggahGambar, onSiap, placeholder, galat, deskripsiId }) {
  const fileRef = useRef(null)
  const [panelTautan, setPanelTautan] = useState(false)
  const [urlTautan, setUrlTautan] = useState('')
  const [galatTautan, setGalatTautan] = useState('')
  const [galatGambar, setGalatGambar] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false } }),
      Image,
      Placeholder.configure({ placeholder: placeholder ?? 'Tulis isi artikel di sini…' }),
    ],
    content: nilai,
    onUpdate: ({ editor: e }) => onUbah(e.isEmpty ? '' : e.getHTML()),
    editorProps: {
      attributes: {
        id,
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-label': 'Isi artikel',
        ...(deskripsiId ? { 'aria-describedby': deskripsiId } : {}),
        class: 'konten-artikel tiptap min-h-[280px] px-4 py-3 focus:outline-none',
      },
    },
  })

  // Beri tahu induk saat editor siap (untuk fitur tambahan / pengujian).
  useEffect(() => {
    if (editor && onSiap) onSiap(editor)
  }, [editor, onSiap])

  const status = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      tebal: e?.isActive('bold') ?? false,
      miring: e?.isActive('italic') ?? false,
      garisBawah: e?.isActive('underline') ?? false,
      daftarPoin: e?.isActive('bulletList') ?? false,
      daftarAngka: e?.isActive('orderedList') ?? false,
      kutipan: e?.isActive('blockquote') ?? false,
      tautan: e?.isActive('link') ?? false,
      blok: e?.isActive('heading', { level: 2 }) ? 'h2' : e?.isActive('heading', { level: 3 }) ? 'h3' : 'p',
      bisaUndo: e?.can().undo() ?? false,
      bisaRedo: e?.can().redo() ?? false,
    }),
  })

  if (!editor) return null
  const rantai = () => editor.chain().focus()

  const ubahBlok = (nilaiBlok) => {
    if (nilaiBlok === 'p') rantai().setParagraph().run()
    else rantai().setHeading({ level: Number(nilaiBlok[1]) }).run()
  }

  const bukaPanelTautan = () => {
    setUrlTautan(editor.getAttributes('link').href ?? '')
    setGalatTautan('')
    setPanelTautan(true)
  }

  const terapkanTautan = () => {
    const url = rapikanTautan(urlTautan)
    if (url === null) {
      setGalatTautan('Gunakan tautan http(s):// atau mailto:.')
      return
    }
    if (url === '') rantai().extendMarkRange('link').unsetLink().run()
    else rantai().extendMarkRange('link').setLink({ href: url }).run()
    setPanelTautan(false)
  }

  const hapusTautan = () => {
    rantai().extendMarkRange('link').unsetLink().run()
    setPanelTautan(false)
  }

  const pilihGambar = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const pesan = validasiGambar(file)
    setGalatGambar(pesan)
    if (pesan) return
    try {
      const src = await onUnggahGambar(file)
      // Teks alternatif sementara dari nama file; admin disarankan memperbaikinya (aksesibilitas).
      rantai().setImage({ src, alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ') }).run()
    } catch (err) {
      setGalatGambar(err.message)
    }
  }

  return (
    <div>
      <div
        className={clsx(
          'rounded-lg border bg-surface-white overflow-hidden focus-within:ring-1 focus-within:ring-secondary focus-within:border-secondary',
          galat ? 'border-error' : 'border-border-muted',
        )}
      >
        <div
          role="toolbar"
          aria-label="Pemformatan teks"
          className="flex flex-wrap items-center gap-1 p-2 bg-surface-light border-b border-border-muted"
        >
          <TombolBar label="Urungkan" ikon="undo" disabled={!status.bisaUndo} onKlik={() => rantai().undo().run()} />
          <TombolBar label="Ulangi" ikon="redo" disabled={!status.bisaRedo} onKlik={() => rantai().redo().run()} />
          <span className="w-px h-5 bg-border-muted mx-1" aria-hidden="true" />
          <select
            aria-label="Gaya paragraf"
            value={status.blok}
            onChange={(e) => ubahBlok(e.target.value)}
            className="text-xs font-semibold border border-border-muted rounded-md px-2 py-1 bg-surface-white text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
          >
            <option value="p">Paragraf</option>
            <option value="h2">Judul bagian</option>
            <option value="h3">Sub-judul</option>
          </select>
          <span className="w-px h-5 bg-border-muted mx-1" aria-hidden="true" />
          <TombolBar label="Tebal" ikon="format_bold" aktif={status.tebal} onKlik={() => rantai().toggleBold().run()} />
          <TombolBar label="Miring" ikon="format_italic" aktif={status.miring} onKlik={() => rantai().toggleItalic().run()} />
          <TombolBar label="Garis bawah" ikon="format_underlined" aktif={status.garisBawah} onKlik={() => rantai().toggleUnderline().run()} />
          <span className="w-px h-5 bg-border-muted mx-1" aria-hidden="true" />
          <TombolBar label="Daftar poin" ikon="format_list_bulleted" aktif={status.daftarPoin} onKlik={() => rantai().toggleBulletList().run()} />
          <TombolBar label="Daftar angka" ikon="format_list_numbered" aktif={status.daftarAngka} onKlik={() => rantai().toggleOrderedList().run()} />
          <TombolBar label="Kutipan" ikon="format_quote" aktif={status.kutipan} onKlik={() => rantai().toggleBlockquote().run()} />
          <span className="w-px h-5 bg-border-muted mx-1" aria-hidden="true" />
          <TombolBar label="Tautan" ikon="link" aktif={status.tautan} onKlik={bukaPanelTautan} />
          <TombolBar label="Sisipkan gambar" ikon="image" onKlik={() => fileRef.current?.click()} />
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            aria-label="Pilih gambar untuk disisipkan"
            tabIndex={-1}
            onChange={pilihGambar}
          />
        </div>

        {panelTautan && (
          <div className="flex flex-wrap items-center gap-2 p-2 bg-amber-50/60 border-b border-border-muted">
            <label htmlFor={`${id}-url`} className="sr-only">
              Alamat tautan
            </label>
            <input
              id={`${id}-url`}
              type="text"
              value={urlTautan}
              onChange={(e) => setUrlTautan(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  terapkanTautan()
                }
              }}
              placeholder="https://contoh.sch.id/halaman"
              className="flex-1 min-w-[200px] text-sm border border-border-muted rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-secondary"
            />
            <button type="button" onClick={terapkanTautan} className="px-3 py-1.5 rounded-md bg-secondary text-white text-xs font-semibold">
              Terapkan
            </button>
            {status.tautan && (
              <button type="button" onClick={hapusTautan} className="px-3 py-1.5 rounded-md border border-border-muted text-xs font-semibold text-rose-600">
                Hapus tautan
              </button>
            )}
            <button type="button" onClick={() => setPanelTautan(false)} className="px-2 py-1.5 text-xs text-text-muted">
              Tutup
            </button>
            {galatTautan && (
              <p role="alert" className="w-full text-xs text-error font-medium">
                {galatTautan}
              </p>
            )}
          </div>
        )}

        <EditorContent editor={editor} />
      </div>
      {galatGambar && (
        <p role="alert" className="mt-1.5 text-xs text-error font-medium">
          {galatGambar}
        </p>
      )}
    </div>
  )
}

import { ROLE_ADMIN } from '@/config/pengaturanAdmin'

// Pil peran (RBAC).
export default function PerananBadge({ role }) {
  const r = ROLE_ADMIN.find((x) => x.kunci === role)
  return (
    <span className={`inline-block rounded-full px-3 py-1.5 text-xs font-semibold leading-tight ${r?.tone ?? 'bg-surface-container-high text-text-muted'}`}>
      {r?.label ?? role}
    </span>
  )
}

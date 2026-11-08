import Icon from '@/components/ui/Icon'
import { loginTeks } from '@/config/login'

// Catatan keamanan di dasar kartu login.
export default function LoginInfoBox() {
  return (
    <div className="flex gap-3 rounded-lg border border-border-muted bg-surface-container-low p-3">
      <Icon name="verified_user" className="mt-0.5 shrink-0 text-[20px] text-secondary" />
      <p className="text-body-md leading-relaxed text-text-muted">{loginTeks.kartu.info}</p>
    </div>
  )
}

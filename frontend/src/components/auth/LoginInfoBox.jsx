import Icon from '@/components/ui/Icon'
import { loginTeks } from '@/config/login'

// Catatan keamanan di dasar kartu login.
export default function LoginInfoBox() {
  return (
    <div className="flex gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
      <Icon name="verified_user" className="mt-0.5 shrink-0 text-[20px] text-secondary" />
      <p className="text-body-md leading-relaxed text-text-muted">{loginTeks.kartu.info}</p>
    </div>
  )
}

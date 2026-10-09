// Ikon Material Symbols. Font di-load lewat <link> di index.html,
// class .material-symbols-outlined ada di styles/index.css.
export default function Icon({ name, className = '', filled = false, ...props }) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
      {...props}
    >
      {name}
    </span>
  )
}

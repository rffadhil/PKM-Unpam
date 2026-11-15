const DEFAULT_FAVICON = '/favicon.png'
const DEFAULT_THEME_COLOR = '#1f5d1f'

export function applyBrowserBranding({
  title,
  favicon = DEFAULT_FAVICON,
  themeColor = DEFAULT_THEME_COLOR,
} = {}) {
  if (title) {
    document.title = title
  }

  let iconLink = document.querySelector("link[rel~='icon']")
  if (!iconLink) {
    iconLink = document.createElement('link')
    iconLink.rel = 'icon'
    document.head.appendChild(iconLink)
  }
  iconLink.href = favicon || DEFAULT_FAVICON
  iconLink.type = 'image/png'

  let themeMeta = document.querySelector('meta[name="theme-color"]')
  if (!themeMeta) {
    themeMeta = document.createElement('meta')
    themeMeta.name = 'theme-color'
    document.head.appendChild(themeMeta)
  }
  themeMeta.content = themeColor
}

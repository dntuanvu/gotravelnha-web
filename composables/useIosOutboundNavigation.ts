/**
 * After an async affiliate click (`$fetch` then navigate), iOS WebKit often blocks
 * `window.open` or opens a blank tab; `_blank` also breaks universal links into
 * partner apps. Use full-page navigation in the same tab instead.
 */
export function useIosOutboundNavigation() {
  const shouldUseSameTabAfterAsyncClick = () => {
    if (typeof navigator === 'undefined') return false
    const ua = navigator.userAgent || ''
    if (/iPad|iPhone|iPod/.test(ua)) return true
    // iPadOS 13+ “desktop” Safari reports as Macintosh + touch
    if (
      typeof navigator.maxTouchPoints === 'number' &&
      navigator.maxTouchPoints > 1 &&
      /Macintosh/.test(ua)
    ) {
      return true
    }
    return false
  }

  return { shouldUseSameTabAfterAsyncClick }
}

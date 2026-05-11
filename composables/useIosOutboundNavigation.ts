/**
 * After an async affiliate click (`$fetch` then navigate), iOS WebKit often blocks
 * `window.open` or opens a blank tab; `_blank` also breaks universal links into
 * partner apps. Use full-page navigation in the same tab instead.
 *
 * iOS Safari: matches `pages/index.vue` funnel — real `<a href>` + same-tab
 * navigation preserves universal links; use with `sendBeacon` for tracking.
 */
export function useIosOutboundNavigation() {
  const isIOSSafari = () => {
    if (typeof navigator === 'undefined') return false
    const ua = navigator.userAgent || ''
    const isIOS = /iPad|iPhone|iPod/.test(ua)
    const isSafari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS/.test(ua)
    return isIOS && isSafari
  }

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

  return { shouldUseSameTabAfterAsyncClick, isIOSSafari }
}

/**
 * i18n Composable for Vietnamese/English Support
 * Simple translation system for GoVietHub
 */

type Language = 'en' | 'vi'

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.klook': 'Klook',
    'nav.trip': 'Trip.com',
    'nav.attractions': 'SG Attractions',
    'nav.deals': 'Best Deals',
    'nav.compare': 'Compare',
    
    // Homepage
    'home.title': 'GoVietHub',
    'home.tagline': 'Discover, Compare & Book',
    'home.description': 'Compare and book the best travel deals across Trip.com, Klook, and Singapore Attractions',
    
    // Buttons
    'btn.subscribe': 'Subscribe',
    'btn.share': 'Share',
    'btn.book': 'Book Now',
    'btn.login': 'Login',
    'btn.register': 'Register',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel'
  },
  vi: {
    // Navigation
    'nav.klook': 'Klook',
    'nav.trip': 'Trip.com',
    'nav.attractions': 'Địa Điểm Singapore',
    'nav.deals': 'Ưu Đãi Tốt Nhất',
    'nav.compare': 'So Sánh',
    
    // Homepage
    'home.title': 'GoVietHub',
    'home.tagline': 'Khám Phá, So Sánh & Đặt Chỗ',
    'home.description': 'So sánh và đặt các ưu đãi du lịch tốt nhất trên Trip.com, Klook và Địa Điểm Singapore',
    
    // Buttons
    'btn.subscribe': 'Đăng Ký',
    'btn.share': 'Chia Sẻ',
    'btn.book': 'Đặt Ngay',
    'btn.login': 'Đăng Nhập',
    'btn.register': 'Đăng Ký',
    
    // Common
    'common.loading': 'Đang tải...',
    'common.error': 'Lỗi',
    'common.success': 'Thành công',
    'common.save': 'Lưu',
    'common.cancel': 'Hủy'
  }
}

export const useI18n = () => {
  const currentLang = useState<Language>('i18n-lang', () => 'en')

  // Get language from localStorage or browser
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('goviethub_lang')
    if (saved === 'vi' || saved === 'en') {
      currentLang.value = saved
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith('vi')) {
        currentLang.value = 'vi'
      }
    }
  }

  const setLanguage = (lang: Language) => {
    currentLang.value = lang
    if (typeof window !== 'undefined') {
      localStorage.setItem('goviethub_lang', lang)
      document.documentElement.lang = lang
    }
  }

  const t = (key: string, fallback?: string): string => {
    return translations[currentLang.value]?.[key] || fallback || key
  }

  return {
    currentLang: readonly(currentLang),
    setLanguage,
    t
  }
}


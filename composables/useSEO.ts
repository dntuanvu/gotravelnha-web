/**
 * SEO Composable
 * Provides SEO helpers for pages with dynamic meta tags and structured data
 */

export const useSEO = () => {
  const setPageSEO = (options: {
    title?: string
    description?: string
    keywords?: string
    image?: string
    url?: string
    type?: string
    structuredData?: any
  }) => {
    const siteName = 'GoVietHub'
    const baseUrl = 'https://gotravelnha.com'
    const defaultImage = 'https://storage.googleapis.com/travella_assets_images/app_icon.png'
    
    const title = options.title 
      ? `${options.title} | ${siteName}`
      : `${siteName} - Discover, Compare & Book Travel Deals`
    
    const description = options.description || 
      'Compare and book the best travel deals across Trip.com, Klook, and Singapore Attractions'
    
    const url = options.url || baseUrl
    const image = options.image || defaultImage
    const type = options.type || 'website'

    useHead({
      title,
      meta: [
        { name: 'description', content: description },
        { name: 'keywords', content: options.keywords || 'travel deals, compare travel prices, trip.com, klook, singapore attractions' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:url', content: url },
        { property: 'og:type', content: type },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image }
      ],
      link: [
        { rel: 'canonical', href: url }
      ],
      script: options.structuredData ? [
        {
          type: 'application/ld+json',
          children: JSON.stringify(options.structuredData)
        }
      ] : []
    })
  }

  const generateProductStructuredData = (product: {
    name: string
    description: string
    price?: number
    currency?: string
    image?: string
    url: string
    availability?: string
  }) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.image,
      url: product.url,
      offers: product.price ? {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency || 'USD',
        availability: product.availability || 'https://schema.org/InStock'
      } : undefined
    }
  }

  const generateArticleStructuredData = (article: {
    headline: string
    description: string
    author: string
    datePublished: string
    dateModified?: string
    image?: string
    url: string
  }) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.headline,
      description: article.description,
      author: {
        '@type': 'Organization',
        name: article.author
      },
      datePublished: article.datePublished,
      dateModified: article.dateModified || article.datePublished,
      image: article.image,
      url: article.url
    }
  }

  const generateBreadcrumbStructuredData = (items: Array<{ name: string; url: string }>) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    }
  }

  return {
    setPageSEO,
    generateProductStructuredData,
    generateArticleStructuredData,
    generateBreadcrumbStructuredData
  }
}


// Data Mapper: Transform API responses to frontend WebsiteData format

import { AnalyzeResponse, ResearchData, PlanItem } from '../types/api'
import { WebsiteData, Source, Headline } from '@/app/app/types/website'

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
  try {
    let domain = url.replace(/^https?:\/\//, '')
    domain = domain.replace(/^www\./, '')
    domain = domain.split('/')[0]
    domain = domain.split(':')[0]
    return domain
  } catch {
    return url
  }
}

/**
 * Map site_map items to Source array
 */
function mapSources(siteMap: { url: string; title: string }[]): Source[] {
  return siteMap.map((item, index) => {
    const titleLower = item.title.toLowerCase()
    let type: 'HOME' | 'ABOUT' = 'HOME'

    // Determine type based on title or URL
    if (titleLower.includes('about')) {
      type = 'ABOUT'
    } else if (titleLower.includes('home') || item.url === '/' || index === 0) {
      type = 'HOME'
    } else if (index === 1 && siteMap.length > 1) {
      type = 'ABOUT'
    }

    return {
      type,
      content: item.title || item.url,
    }
  })
}

/**
 * Generate about text from research_data
 */
function generateAbout(researchData: ResearchData): string {
  const { audience, niche, tone } = researchData
  return `${niche} platform for ${audience} with a ${tone} approach.`
}

/**
 * Generate features from research_data
 */
function generateFeatures(researchData: ResearchData): string[] {
  const { niche, core_keywords, tone } = researchData
  const features: string[] = []

  // Add keyword-based features
  core_keywords.forEach((keyword) => {
    features.push(`Focus on ${keyword}`)
  })

  // Add niche and tone features
  features.push(`${niche} content`)
  features.push(`${tone} communication`)
  features.push('SEO optimized')

  return features
}

/**
 * Calculate difficulty based on word_count
 */
function calculateDifficulty(wordCount: number): 'low' | 'med' | 'high' {
  if (wordCount < 1500) {
    return 'low'
  } else if (wordCount <= 3000) {
    return 'med'
  } else {
    return 'high'
  }
}

/**
 * Format word count as volume string
 */
function formatVolume(wordCount: number): string {
  if (wordCount >= 1000) {
    return `${(wordCount / 1000).toFixed(1)}k words`
  }
  return `${wordCount} words`
}

/**
 * Map plan items to headlines
 */
function mapHeadlines(plan: PlanItem[]): Headline[] {
  return plan.map((item) => ({
    title: item.title,
    difficulty: calculateDifficulty(item.word_count),
    volume: formatVolume(item.word_count),
  }))
}

/**
 * Generate blog focus text from research_data
 */
function generateBlogFocus(researchData: ResearchData): string {
  const { niche, audience, core_keywords, tone } = researchData
  const keywordsStr = core_keywords.join(', ')
  return `Focus on ${niche} topics for ${audience}. Core themes: ${keywordsStr}. Tone: ${tone}.`
}

/**
 * Transform AnalyzeResponse to WebsiteData format
 */
export function mapAnalyzeResponseToWebsiteData(
  response: AnalyzeResponse,
  originalUrl: string
): WebsiteData {
  const domain = extractDomain(originalUrl)
  const { research_data, plan } = response

  return {
    domain,
    sources: mapSources(research_data.site_map),
    about: generateAbout(research_data),
    features: generateFeatures(research_data),
    headlines: mapHeadlines(plan),
    blogFocus: generateBlogFocus(research_data),
  }
}

export interface Source {
  type: 'HOME' | 'ABOUT'
  content: string
}

export interface Headline {
  title: string
  difficulty: 'low' | 'med' | 'high'
  volume: string
}

export interface WebsiteData {
  domain: string
  sources: Source[]
  about: string
  features: string[]
  headlines: Headline[]
  blogFocus?: string
}

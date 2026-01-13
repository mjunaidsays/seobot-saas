// API Type Definitions matching FastAPI backend structures

export interface SiteMapItem {
  url: string
  title: string
}

export interface ResearchData {
  audience: string
  niche: string
  core_keywords: string[]
  tone: string
  site_map: SiteMapItem[]
}

export interface PlanItem {
  title: string
  main_keyword: string
  lsi_keywords: string[]
  word_count: number
}

export interface AnalyzeRequest {
  url: string
}

export interface AnalyzeResponse {
  session_id: string
  id: string
  research_data: ResearchData
  plan: PlanItem[]
}

export interface GenerateRequest {
  session_id: string
  topic: string
  keywords: string[]
  word_count: number
  research_data: ResearchData
}

export interface GenerateResponse {
  article: string
}

export interface ChatRequest {
  session_id: string
  message: string
}

export interface ChatResponse {
  session_id: string
  answer: string
  plan: PlanItem[]
}

export interface ApiError {
  detail?: string
  message?: string
  error?: string
}

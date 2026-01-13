'use client'

import { useState, useCallback } from 'react'
import { Message } from '@/app/app/components/ChatMessage'
import { WebsiteData, Headline } from '@/app/app/types/website'
import { apiClient } from '@/lib/api'
import { mapAnalyzeResponseToWebsiteData } from '@/lib/mappers/websiteMapper'
import { AnalyzeResponse, PlanItem, ResearchData, GenerateRequest, ChatRequest, ChatResponse } from '@/lib/types/api'

// URL detection regex pattern
const URL_PATTERN = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi

// Extract URL from message
function extractURL(message: string): string | null {
  const matches = message.match(URL_PATTERN)
  if (matches && matches.length > 0) {
    let url = matches[0]
    // Ensure URL has protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }
    return url
  }
  return null
}

// Extract domain from URL
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

// Helper function to calculate difficulty based on word_count
function calculateDifficulty(wordCount: number): 'low' | 'med' | 'high' {
  if (wordCount < 1500) {
    return 'low'
  } else if (wordCount <= 3000) {
    return 'med'
  } else {
    return 'high'
  }
}

// Helper function to format word count as volume string
function formatVolume(wordCount: number): string {
  if (wordCount >= 1000) {
    return `${(wordCount / 1000).toFixed(1)}k words`
  }
  return `${wordCount} words`
}

// Helper function to update websiteData headlines from planItems
function updateHeadlinesFromPlan(planItems: PlanItem[]): Headline[] {
  return planItems.map((item) => ({
    title: item.title,
    difficulty: calculateDifficulty(item.word_count),
    volume: formatVolume(item.word_count),
  }))
}

export interface GeneratedArticle {
  title: string
  article: string
  keywords: string[]
  word_count: number
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi there! I'm SEObot, your AI SEO assistant.",
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'bot',
      content: "I can help increase 🚀 your website's organic traffic. No manual work required from you!",
      timestamp: new Date(),
    },
    {
      id: '3',
      type: 'bot',
      content: "Ready to start? Enter your website URL to begin!",
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [websiteUrl, setWebsiteUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [researchData, setResearchData] = useState<ResearchData | null>(null)
  const [planItems, setPlanItems] = useState<PlanItem[]>([])
  const [generatedArticles, setGeneratedArticles] = useState<GeneratedArticle[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addMessage = useCallback((content: string, type: 'user' | 'bot' | 'system' = 'bot') => {
    const message: Message = {
      id: Date.now().toString() + Math.random(),
      type,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, message])
  }, [])

  const startWebsiteAnalysis = useCallback(async (url: string) => {
    setIsAnalyzing(true)
    setWebsiteUrl(url)
    setError(null)

    // Add analysis start message
    addMessage(`seobot: ${extractDomain(url)} is on board`)

    try {
      // Call analyze endpoint
      const response: AnalyzeResponse = await apiClient.analyzeWebsite(url)

      // Store session_id, research_data, and plan
      setSessionId(response.session_id)
      setResearchData(response.research_data)
      setPlanItems(response.plan)

      // Map response to WebsiteData format
      const mappedData = mapAnalyzeResponseToWebsiteData(response, url)
      setWebsiteData(mappedData)

      setIsAnalyzing(false)
      setAnalysisComplete(true)
      setIsTyping(false)

      // Add analysis complete messages with delays
      const addMessageWithDelay = (messageContent: string, delay: number) => {
        setTimeout(() => {
          addMessage(messageContent)
        }, delay)
      }

      addMessageWithDelay(`seobot: Ok, I've gone through your home and about pages to get a feel for your site`, 0)
      addMessageWithDelay(`seobot: ${mappedData.about}`, 500)
      addMessageWithDelay(`seobot: ${mappedData.blogFocus || 'For blog content, you\'d want to focus on topics that align with your website\'s purpose and audience.'}`, 1000)
      addMessageWithDelay(`seobot: Your headlines are ready`, 1500)
      addMessageWithDelay(`seobot: Review your website data and proposed headlines. Tell me in chat what to adjust, or click "Proceed" if satisfied`, 2000)
    } catch (err) {
      setIsAnalyzing(false)
      setIsTyping(false)
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze website'
      setError(errorMessage)
      addMessage(`seobot: Error - ${errorMessage}. Please try again.`)
    }
  }, [addMessage])

  const handleProceed = useCallback(async () => {
    if (!analysisComplete || !sessionId || !researchData || planItems.length === 0) {
      addMessage('seobot: Error - Analysis data is missing. Please analyze your website first.')
      return
    }

    setIsGenerating(true)
    setError(null)
    addMessage(`seobot: Starting implementation... I'll begin creating SEO-optimized content for your website.`)

    const articles: GeneratedArticle[] = []

    try {
      // Generate article for each plan item
      for (let i = 0; i < planItems.length; i++) {
        const planItem = planItems[i]
        
        // Prepare generate request payload
        const generateRequest: GenerateRequest = {
          session_id: sessionId,
          topic: planItem.title,
          keywords: [...planItem.lsi_keywords, planItem.main_keyword],
          word_count: planItem.word_count,
          research_data: researchData,
        }

        addMessage(`seobot: Generating article ${i + 1} of ${planItems.length}: "${planItem.title}"...`)

        try {
          const response = await apiClient.generateArticle(generateRequest)
          
          articles.push({
            title: planItem.title,
            article: response.article,
            keywords: generateRequest.keywords,
            word_count: planItem.word_count,
          })

          addMessage(`seobot: ✓ Article "${planItem.title}" generated successfully`)
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to generate article'
          addMessage(`seobot: ✗ Error generating "${planItem.title}": ${errorMessage}`)
        }
      }

      setGeneratedArticles(articles)
      
      if (articles.length > 0) {
        addMessage(`seobot: All articles generated successfully! ${articles.length} article(s) ready.`)
      } else {
        addMessage('seobot: No articles were generated. Please try again.')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate articles'
      setError(errorMessage)
      addMessage(`seobot: Error - ${errorMessage}`)
    } finally {
      setIsGenerating(false)
    }
  }, [analysisComplete, sessionId, researchData, planItems, addMessage])

  const sendMessage = useCallback((content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    }
    
    setMessages((prev) => [...prev, userMessage])

    // Check if message contains a URL
    const detectedUrl = extractURL(content)
    
    if (detectedUrl && !analysisComplete && !isAnalyzing) {
      // Start website analysis
      setIsTyping(true)
      startWebsiteAnalysis(detectedUrl)
      return
    }

    // If analysis is complete, handle proceed command
    if (analysisComplete && content.toLowerCase().includes('proceed')) {
      handleProceed()
      return
    }

    // For other messages after analysis, call chat endpoint
    if (analysisComplete) {
      if (!sessionId) {
        addMessage('seobot: Error - Session ID is missing. Please analyze your website first.')
        return
      }

      setIsTyping(true)
      setError(null)

      // Call chat endpoint
      const handleChatMessage = async () => {
        try {
          const chatRequest: ChatRequest = {
            session_id: sessionId,
            message: content,
          }

          const chatResponse: ChatResponse = await apiClient.chat(chatRequest)

          // Update planItems with new plan from response
          setPlanItems(chatResponse.plan)

          // Update websiteData headlines if websiteData exists
          if (websiteData) {
            const updatedHeadlines = updateHeadlinesFromPlan(chatResponse.plan)
            setWebsiteData({
              ...websiteData,
              headlines: updatedHeadlines,
            })
          }

          // Display bot's answer
          addMessage(`seobot: ${chatResponse.answer}`)
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to process chat message'
          setError(errorMessage)
          addMessage(`seobot: Error - ${errorMessage}. Please try again.`)
        } finally {
          setIsTyping(false)
        }
      }

      handleChatMessage()
      return
    }

    // Before analysis, prompt for URL
    setIsTyping(true)
    setTimeout(() => {
      addMessage("Please enter your website URL to begin the analysis.")
      setIsTyping(false)
    }, 500)
  }, [isAnalyzing, analysisComplete, sessionId, websiteData, startWebsiteAnalysis, handleProceed, addMessage])

  return {
    messages,
    isTyping,
    sendMessage,
    websiteUrl,
    isAnalyzing,
    analysisComplete,
    websiteData,
    handleProceed,
    generatedArticles,
    isGenerating,
    error,
  }
}

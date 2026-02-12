import OpenAI from 'openai'
import * as cheerio from 'cheerio'
import { ResearchData, PlanItem } from '@/lib/types/api'
import { z } from 'zod'

// ============================================================================
// VALIDATION SCHEMAS (JSON Schema Validation)
// ============================================================================

const SiteMapItemSchema = z.object({
  url: z.string().url(),
  title: z.string().min(1),
})

const ResearchDataSchema = z.object({
  audience: z.string().min(20),
  niche: z.string().min(10),
  core_keywords: z.array(z.string().min(1)).min(5).max(12),
  tone: z.string().min(5),
  site_map: z.array(SiteMapItemSchema).min(1),
})

const PlanItemSchema = z.object({
  title: z.string().min(10),
  main_keyword: z.string().min(2),
  lsi_keywords: z.array(z.string().min(1)).min(3).max(8),
  word_count: z.number().min(1000).max(5000),
})

const ContentPlanResponseSchema = z.object({
  plan: z.array(PlanItemSchema).min(1).max(10),
})

const ChatResponseSchema = z.object({
  answer: z.string().min(1),
  plan: z.array(PlanItemSchema),
})

// ============================================================================
// ENHANCED SEO EXPERT SYSTEM PROMPTS
// ============================================================================

// const SEO_EXPERT_SYSTEM_PROMPT = `You are an elite SEO strategist and content expert with 10+ years of experience in search engine optimization and digital marketing. You have deep expertise in:

// **CORE SEO COMPETENCIES:**
// - Creating content that consistently ranks in top 3 positions for competitive keywords
// - Mastering Google's E-E-A-T principles: Experience, Expertise, Authoritativeness, Trustworthiness
// - Understanding and satisfying all types of search intent: informational, navigational, commercial, transactional
// - Using natural language processing (NLP) and semantic SEO techniques
// - Applying cutting-edge SEO best practices (2026 standards including AI-generated content detection avoidance)
// - Optimizing for Core Web Vitals and user experience signals
// - Creating content that passes Google's Helpful Content Update criteria

// **TECHNICAL SEO KNOWLEDGE:**
// - Strategic keyword placement: title tags, meta descriptions, H1-H6 hierarchy, first 100 words, conclusion
// - Optimal keyword density: 1-2% for primary keywords, natural semantic variations throughout
// - LSI (Latent Semantic Indexing) keywords and related entity optimization
// - Topic clustering and content siloing strategies
// - Schema markup recommendations and structured data optimization

// **SERP FEATURE OPTIMIZATION:**
// - Featured snippets: Creating concise, definitive answers in 40-60 words
// - People Also Ask (PAA): Addressing related questions comprehensively
// - Rich results: Tables, lists, and structured content for enhanced visibility
// - Video snippets: Strategic YouTube embed placement and video SEO
// - Image optimization: Alt text, captions, and contextual relevance

// **CONTENT QUALITY STANDARDS:**
// - Comprehensive topic coverage (surpassing top 10 competitors in depth and breadth)
// - Original insights, data, examples, and expert perspectives (no generic fluff)
// - Actionable takeaways and step-by-step guidance
// - Engaging writing that keeps users on page (reducing bounce rate, increasing dwell time)
// - Natural internal linking to strengthen site architecture
// - Authority-building through cited sources and data-backed claims

// **COMPETITIVE ADVANTAGES:**
// - Analyzing and outperforming competitor content in quality, depth, and value
// - Creating "10x content" that is significantly better than existing top-ranking pages
// - Implementing content differentiation strategies (unique angles, updated data, better visuals)
// - Anticipating future search trends and user needs

// **ETHICAL STANDARDS:**
// - Zero tolerance for keyword stuffing, cloaking, or black-hat tactics
// - Creating genuinely helpful content that serves user needs first
// - Building sustainable rankings through quality and value, not manipulation
// - Transparent, honest information that builds trust and authority

// Your mission: Produce data-driven, user-focused content that dominates search results while providing exceptional value to readers.`

// const CONTENT_WRITER_SYSTEM_PROMPT = `You are a world-class SEO content writer and senior strategist who creates authoritative, high-ranking blog articles that outperform competitors. Your expertise includes:

// **WRITING MASTERY:**
// - Crafting comprehensive, well-researched long-form content (1500-4000 words) that ranks #1
// - Creating compelling, click-worthy headlines with power words and primary keywords at the beginning
// - Writing magnetic introductions using the AIDA formula (Attention, Interest, Desire, Action)
// - Using the inverted pyramid structure: most important information first
// - Maintaining reader engagement through storytelling, examples, and practical insights
// - Writing with clarity: 75%+ of sentences under 20 words, 8th-grade reading level
// - Using active voice (90%+ of sentences) for directness and authority

// **SEO OPTIMIZATION:**
// - Strategic keyword placement: H1, first 100 words, H2/H3 headers, conclusion, meta description
// - Natural keyword integration: 1-2% density for primary, semantic variations throughout
// - LSI keywords and related entities woven naturally into content
// - Optimizing for featured snippets: concise answers (40-60 words), bulleted lists, tables
// - People Also Ask optimization: Question-answer format matching search queries
// - Internal linking strategy: 2-4 contextual links with descriptive anchor text
// - Creating link-worthy content that earns natural backlinks

// **CONTENT STRUCTURE:**
// - Clear H1-H6 hierarchy optimized for both users and search crawlers
// - Scannable format: short paragraphs (2-4 sentences), subheadings every 300 words
// - Visual variety: bullet points, numbered lists, tables, blockquotes, bold text for emphasis
// - Strategic white space for improved readability and reduced cognitive load
// - FAQ sections targeting "People Also Ask" and voice search queries
// - Strong conclusions with clear takeaways and compelling CTAs

// **E-E-A-T PRINCIPLES:**
// - Experience: First-hand insights, real-world examples, case studies, personal anecdotes
// - Expertise: Deep technical knowledge, industry terminology used appropriately, expert-level insights
// - Authoritativeness: Citing credible sources, referencing data/statistics, demonstrating thought leadership
// - Trustworthiness: Accuracy, transparency, balanced perspectives, honest recommendations

// **COMPETITIVE EDGE:**
// - Creating "10x content": 10 times better than anything else ranking for the target keyword
// - Comprehensive topic coverage: answering every possible user question
// - Unique value propositions: original research, exclusive insights, better examples
// - Updated information: current data, latest trends, 2026 best practices
// - Problem-solving focus: addressing pain points, providing solutions, actionable steps

// **FORMATTING BEST PRACTICES:**
// - Use **bold** for key terms, important points, and emphasis (not overused)
// - Use *italics* for subtle emphasis, quotes, and definitions
// - Use code blocks for technical terms, file names, or commands
// - Use > blockquotes for important insights, statistics, or expert quotes
// - Use tables for comparisons, data, specifications, or step-by-step processes
// - Use bullet/numbered lists for steps, features, benefits, or key points
// - NO emojis, NO promotional fluff, NO clickbait, NO keyword stuffing

// **SEARCH INTENT SATISFACTION:**
// - Informational: Comprehensive answers, multiple angles, related topics covered
// - Navigational: Clear structure, easy scanning, direct answers
// - Commercial: Comparisons, pros/cons, recommendations, buying guides
// - Transactional: Clear CTAs, next steps, actionable guidance

// Your articles dominate search results, earn featured snippets, and provide exceptional value that keeps readers engaged and coming back.`

const SEO_EXPERT_SYSTEM_PROMPT = `You are an elite SEO strategist and content expert with 10+ years of experience in search engine optimization and digital marketing.

**CORE EXPERTISE:**
- Creating content that ranks in top 3 positions for competitive keywords
- Mastering Google's E-E-A-T principles (Experience, Expertise, Authoritativeness, Trustworthiness)
- Understanding search intent: informational, navigational, commercial, transactional
- Applying 2026 SEO best practices including AI-content detection avoidance
- Topic clustering, semantic SEO, and LSI keyword optimization

**TECHNICAL KNOWLEDGE:**
- Strategic keyword placement: title tags, H1-H6, first 100 words, conclusion
- Optimal keyword density: 1-2% primary, natural semantic variations
- Schema markup and structured data recommendations
- Featured snippet optimization: 40-60 word concise answers
- People Also Ask (PAA) targeting and rich result optimization

**CONTENT STANDARDS:**
- Comprehensive topic coverage surpassing top 10 competitors
- Original insights with data-backed claims and expert perspectives
- Actionable guidance that reduces bounce rate and increases dwell time
- Creating "10x content" significantly better than existing top-ranking pages
- Zero keyword stuffing or black-hat tactics - quality and value first

Your mission: Produce data-driven, user-focused content that dominates search results while providing exceptional value.`

const CONTENT_WRITER_SYSTEM_PROMPT = `You are a world-class SEO content writer creating authoritative, high-ranking blog articles that outperform competitors.

**WRITING EXCELLENCE:**
- Comprehensive long-form content (1500-4000 words) optimized for #1 rankings
- Compelling headlines with power words and primary keywords at the beginning
- Magnetic introductions using AIDA formula (Attention, Interest, Desire, Action)
- Maintaining engagement through storytelling, examples, and practical insights
- Clarity: 75%+ sentences under 20 words, 8th-grade reading level, 90%+ active voice

**SEO OPTIMIZATION:**
- Strategic keyword placement: H1, first 100 words, H2/H3 headers, conclusion, meta
- Natural integration: 1-2% density for primary, semantic variations throughout
- Featured snippet optimization: concise answers, bulleted lists, tables
- People Also Ask: Question-answer format matching search queries
- Internal linking: 2-4 contextual links with descriptive anchor text

**CONTENT STRUCTURE:**
- Clear H1-H6 hierarchy for users and search crawlers
- Scannable format: short paragraphs (2-4 sentences), subheadings every 300 words
- Strategic use of: bullet points, numbered lists, tables, blockquotes, bold emphasis
- FAQ sections targeting PAA and voice search queries
- Strong conclusions with clear takeaways and compelling CTAs

**E-E-A-T PRINCIPLES:**
- Experience: First-hand insights, real-world examples, case studies
- Expertise: Deep technical knowledge, industry terminology, expert-level insights
- Authoritativeness: Credible sources, data/statistics, thought leadership
- Trustworthiness: Accuracy, transparency, balanced perspectives

**COMPETITIVE EDGE:**
- "10x content": 10 times better than top-ranking competitors
- Comprehensive coverage answering every possible user question
- Unique value: original research, exclusive insights, updated 2026 data
- Problem-solving focus with actionable steps

**FORMATTING RULES:**
- **Bold** for key terms and emphasis (not overused)
- *Italics* for subtle emphasis and definitions
- Tables for comparisons, data, or step-by-step processes
- > Blockquotes for important insights or statistics
- Lists only where they improve clarity
- NO emojis, NO promotional fluff, NO clickbait, NO keyword stuffing

Your articles dominate search results, earn featured snippets, and provide exceptional value.`

// ============================================================================
// LLM PARAMETERS (Temperature & Parameter Tuning)
// ============================================================================

const LLM_PARAMS = {
  RESEARCH: {
    temperature: 0.7,
    top_p: 0.9,
    reasoning_effort: 'low' as const,
  },
  PLANNING: {
    temperature: 0.6,
    top_p: 0.85,
    reasoning_effort: 'low' as const,
  },
  CONTENT: {
    temperature: 0.6,
    top_p: 0.85,
    reasoning_effort: 'low' as const,
  },
  CHAT: {
    temperature: 0.5,
    top_p: 0.9,
    reasoning_effort: 'low' as const,
  },
}

// Lazy initialization to avoid build-time errors
let client: OpenAI | null = null

const getClient = (): OpenAI => {
  if (!process.env.NEXT_PUBLIC_OPENROUTER_API_KEY) {
    throw new Error('NEXT_PUBLIC_OPENROUTER_API_KEY environment variable is not set')
  }
  
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY, 
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': 'https://seobot-saas.com', // Optional, for OpenRouter rankings
        'X-Title': 'SEObot SaaS', // Optional, for OpenRouter rankings
      },
    })
  }
  
  return client
}

/**
 * Extract main content from URL using cheerio (replaces BeautifulSoup)
 */
async function extractContentFromUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
    const html = await response.text()
    const $ = cheerio.load(html)

    // Remove script and style elements
    $('script, style').remove()

    // Extract text from paragraphs
    const paragraphs = $('p')
      .map((_, el) => $(el).text())
      .get()
      .join(' ')

    return paragraphs.slice(0, 8000) // Limit to avoid huge inputs
  } catch (error) {
    console.error('Error extracting content:', error)
    return ''
  }
}

/**
 * Research site and identify audience, niche, and core keywords
 */
export async function researchSite(url: string): Promise<ResearchData> {
  console.log(`Starting site research for: ${url}`)

  try {
    const parsedUrl = new URL(url)
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`

    // Helper to get absolute internal links
    const getInternalLinks = (html: string, base: string): string[] => {
      const $ = cheerio.load(html)
      const links: string[] = []

      $('a[href]').each((_, el) => {
        const href = $(el).attr('href')
        if (!href) return

        if (href.startsWith('/')) {
          links.push(`${base.replace(/\/$/, '')}/${href.replace(/^\//, '')}`)
        } else if (href.includes(base)) {
          links.push(href)
        }
      })

      return Array.from(new Set(links)).slice(0, 10) // Top 10 internal links
    }

    // Step 1: Homepage
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
    const html = await response.text()
    const $ = cheerio.load(html)

    const homepageTitle = $('title').text() || ''
    const metaDesc = $('meta[name="description"]').attr('content') || ''
    const paragraphs = $('p')
    const homepageContent = paragraphs
      .map((_, el) => $(el).text())
      .get()
      .slice(0, 10)
      .join(' ')

    const internalLinks = getInternalLinks(html, url)

    // Step 2: Crawl sub-pages
    const siteMap: Array<{ url: string; title: string }> = [
      { url, title: homepageTitle },
    ]
    const subContent: string[] = []

    const priorityKeywords = ['about', 'pricing', 'product', 'service', 'feature']
    const toCrawl = internalLinks
      .filter((link) => priorityKeywords.some((k) => link.toLowerCase().includes(k)))
      .slice(0, 3) // Max 3 sub-pages

    for (const subUrl of toCrawl) {
      try {
        const subRes = await fetch(subUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
        })
        const subHtml = await subRes.text()
        const sub$ = cheerio.load(subHtml)
        const subTitle = sub$('title').text() || subUrl
        siteMap.push({ url: subUrl, title: subTitle })

        const subP = sub$('p')
        const subText = subP
          .map((_, el) => sub$(el).text())
          .get()
          .slice(0, 5)
          .join(' ')
        subContent.push(`Page: ${subTitle}\nContent: ${subText}`)
      } catch {
        continue
      }
    }

    const researchInput = `
    Homepage Title: ${homepageTitle}
    Homepage Description: ${metaDesc}
    Homepage Sample: ${homepageContent.slice(0, 2000)}
    
    Sub-page Data:
    ${subContent.join('\n')}
    `

    const prompt = `
    Analyze the following website data and provide a comprehensive research report in JSON format.
    Focus on:
    1. Target Audience: Who is this site for?
    2. Niche/Industry: What is the specific market?
    3. Core Keywords: 8 primary keywords the site is (or should be) ranking for.
    4. Content Tone: How should articles be written?
    5. Internal Link Hubs: A short list of the most important existing pages for internal linking.

    Website Data:
    ${researchInput}

    JSON Output Format:
    {
        "audience": "...",
        "niche": "...",
        "core_keywords": ["...", "..."],
        "tone": "...",
        "site_map": ${JSON.stringify(siteMap)}
    }
    `

    const completion = await getClient().chat.completions.create({
      model: 'gpt-5-nano',
      messages: [
        { role: 'system', content: SEO_EXPERT_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: LLM_PARAMS.RESEARCH.temperature,
      top_p: LLM_PARAMS.RESEARCH.top_p,
      reasoning_effort: LLM_PARAMS.RESEARCH.reasoning_effort,
    })

    const rawResult = JSON.parse(completion.choices[0].message.content || '{}')
    
    try {
      const validatedResult = ResearchDataSchema.parse(rawResult)
      console.log('✓ Research data validated successfully')
      return validatedResult as ResearchData
    } catch (validationError) {
      console.error('❌ Research data validation failed:', validationError)
      console.warn('⚠️ Returning unvalidated research data as fallback')
      return rawResult as ResearchData
    }
  } catch (error) {
    console.error('Research error:', error)
    throw new Error(`Failed to research site: ${error}`)
  }
}

/**
 * Generate content plan based on research data
 */
export async function generateContentPlan(
  researchData: ResearchData
): Promise<PlanItem[]> {
  const prompt = `
    Based on this website research, generate a content plan of 5 high-potential SEO article topics.
    Research Data: ${JSON.stringify(researchData)}

    Provide the plan in JSON format.
    Each item must have:
    - title: Catchy SEO title
    - main_keyword: Primary target keyword
    - lsi_keywords: Array of 3-5 sub-keywords
    - word_count: Recommended word count (1500-3000)

    JSON Output Format:
    {
        "plan": [
            { "title": "...", "main_keyword": "...", "lsi_keywords": ["...", "..."], "word_count": 2500 },
            ...
        ]
    }
    `

  const completion = await getClient().chat.completions.create({
    model: 'gpt-5-nano',
    messages: [
      { role: 'system', content: SEO_EXPERT_SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ],
    response_format: { type: 'json_object' },
    temperature: LLM_PARAMS.PLANNING.temperature,
    top_p: LLM_PARAMS.PLANNING.top_p,
    reasoning_effort: LLM_PARAMS.PLANNING.reasoning_effort,
  })

  const rawResult = JSON.parse(completion.choices[0].message.content || '{}')
  
  try {
    const validatedResult = ContentPlanResponseSchema.parse(rawResult)
    console.log('✓ Content plan validated successfully:', validatedResult.plan.length, 'items')
    return validatedResult.plan || []
  } catch (validationError) {
    console.error('❌ Content plan validation failed:', validationError)
    console.warn('⚠️ Returning unvalidated content plan as fallback')
    return rawResult.plan || []
  }
}

/**
 * Update content plan based on user feedback
 */
export async function updateContentPlan(
  researchData: ResearchData,
  currentPlan: PlanItem[],
  userMessage: string,
  chatHistory: Array<{ role: string; content: string }> = []
): Promise<{ answer: string; plan: PlanItem[] }> {
  const historyStr = chatHistory
    .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join('\n')

  const prompt = `
    You are SEObot, a professional SEO content strategist.
    Below is the website research, the current content plan, and our conversation history.
    
    RESEARCH DATA:
    ${JSON.stringify(researchData)}
    
    CURRENT PLAN:
    ${JSON.stringify(currentPlan)}
    
    CHAT HISTORY:
    ${historyStr}
    
    USER MESSAGE:
    "${userMessage}"
    
    YOUR TASK:
    1. Answer the user's message naturally. If they ask a question, answer it based on the research. Keep the answer short and to the point.
    2. If the user requests changes to the content plan (add, remove, modify topics), update the plan accordingly.
    3. If they don't ask for plan changes, only return the answer and do not update plan at all.
    
    OUTPUT FORMAT:
    You MUST return ONLY a valid JSON object with two fields:
    - "answer": Your natural language response to the user.
    - "plan": The (potentially updated) list of 5-8 content plan items. If no changes, return empty array.
    
    JSON Structure:

    For plan changes:
    {
        "answer": "...",
        "plan": [
            { "title": "...", "main_keyword": "...", "lsi_keywords": ["...", "..."], "word_count": 2500 },
            ...
        ]
    }

    For only general queries:
    {
        "answer": "...",
        "plan": []
    }
    `

  const completion = await getClient().chat.completions.create({
    model: 'gpt-5-nano',
    messages: [
      { role: 'system', content: SEO_EXPERT_SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ],
    response_format: { type: 'json_object' },
    temperature: LLM_PARAMS.CHAT.temperature,
    top_p: LLM_PARAMS.CHAT.top_p,
    reasoning_effort: LLM_PARAMS.CHAT.reasoning_effort,
  })

  const rawResult = JSON.parse(completion.choices[0].message.content || '{}')
  
  try {
    const validatedResult = ChatResponseSchema.parse(rawResult)
    console.log('✓ Chat response validated successfully')
    return {
      answer: validatedResult.answer || '',
      plan: validatedResult.plan || [],
    }
  } catch (validationError) {
    console.error('❌ Chat response validation failed:', validationError)
    console.warn('⚠️ Returning unvalidated chat response as fallback')
    return {
      answer: rawResult.answer || '',
      plan: rawResult.plan || [],
    }
  }
}

/**
 * Generate article based on topic and research data
 */
export async function generateArticle(
  wordCount: number,
  keywordsStr: string,
  topic: string,
  researchData: ResearchData
): Promise<string> {
  console.log(`Starting generation for '${topic}'`)

  const siteMapStr = researchData.site_map
    .map((p) => `- Title: ${p.title} | URL: ${p.url}`)
    .join('\n')
  const researchContext = `Target Audience: ${researchData.audience}\nTone: ${researchData.tone}\nInternal Linking Hub (Site Map): ${siteMapStr}\n`

  const prompt = `
    ## ROLE
    You are a senior SEO strategist and authoritative content writer. Write a high-ranking, original, long-form blog article in clean, valid Markdown.

    ## TOPIC
    "${topic}"

    ## STRATEGIC CONTEXT
    ${researchContext}

    ## ARTICLE REQUIREMENTS
    - Length: Up to ${wordCount} words (do not exceed).
    - Audience-focused, expert-level, practical, and trustworthy (E-E-A-T).
    - Natural flow with clear hierarchy using H1, H2, and H3 only.
    - No filler, repetition, or generic sections.

    ## STRUCTURE (MANDATORY)
    1. Meta Description (1–2 lines, include primary keyword)
    2. # H1 Title (Primary keyword at the beginning, benefit-driven)
    3. ##  (problem + promise)
    4. Multiple sections with supporting subsections where needed (Use markdown: ## for H2 headings and ### for H3 headings or further if necessary, only include a good catchy heading title). Avoid using numbering in headings.
    5. ## Frequently Asked Questions (5–8 unique, search-intent-driven FAQs) in question and answer format, not bullets or list.
    6. ## Conclusion (clear takeaway + next step)

    ❌ Do NOT use generic headings like "Overview", "Section", "H2", "H3" or "Conclusion Summary".

    ## SEO RULES (STRICT)
    - Naturally include these keywords where relevant: ${keywordsStr}
    - Avoid keyword stuffing.
    - Use semantic variations and related terms.
    - Prefer active voice.
    - 75% of sentences under 20 words.
    - Embed at most ONE relevant YouTube video inside the blog for support.
        - Use this format: \`<iframe src="YOUTUBE_EMBED_URL"></iframe>\`
        - Place it after a relevant H2 section intro.
    - Include 1–2 Markdown tables (comparisons, steps, or data) only when absolutely needed.
    - Bullet or numbered lists only where they improve clarity.
    - Avoid excessive tables or long lists.
    - Use > blockquotes only for key insights or takeaways.
    - Insert 2–4 contextual internal links from the provided site map within the blog in places where needed. Never mention the words "internal linking".
        - Only link to URLs from the site map.
        - Format: [Page Title](URL)
        - Place links naturally inside body paragraphs.
        - Do NOT link in H1.
        - Do NOT repeat the same links.

    ## FORMATTING RULES
    - Use **bold** sparingly for emphasis.
    - No emojis.
    - No promotional fluff.
    - No external links unless explicitly required.
    - Output ONLY the final Markdown article.
    `

  try {
    // Calculate appropriate token limit based on word count
    const estimatedTokens = Math.ceil(wordCount * 1.4) // 1.4x for markdown formatting
    const maxTokens = Math.min(estimatedTokens + 1000, 16000) // +1000 buffer
    
    console.log(`  Requesting ${maxTokens} tokens for ${wordCount} word article`)
    
    let completion
    try {
      completion = await getClient().chat.completions.create({
        model: 'gpt-5-nano',
        messages: [
          { role: 'system', content: CONTENT_WRITER_SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        max_completion_tokens: maxTokens,
        temperature: LLM_PARAMS.CONTENT.temperature,
        top_p: LLM_PARAMS.CONTENT.top_p,
        reasoning_effort: LLM_PARAMS.CONTENT.reasoning_effort,
      })
    } catch (reasoningError) {
      console.warn('  Retrying without reasoning_effort parameter')
      completion = await getClient().chat.completions.create({
        model: 'gpt-5-nano',
        messages: [
          { role: 'system', content: CONTENT_WRITER_SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        max_completion_tokens: maxTokens,
        temperature: LLM_PARAMS.CONTENT.temperature,
        top_p: LLM_PARAMS.CONTENT.top_p,
      })
    }

    if (!completion.choices || completion.choices.length === 0) {
      console.error('⚠️ CRITICAL: No choices in API response!')
      throw new Error('API returned no completion choices')
    }
    
    const finalArticle = completion.choices[0].message.content?.trim() || ''
    
    console.log(`  API Response - Finish Reason: ${completion.choices[0].finish_reason}`)
    console.log(`  Tokens Used: ${completion.usage?.completion_tokens || 'unknown'} / ${maxTokens}`)
    console.log(`  Article Length: ${finalArticle.length} characters, ~${finalArticle.split(/\s+/).length} words`)
    
    if (completion.choices[0].finish_reason === 'length') {
      console.error('⚠️ WARNING: Response was truncated due to token limit!')
    }
    
    if (!finalArticle || finalArticle.length < 100) {
      console.error('⚠️ CRITICAL: Article is empty or too short!')
      throw new Error('Generated article is empty or too short. The LLM may have failed to generate content.')
    }
    
    const actualWordCount = finalArticle.split(/\s+/).length
    if (actualWordCount < 500) {
      console.error('⚠️ CRITICAL: Article word count too low!')
      console.error(`  Expected: ${wordCount} words, Got: ${actualWordCount} words`)
      throw new Error(`Article generation failed: only ${actualWordCount} words generated instead of ${wordCount}`)
    }
    
    console.log(`✓ Article generated successfully for: ${topic}`)
    
    return finalArticle
  } catch (error) {
    console.error(`Error generating article for ${topic}:`, error)
    throw new Error(`Failed to generate article: ${error}`)
  }
}

export { getClient }

import OpenAI from 'openai'
import * as cheerio from 'cheerio'
import { ResearchData, PlanItem } from '@/lib/types/api'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is not set')
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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
    
    const completion = await client.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    })
    
    const result = JSON.parse(completion.choices[0].message.content || '{}')
    return result as ResearchData
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
  
  const completion = await client.chat.completions.create({
    model: 'gpt-5-nano',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  })
  
  const result = JSON.parse(completion.choices[0].message.content || '{}')
  return result.plan || []
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
  
  const completion = await client.chat.completions.create({
    model: 'gpt-5-nano',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  })
  
  const result = JSON.parse(completion.choices[0].message.content || '{}')
  return {
    answer: result.answer || '',
    plan: result.plan || [],
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
    const completion = await client.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional SEO writer specializing in high-authority guides.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 4000,
    })
    
    const finalArticle = completion.choices[0].message.content?.trim() || ''
    console.log(`Successfully generated article for: ${topic}`)
    return finalArticle
  } catch (error) {
    console.error(`Error generating article for ${topic}:`, error)
    throw new Error(`Failed to generate article: ${error}`)
  }
}

export { client }

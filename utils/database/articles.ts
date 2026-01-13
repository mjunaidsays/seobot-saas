import { createClient } from '@/utils/supabase/server'

export interface ArticleData {
  id: string
  project_id: string | null
  user_id: string
  topic: string
  content: string
  keywords: string[] | null
  word_count: number | null
  status: string
  created_at: string
}

export async function createArticle(
  projectId: string | null,
  userId: string,
  topic: string,
  content: string,
  keywords: string[],
  wordCount: number
): Promise<ArticleData | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('articles')
    .insert({
      project_id: projectId,
      user_id: userId,
      topic,
      content,
      keywords,
      word_count: wordCount,
      status: 'completed',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating article:', error)
    // Check if error is about missing table
    if (error.code === 'PGRST205' || error.message?.includes("Could not find the table")) {
      throw new Error('Database migration required. The articles table does not exist. Please run the migration in Supabase Dashboard: Go to SQL Editor → Run the script from supabase/migrations/20250101000000_seobot_schema.sql')
    }
    return null
  }

  return data as ArticleData | null
}

export async function getArticlesByProject(projectId: string): Promise<ArticleData[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching articles:', error)
    // Check if error is about missing table
    if (error.code === 'PGRST205' || error.message?.includes("Could not find the table")) {
      throw new Error('Database migration required. The articles table does not exist. Please run the migration in Supabase Dashboard: Go to SQL Editor → Run the script from supabase/migrations/20250101000000_seobot_schema.sql')
    }
    return []
  }

  return (data || []) as ArticleData[]
}

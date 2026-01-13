import { createClient } from '@/utils/supabase/server'
import { ResearchData, PlanItem } from '@/lib/types/api'
import type { Database } from '@/types_db'

type ProjectsInsert = Database['public']['Tables']['projects']['Insert']

export interface ProjectData {
  id: string
  user_id: string
  url: string
  research_data: ResearchData | null
  plan: PlanItem[]
  chat_history: Array<{ role: string; content: string }>
  created_at: string
  updated_at: string
}

export async function getProjectByUrl(userId: string, url: string): Promise<ProjectData | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('url', url)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('Error fetching project:', error)
    // Check if error is about missing table
    if (error.code === 'PGRST205' || error.message?.includes("Could not find the table")) {
      throw new Error('Database migration required. The projects table does not exist. Please run the migration in Supabase Dashboard: Go to SQL Editor → Run the script from supabase/migrations/20250101000000_seobot_schema.sql')
    }
    return null
  }

  return data as unknown as ProjectData | null
}

export async function createProject(
  userId: string,
  url: string,
  researchData: ResearchData,
  plan: PlanItem[]
): Promise<ProjectData | null> {
  const supabase = createClient()
  const insertData: ProjectsInsert = {
    user_id: userId,
    url,
    research_data: researchData as any,
    plan: plan as any,
    chat_history: [] as any,
  }
  const { data, error } = await supabase
    .from('projects')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    console.error('Error creating project:', error)
    // Check if error is about missing table
    if (error.code === 'PGRST205' || error.message?.includes("Could not find the table")) {
      throw new Error('Database migration required. The projects table does not exist. Please run the migration in Supabase Dashboard: Go to SQL Editor → Run the script from supabase/migrations/20250101000000_seobot_schema.sql')
    }
    return null
  }

  return data as unknown as ProjectData | null
}

export async function updateProject(
  projectId: string,
  updates: {
    research_data?: ResearchData
    plan?: PlanItem[]
    chat_history?: Array<{ role: string; content: string }>
  }
): Promise<ProjectData | null> {
  const supabase = createClient()
  const updateData: Partial<Database['public']['Tables']['projects']['Update']> = {
    ...(updates.research_data !== undefined && { research_data: updates.research_data as any }),
    ...(updates.plan !== undefined && { plan: updates.plan as any }),
    ...(updates.chat_history !== undefined && { chat_history: updates.chat_history as any }),
  }
  const { data, error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', projectId)
    .select()
    .single()

  if (error) {
    console.error('Error updating project:', error)
    // Check if error is about missing table
    if (error.code === 'PGRST205' || error.message?.includes("Could not find the table")) {
      throw new Error('Database migration required. The projects table does not exist. Please run the migration in Supabase Dashboard: Go to SQL Editor → Run the script from supabase/migrations/20250101000000_seobot_schema.sql')
    }
    return null
  }

  return data as unknown as ProjectData | null
}

export async function getProject(projectId: string): Promise<ProjectData | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .maybeSingle()

  if (error) {
    console.error('Error fetching project:', error)
    // Check if error is about missing table
    if (error.code === 'PGRST205' || error.message?.includes("Could not find the table")) {
      throw new Error('Database migration required. The projects table does not exist. Please run the migration in Supabase Dashboard: Go to SQL Editor → Run the script from supabase/migrations/20250101000000_seobot_schema.sql')
    }
    return null
  }

  return data as unknown as ProjectData | null
}

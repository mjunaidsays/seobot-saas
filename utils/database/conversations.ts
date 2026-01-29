import { createClient } from '@/utils/supabase/client'
import { Message } from '@/app/app/components/ChatMessage'
import { WebsiteData } from '@/app/app/types/website'
import { ResearchData, PlanItem } from '@/lib/types/api'
import { Json } from '@/types_db'

export interface ConversationProject {
  id: string
  user_id: string
  url: string
  research_data: ResearchData | null
  plan: PlanItem[] | null
  chat_history: Message[] | null
  created_at: string
  updated_at: string
}

/**
 * Save or update a conversation/project in Supabase
 */
export async function saveConversation(
  userId: string,
  sessionId: string,
  url: string,
  messages: Message[],
  websiteData: WebsiteData | null,
  researchData: ResearchData | null,
  plan: PlanItem[]
): Promise<ConversationProject | null> {
  try {
    const supabase = createClient()

    // Check if project already exists for this user and URL
    const { data: existingProject } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .eq('url', url)
      .single()

    const projectData = {
      user_id: userId,
      url,
      research_data: (researchData as unknown) as Json | null,
      plan: (plan as unknown) as Json,
      chat_history: (messages as unknown) as Json,
      updated_at: new Date().toISOString(),
    }

    let result

    if (existingProject) {
      // Update existing project
      const { data, error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', existingProject.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating project:', error)
        return null
      }

      result = data
    } else {
      // Create new project
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          id: sessionId, // Use session_id as project ID
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating project:', error)
        return null
      }

      result = data
    }

    return result as ConversationProject
  } catch (error) {
    console.error('Error saving conversation:', error)
    return null
  }
}

/**
 * Load a conversation/project by project ID
 */
export async function loadConversation(
  userId: string,
  projectId: string
): Promise<ConversationProject | null> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error loading conversation:', error)
      return null
    }

    return data as ConversationProject
  } catch (error) {
    console.error('Error loading conversation:', error)
    return null
  }
}

/**
 * List all conversations/projects for a user
 */
export async function listConversations(userId: string): Promise<ConversationProject[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error listing conversations:', error)
      return []
    }

    return (data || []) as ConversationProject[]
  } catch (error) {
    console.error('Error listing conversations:', error)
    return []
  }
}

/**
 * Delete a conversation/project
 */
export async function deleteConversation(
  userId: string,
  projectId: string
): Promise<boolean> {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting conversation:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting conversation:', error)
    return false
  }
}

/**
 * Create a new conversation/project
 */
export async function createNewConversation(
  userId: string,
  url: string
): Promise<ConversationProject | null> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        url,
        research_data: null as Json | null,
        plan: null as Json | null,
        chat_history: ([] as unknown) as Json,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating new conversation:', error)
      return null
    }

    return data as ConversationProject
  } catch (error) {
    console.error('Error creating new conversation:', error)
    return null
  }
}

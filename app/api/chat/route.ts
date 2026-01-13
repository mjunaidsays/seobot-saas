import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { updateContentPlan } from '@/utils/openai/client'
import { getProject, updateProject } from '@/utils/database/projects'
import { PlanItem } from '@/lib/types/api'

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log('🔍 /api/chat - Auth check:', {
      hasUser: !!user,
      userId: user?.id,
      authError: authError?.message,
    })

    if (!user) {
      console.error('❌ /api/chat - Unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { session_id, message } = body

    if (!session_id || !message) {
      return NextResponse.json(
        { error: 'session_id and message are required' },
        { status: 400 }
      )
    }

    // Load project (session)
    let project
    try {
      project = await getProject(session_id)
    } catch (dbError) {
      console.error('❌ /api/chat - Database error:', dbError)
      // Check if it's a migration error
      if (dbError instanceof Error && dbError.message.includes('Database migration required')) {
        return NextResponse.json(
          {
            error: 'Database migration required',
            details: 'The projects table does not exist. Please run the migration in Supabase Dashboard.',
            instructions: 'Go to Supabase Dashboard → SQL Editor → Run the script from supabase/migrations/20250101000000_seobot_schema.sql'
          },
          { status: 500 }
        )
      }
      throw dbError
    }

    if (!project || project.user_id !== user.id) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (!project.research_data || !project.plan) {
      return NextResponse.json(
        { error: 'Project data incomplete' },
        { status: 400 }
      )
    }

    // Update content plan
    const result = await updateContentPlan(
      project.research_data,
      project.plan,
      message,
      project.chat_history
    )

    // Update chat history
    const updatedHistory = [
      ...project.chat_history,
      { role: 'user', content: message },
      { role: 'assistant', content: result.answer },
    ]

    // Update plan if it changed
    const updatedPlan = result.plan.length > 0 ? result.plan : project.plan

    // Save updated project
    try {
      await updateProject(session_id, {
        plan: updatedPlan,
        chat_history: updatedHistory,
      })
    } catch (dbError) {
      console.error('❌ /api/chat - Database error when updating project:', dbError)
      // Check if it's a migration error
      if (dbError instanceof Error && dbError.message.includes('Database migration required')) {
        return NextResponse.json(
          {
            error: 'Database migration required',
            details: 'The projects table does not exist. Please run the migration in Supabase Dashboard.',
            instructions: 'Go to Supabase Dashboard → SQL Editor → Run the script from supabase/migrations/20250101000000_seobot_schema.sql'
          },
          { status: 500 }
        )
      }
      throw dbError
    }

    return NextResponse.json({
      session_id,
      answer: result.answer,
      plan: updatedPlan,
    })
  } catch (error) {
    console.error('Error in chat endpoint:', error)
    // Check if error is about missing database table
    if (error instanceof Error && (error.message.includes('Database migration required') || error.message.includes('Could not find the table'))) {
      return NextResponse.json(
        {
          error: 'Database migration required',
          details: 'The projects table does not exist. Please run the migration in Supabase Dashboard.',
          instructions: 'Go to Supabase Dashboard → SQL Editor → Run the script from supabase/migrations/20250101000000_seobot_schema.sql'
        },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

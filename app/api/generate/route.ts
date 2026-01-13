import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { generateArticle } from '@/utils/openai/client'
import { getProject } from '@/utils/database/projects'
import { createArticle } from '@/utils/database/articles'
import { ResearchData } from '@/lib/types/api'

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log('🔍 /api/generate - Auth check:', {
      hasUser: !!user,
      userId: user?.id,
      authError: authError?.message,
    })

    if (!user) {
      console.error('❌ /api/generate - Unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      session_id,
      topic,
      keywords,
      word_count,
      research_data,
    } = body

    if (!session_id || !topic) {
      return NextResponse.json(
        { error: 'session_id and topic are required' },
        { status: 400 }
      )
    }

    // Load project to get research data
    let effectiveResearch: ResearchData | null = null

    if (research_data) {
      effectiveResearch = research_data as ResearchData
    } else {
      let project
      try {
        project = await getProject(session_id)
      } catch (dbError) {
        console.error('❌ /api/generate - Database error when fetching project:', dbError)
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
      if (project && project.user_id === user.id) {
        effectiveResearch = project.research_data
      }
    }

    if (!effectiveResearch) {
      return NextResponse.json(
        {
          error:
            'Research data not found. Please run analyze/chat first or provide it manually.',
        },
        { status: 400 }
      )
    }

    // Prepare keywords
    const keywordsList = keywords || effectiveResearch.core_keywords || []
    const keywordsStr = keywordsList.join(', ')

    // Generate article
    const article = await generateArticle(
      word_count || 1500,
      keywordsStr,
      topic,
      effectiveResearch
    )

    // Save article to database
    let project
    try {
      project = await getProject(session_id)
    } catch (dbError) {
      console.error('❌ /api/generate - Database error when fetching project for article save:', dbError)
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
    if (project && project.user_id === user.id) {
      try {
        await createArticle(
          project.id,
          user.id,
          topic,
          article,
          keywordsList,
          word_count || 1500
        )
      } catch (dbError) {
        console.error('❌ /api/generate - Database error when creating article:', dbError)
        // Check if it's a migration error (articles table might also be missing)
        if (dbError instanceof Error && dbError.message.includes('Database migration required') || dbError.message?.includes('Could not find the table')) {
          return NextResponse.json(
            {
              error: 'Database migration required',
              details: 'The articles table does not exist. Please run the migration in Supabase Dashboard.',
              instructions: 'Go to Supabase Dashboard → SQL Editor → Run the script from supabase/migrations/20250101000000_seobot_schema.sql'
            },
            { status: 500 }
          )
        }
        // Don't fail the whole request if article save fails, just log it
        console.warn('⚠️ Article generated but could not be saved to database')
      }
    }

    return NextResponse.json({ article })
  } catch (error) {
    console.error('Error in generate endpoint:', error)
    // Check if error is about missing database table
    if (error instanceof Error && (error.message.includes('Database migration required') || error.message.includes('Could not find the table'))) {
      return NextResponse.json(
        {
          error: 'Database migration required',
          details: 'The database tables do not exist. Please run the migration in Supabase Dashboard.',
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

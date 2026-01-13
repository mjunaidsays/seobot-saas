import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { researchSite, generateContentPlan } from '@/utils/openai/client'
import { getProjectByUrl, createProject } from '@/utils/database/projects'
import { ResearchData, PlanItem } from '@/lib/types/api'
// UUID generation not needed - using project.id as session_id

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    // Debug logging for auth issues
    console.log('🔍 /api/analyze - Auth check:', {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      authError: authError?.message,
      timestamp: new Date().toISOString(),
    })

    if (!user) {
      console.error('❌ /api/analyze - Unauthorized access attempt:', {
        authError: authError?.message,
        headers: {
          cookie: request.headers.get('cookie') ? 'present' : 'missing',
          authorization: request.headers.get('authorization') ? 'present' : 'missing',
        },
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✓ /api/analyze - User authenticated:', user.email)

    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    console.log('🌐 /api/analyze - Processing URL:', url)

    // Check if project already exists for this user
    let existingProject
    try {
      existingProject = await getProjectByUrl(user.id, url)
    } catch (dbError) {
      console.error('❌ /api/analyze - Database error when fetching existing project:', dbError)
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
      // Re-throw other errors to be caught by outer catch
      throw dbError
    }

    if (existingProject && existingProject.research_data && existingProject.plan) {
      // Return existing project data
      return NextResponse.json({
        session_id: existingProject.id,
        id: existingProject.id,
        research_data: existingProject.research_data,
        plan: existingProject.plan,
      })
    }

    // Step 1: Research the site
    const researchData: ResearchData = await researchSite(url)

    // Step 2: Generate content plan
    const plan: PlanItem[] = await generateContentPlan(researchData)

    // Step 3: Save to database
    let project
    try {
      project = await createProject(user.id, url, researchData, plan)
    } catch (dbError) {
      console.error('❌ /api/analyze - Database error:', dbError)
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
      // Re-throw other errors to be caught by outer catch
      throw dbError
    }

    if (!project) {
      return NextResponse.json(
        { error: 'Failed to save project' },
        { status: 500 }
      )
    }

    console.log('✓ /api/analyze - Successfully analyzed and saved project:', {
      projectId: project.id,
      url,
      planItems: plan.length,
    })

    return NextResponse.json({
      session_id: project.id,
      id: project.id,
      research_data: researchData,
      plan,
    })
  } catch (error) {
    console.error('❌ /api/analyze - Error:', error)
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

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = body

    if (!email || !name) {
      return NextResponse.json(
        { success: false, error: 'Email and name are required' },
        { status: 400 }
      )
    }

    // Use the server client which handles cookies via next/headers
    const supabase = createClient()
    
    // Generate a deterministic password based on email
    // This allows us to sign in existing users without storing passwords
    const deterministicPassword = `Temp${Buffer.from(email).toString('base64').slice(0, 20)}!A1`

    // Try to sign up first
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: deterministicPassword,
      options: {
        data: {
          full_name: name,
        },
      },
    })

    // If signup succeeds, return success
    // Cookies are automatically set by the server client via next/headers
    if (signUpData?.session) {
      return NextResponse.json({
        success: true,
        session: signUpData.session,
        user: signUpData.user,
      })
    }

    // If user already exists, try to sign them in
    if (signUpError && (signUpError.message.includes('already registered') || 
                        signUpError.message.includes('already exists'))) {
      
      // Use admin client to reset password for existing user
      const adminClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      )

      // Update user's password using admin client
      const { data: userData } = await adminClient.auth.admin.listUsers()
      const existingUser = userData?.users?.find(u => u.email === email)

      if (existingUser) {
        // Reset password using admin API
        await adminClient.auth.admin.updateUserById(existingUser.id, {
          password: deterministicPassword,
          user_metadata: {
            full_name: name,
          },
        })

        // Now sign in with the deterministic password
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: deterministicPassword,
        })

        if (signInData?.session) {
          // Cookies are automatically set by the server client via next/headers
          return NextResponse.json({
            success: true,
            session: signInData.session,
            user: signInData.user,
          })
        }

        if (signInError) {
          console.error('Sign in error:', signInError)
          return NextResponse.json(
            { success: false, error: signInError.message },
            { status: 500 }
          )
        }
      }

      return NextResponse.json(
        { success: false, error: 'Could not sign in existing user' },
        { status: 500 }
      )
    }

    // Other signup errors
    if (signUpError) {
      console.error('Signup error:', signUpError)
      return NextResponse.json(
        { success: false, error: signUpError.message },
        { status: 500 }
      )
    }

    // Unexpected state
    return NextResponse.json(
      { success: false, error: 'Unexpected error occurred' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Quick access API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

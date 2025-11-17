import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient(cookieStore = cookies()) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!supabaseUrl || supabaseUrl === '' || !supabaseUrl.startsWith('http')) {
    throw new Error(
      'Invalid or missing NEXT_PUBLIC_SUPABASE_URL. Please check your .env.local file and ensure it contains a valid Supabase URL (should start with https://)'
    )
  }

  if (!supabaseAnonKey || supabaseAnonKey === '') {
    throw new Error(
      'Invalid or missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Please check your .env.local file and ensure it contains a valid Supabase anonymous key.'
    )
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
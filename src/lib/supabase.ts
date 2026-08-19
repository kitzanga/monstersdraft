import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

if (!supabaseConfigured) {
  console.error(
    '[Draft Day Board] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
    'The app will not be able to connect to the database.'
  )
}

export const supabase = supabaseConfigured
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!)
  : (null as unknown as ReturnType<typeof createClient<Database>>)
